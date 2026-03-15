import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const driver_email = user.primaryEmailAddress?.emailAddress;

        if (!driver_email) {
            return NextResponse.json({ success: false, error: 'User does not have an email address' }, { status: 400 });
        }

        const body = await req.json();
        const {
            vehicle_id, pickup_date, return_date, total_price, vehicle_name,
            driver_first_name, driver_last_name, driver_phone
        } = body;

        if (!vehicle_id || !pickup_date || !return_date || !total_price || !driver_first_name || !driver_last_name || !driver_phone) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const appUrl = req.nextUrl.origin || 'http://localhost:3000';

        console.log('[create-checkout-session] Resolved appUrl:', appUrl);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: driver_email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: vehicle_name ? `CarCo Rental – ${vehicle_name}` : 'CarCo Car Rental',
                            description: `Pick-up: ${pickup_date} → Return: ${return_date}`,
                        },
                        unit_amount: Math.round(total_price * 100), // cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                vehicle_id,
                pickup_date,
                return_date,
                total_price: String(total_price),
                user_id: userId,
                driver_first_name,
                driver_last_name,
                driver_email,
                driver_phone,
            },
            success_url: `${appUrl}/reserve/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/reserve`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        console.error('[create-checkout-session]', message);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
