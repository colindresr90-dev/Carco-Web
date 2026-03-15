'use server';

import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export interface CreateReservationInput {
    vehicle_id: string;
    pickup_date: string;
    return_date: string;
    total_price: number;
    driver_first_name: string;
    driver_last_name: string;
    driver_email: string;
    driver_phone: string;
}

export interface CreateReservationResult {
    success: boolean;
    error?: string;
}

export async function createReservation(
    input: CreateReservationInput
): Promise<CreateReservationResult> {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'You must be signed in to make a reservation.' };
    }

    const {
        vehicle_id,
        pickup_date,
        return_date,
        total_price,
        driver_first_name,
        driver_last_name,
        driver_email,
        driver_phone,
    } = input;

    // Date validation
    if (new Date(return_date) <= new Date(pickup_date)) {
        return { success: false, error: 'Return date must be after pick-up date.' };
    }

    const { error } = await supabase.from('reservations').insert({
        vehicle_id,
        user_id: userId,
        pickup_date,
        return_date,
        total_price,
        status: 'pending',
        driver_first_name,
        driver_last_name,
        driver_email,
        driver_phone,
    });

    if (error) {
        console.error('[createReservation]', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}
