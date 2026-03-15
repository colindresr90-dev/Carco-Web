import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(
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

        // Next.js 15 requires awaiting params
        const { id } = await params;
        console.log(`[get-history] Requested history for reservation ID: ${id}`);

        if (!id) {
            console.warn('[get-history] Missing reservation ID');
            return NextResponse.json({ success: false, error: 'Missing reservation ID' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabaseAdmin
            .from('reservation_history')
            .select(`
                id,
                action_type,
                performed_by,
                performed_by_email,
                performed_by_role,
                notes,
                refund_type,
                refund_amount,
                created_at,
                note_category
            `)
            .eq('reservation_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[get-history] DB Error:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
        }

        console.log(`[get-history] Successfully fetched ${data?.length || 0} history records for ${id}`);
        return NextResponse.json({ history: data });

    } catch (e: any) {
        console.error('[get-history] Server Error (Catch block):', e);
        return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
    }
}
