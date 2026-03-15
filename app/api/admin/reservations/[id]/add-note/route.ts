import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { logReservationHistory } from '@/lib/logReservationHistory';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { note_text, note_category } = body;

        // Next.js 15: params must be awaited
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing reservation ID' }, { status: 400 });
        }

        if (!note_text || !note_category) {
            return NextResponse.json({ success: false, error: 'Missing note_text or note_category' }, { status: 400 });
        }

        const primaryEmail = user?.emailAddresses?.[0]?.emailAddress ?? 'unknown';

        await logReservationHistory({
            reservation_id: id,
            action_type: 'manual_note',
            performed_by: user?.id,
            performed_by_email: primaryEmail,
            performed_by_role: 'admin',
            note_category: note_category,
            notes: note_text
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error('[add-note] Error:', e);
        return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
    }
}
