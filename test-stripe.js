const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function test() {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: 'test@example.com',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Kia Forte',
                            description: 'Test',
                        },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                vehicle_id: '123',
                pickup_date: '2026-03-01',
                return_date: '2026-03-03',
                total_price: '10',
                user_id: 'ur_123',
                driver_first_name: 'John',
                driver_last_name: 'Doe',
                driver_phone: '123',
            },
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });
        console.log(session.url)
    } catch (err) {
        console.error(err);
    }
}

test();
