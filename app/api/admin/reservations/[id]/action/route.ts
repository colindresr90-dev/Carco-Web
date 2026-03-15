import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
    sendReservationConfirmedEmail,
    sendReservationCancelledEmail
} from '@/lib/email-service';
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
        const { action, status: newStatus } = body;

        // Next.js 15: params must be awaited
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing reservation ID' }, { status: 400 });
        }

        if (!['resend_confirmation', 'resend_cancellation', 'change_status'].includes(action)) {
            return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }

        // Fetch reservation
        const { data: reservation, error: fetchError } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !reservation) {
            return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
        }

        const { data: vehicle } = await supabase.from('vehicles').select('brand, model').eq('id', reservation.vehicle_id).single();
        if (!vehicle) {
            return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
        }

        const customerName = [reservation.driver_first_name, reservation.driver_last_name].filter(Boolean).join(' ') || 'Customer';

        if (action === 'resend_confirmation') {
            if (reservation.driver_email) {
                await sendReservationConfirmedEmail({
                    to: reservation.driver_email,
                    customerName,
                    reservationNumber: reservation.reservation_number || id.substring(0, 8),
                    vehicleName: `${vehicle.brand} ${vehicle.model}`,
                    pickupDate: new Date(reservation.pickup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                    returnDate: new Date(reservation.return_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                    pickupLocation: 'CarCo Central Hub',
                    total: `$${Number(reservation.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                });
                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ success: false, error: 'No email found for customer' }, { status: 400 });
        }

        if (action === 'resend_cancellation') {
            if (reservation.driver_email) {
                await sendReservationCancelledEmail({
                    to: reservation.driver_email,
                    customerName,
                    reservationNumber: reservation.reservation_number || id.substring(0, 8),
                    vehicleName: `${vehicle.brand} ${vehicle.model}`,
                    pickupDate: new Date(reservation.pickup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                    returnDate: new Date(reservation.return_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
                    pickupLocation: 'CarCo Central Hub',
                });
                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ success: false, error: 'No email found for customer' }, { status: 400 });
        }

        if (action === 'change_status') {
            if (!newStatus) return NextResponse.json({ success: false, error: 'Missing new status' }, { status: 400 });
            if (newStatus === 'cancelled') return NextResponse.json({ success: false, error: 'Cannot cancel via change_status' }, { status: 400 });

            const oldStatus = reservation.status;

            const { error: updateError } = await supabase
                .from('reservations')
                .update({ status: newStatus })
                .eq('id', id);

            if (updateError) {
                return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
            }

            // Insert into history
            const primaryEmail = user?.emailAddresses?.[0]?.emailAddress ?? 'unknown';
            await logReservationHistory({
                reservation_id: id,
                action_type: 'status_changed',
                performed_by: user?.id,
                performed_by_email: primaryEmail,
                performed_by_role: 'admin',
                note_category: 'general',
                notes: `Status changed from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}`
            });

            return NextResponse.json({ success: true, status: newStatus });
        }

        return NextResponse.json({ success: false, error: 'Unknown server error' }, { status: 500 });

    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 });
    }
}
