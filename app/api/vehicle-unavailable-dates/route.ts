import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicle_id');

    if (!vehicleId) {
        return NextResponse.json({ success: false, error: 'vehicle_id is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('pickup_date, return_date')
            .eq('vehicle_id', vehicleId)
            .in('status', ['confirmed']);

        if (error) {
            throw error;
        }

        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching unavailable dates:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
