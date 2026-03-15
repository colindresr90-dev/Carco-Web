import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendReservationConfirmedEmail } from '@/lib/email-service';
import { logReservationHistory } from '@/lib/logReservationHistory';

console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Service Role Key Exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ success: false, error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type !== 'checkout.session.completed') {
        return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log("Webhook Event Type:", event.type);
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;
    if (!metadata) {
        console.error('No metadata found in session');
        return NextResponse.json({ success: false, error: 'No metadata' }, { status: 400 });
    }
    console.log("Session Metadata:", metadata);

    const {
        vehicle_id, pickup_date, return_date, total_price, user_id,
        driver_first_name, driver_last_name, driver_email, driver_phone
    } = metadata;

    if (!vehicle_id || !pickup_date || !return_date || !total_price || !user_id || !driver_first_name || !driver_last_name || !driver_email || !driver_phone) {
        console.error("Missing metadata from Stripe session:", {
            vehicle_id, pickup_date, return_date, total_price, user_id,
            driver_first_name, driver_last_name, driver_email, driver_phone
        });
        return NextResponse.json({ success: false, error: "Missing metadata from Stripe session" }, { status: 400 });
    }

    console.log("Parsed Metadata:", {
        user_id,
        vehicle_id,
        pickup_date,
        return_date,
        total_price,
    });

    const generateReservationNumber = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `CARCO-${result}`;
    };

    const reservation_number = generateReservationNumber();

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Prevent duplicate processing if webhook retries
    const { data: existingReservation } = await supabase
        .from('reservations')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();

    if (existingReservation) {
        console.log(`Reservation for session ${session.id} already exists (ID: ${existingReservation.id}). Skipping creation to prevent duplicate history logs.`);
        return NextResponse.json({ received: true }, { status: 200 });
    }

    console.log("Attempting Supabase insert...");
    const { data: insertedRes, error } = await supabase.from('reservations').insert([
        {
            vehicle_id,
            pickup_date,
            return_date,
            total_price: parseFloat(total_price),
            user_id,
            driver_first_name,
            driver_last_name,
            driver_email,
            driver_phone,
            status: 'confirmed',
            stripe_session_id: session.id,
            reservation_number,
        },
    ]).select('id').single();

    if (error || !insertedRes) {
        console.error("Supabase Insert Error:", error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    // Insert into history
    await logReservationHistory({
        reservation_id: insertedRes.id,
        action_type: 'reservation_created',
        performed_by_role: 'system',
        note_category: 'system',
        notes: 'Reservation created after successful Stripe payment'
    });

    console.log("Reservation successfully inserted.");
    console.log(`Reservation confirmed for user ${user_id} and vehicle ${vehicle_id}`);

    // Enviar email de confirmación
    const { data: vehicle } = await supabase.from('vehicles').select('brand, model').eq('id', vehicle_id).single();
    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehículo Premium";

    try {
        const emailResult = await sendReservationConfirmedEmail({
            to: driver_email,
            customerName: `${driver_first_name} ${driver_last_name}`,
            reservationNumber: reservation_number,
            vehicleName,
            pickupDate: new Date(pickup_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            returnDate: new Date(return_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            pickupLocation: "Aeropuerto Internacional de El Salvador (SAL)",
            total: `$${parseFloat(total_price).toFixed(2)}`
        });

        if (emailResult.success) {
            console.log("Email enviado correctamente via Resend sandbox");
        } else {
            console.log("Error enviando email:", emailResult.error);
        }
    } catch (emailError) {
        console.error("Error enviando email (excepción):", emailError);
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
