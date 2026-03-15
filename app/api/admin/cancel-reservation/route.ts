import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { sendReservationCancelledEmail } from '@/lib/email-service';
import { logReservationHistory } from '@/lib/logReservationHistory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover' as any,
});

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();
        const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';
        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { reservation_id, refund_type, amount, cancellation_reason } = body;

        if (!reservation_id || !refund_type || !cancellation_reason) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch reservation
        const { data: reservation, error: fetchError } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', reservation_id)
            .single();

        if (fetchError || !reservation) {
            return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
        }

        if (reservation.status !== 'confirmed') {
            return NextResponse.json({ success: false, error: 'Reservation is not in confirmed status' }, { status: 400 });
        }

        let refundAmount = 0;

        // Process Refund if necessary
        if (refund_type === 'full' || refund_type === 'partial') {
            if (!reservation.stripe_session_id) {
                return NextResponse.json({ success: false, error: 'No Stripe session found for this reservation' }, { status: 400 });
            }

            // Retrieve the session to get the payment intent
            const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id);
            const paymentIntentId = session.payment_intent as string;

            if (!paymentIntentId) {
                return NextResponse.json({ success: false, error: 'No Payment Intent found for this session' }, { status: 400 });
            }

            try {
                if (refund_type === 'full') {
                    const refund = await stripe.refunds.create({
                        payment_intent: paymentIntentId,
                    });
                    refundAmount = reservation.total_price;
                } else if (refund_type === 'partial') {
                    if (!amount || amount <= 0) {
                        return NextResponse.json({ success: false, error: 'Invalid partial refund amount' }, { status: 400 });
                    }
                    const refund = await stripe.refunds.create({
                        payment_intent: paymentIntentId,
                        amount: Math.round(amount * 100), // Convert to cents
                    });
                    refundAmount = amount;
                }
            } catch (stripeError: any) {
                await logReservationHistory({
                    reservation_id,
                    action_type: 'refund_failed',
                    performed_by: user?.id,
                    performed_by_email: user?.emailAddresses?.[0]?.emailAddress ?? 'unknown',
                    performed_by_role: 'admin',
                    note_category: 'payment_issue',
                    notes: `Refund failed: ${stripeError.message}`
                });
                return NextResponse.json({ success: false, error: 'Stripe refund failed: ' + stripeError.message }, { status: 500 });
            }
        }

        // Update database
        const { error: updateError } = await supabase
            .from('reservations')
            .update({
                status: 'cancelled',
                refund_amount: refundAmount,
                cancelled_by: 'admin',
                cancelled_at: new Date().toISOString(),
                cancellation_reason
            })
            .eq('id', reservation_id);

        if (updateError) {
            return NextResponse.json({ success: false, error: 'Failed to update reservation status in DB' }, { status: 500 });
        }

        // Insert into history
        const primaryEmail = user?.emailAddresses?.[0]?.emailAddress ?? 'unknown';
        try {
            await logReservationHistory({
                reservation_id: reservation_id,
                action_type: 'cancelled_by_admin',
                performed_by: user?.id,
                performed_by_email: primaryEmail,
                performed_by_role: 'admin',
                refund_type: refund_type,
                refund_amount: refundAmount || 0,
                note_category: 'payment_issue',
                notes: cancellation_reason ? `Reason: ${cancellation_reason}` : 'No reason provided'
            });

            // 7. ADD FALLBACK TEST INSERT
            await logReservationHistory({
                reservation_id: reservation_id,
                action_type: 'debug_test',
                note_category: 'system',
                notes: 'Debug entry after cancellation'
            });
        } catch (logError) {
            console.error('[cancel-reservation] Error inserting history log:', logError);
        }

        // Send email
        const { data: vehicle } = await supabase.from('vehicles').select('brand, model').eq('id', reservation.vehicle_id).single();
        const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehículo Premium";
        const customerName = [reservation.driver_first_name, reservation.driver_last_name].filter(Boolean).join(' ') || 'Customer';

        if (reservation.driver_email) {
            await sendReservationCancelledEmail({
                to: reservation.driver_email,
                customerName,
                reservationNumber: reservation.reservation_number || reservation_id.substring(0, 8),
                vehicleName,
                pickupDate: new Date(reservation.pickup_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                returnDate: new Date(reservation.return_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                pickupLocation: 'Aeropuerto Internacional de El Salvador (SAL)',
                refundAmount: refundAmount,
                cancellationReason: cancellation_reason
            });
        }

        return NextResponse.json({ success: true, status: 'cancelled', refundAmount });

    } catch (e: any) {
        console.error('[cancel-reservation] Error:', e);
        return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
    }
}
