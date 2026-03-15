import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// Configure the recipient email address here for local testing
const TEST_EMAIL_TO = 'delivered@resend.dev';

export async function GET() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'CarCo <info@taskmasters.site>',
            to: [TEST_EMAIL_TO],
            subject: 'CarCo Local Email Test',
            html: '<h1>Local Email Test Successful</h1><p>This email confirms that the local email sending infrastructure is set up and working correctly in the CarCo development environment.</p>',
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during email creation';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
