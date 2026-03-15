import { createClient } from '@supabase/supabase-js';

type NoteCategory =
    | 'general'
    | 'customer_request'
    | 'internal_note'
    | 'payment_issue'
    | 'vip'
    | 'incident'
    | 'system';

interface LogHistoryParams {
    reservation_id: string;
    action_type: string;
    performed_by?: string;
    performed_by_email?: string;
    performed_by_role?: string;
    notes?: string;
    refund_type?: string;
    refund_amount?: number;
    note_category: NoteCategory;
}

export async function logReservationHistory(params: LogHistoryParams) {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabaseAdmin.from('reservation_history').insert([
            {
                reservation_id: params.reservation_id,
                action_type: params.action_type,
                performed_by: params.performed_by || 'system',
                performed_by_email: params.performed_by_email || 'system@carco.com',
                performed_by_role: params.performed_by_role || 'system',
                notes: params.notes || null,
                refund_type: params.refund_type || null,
                refund_amount: params.refund_amount || null,
                note_category: params.note_category,
            }
        ]);

        if (error) {
            console.error('[logReservationHistory] Failed to insert history record:', error.message, params);
        }
    } catch (err) {
        console.error('[logReservationHistory] Unexpected error inserting history:', err);
    }
}
