import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/ui/navbar';
import { ReservacionesClient } from './ReservacionesClient';
import type { UserReservation } from './ReservacionDrawer';

export const metadata = {
    title: 'Mis Reservas — CarCo',
    description: 'Consulta y gestiona tus reservas con CarCo.',
};

export default async function MisReservasPage() {
    // 1. Require authentication
    const { userId } = await auth();
    if (!userId) {
        redirect('/login');
    }

    const supabase = createClient();

    // 2. Fetch reservations for this user only
    const { data: reservations, error } = await supabase
        .from('reservations')
        .select(
            'id, vehicle_id, pickup_date, return_date, total_price, status, created_at, driver_first_name, driver_last_name, driver_email, driver_phone, user_id, reservation_number'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[MisReservasPage] Supabase error:', error.message);
    }

    const data: UserReservation[] = reservations ?? [];

    // 3. Fetch vehicles referenced by the user's reservations
    let referencedVehicles: any[] = [];
    if (data.length > 0) {
        const vehicleIds = [...new Set(data.map(r => r.vehicle_id))];
        const { data: vData } = await supabase
            .from('vehicles')
            .select('id, slug, brand, model, hero_image, year, category, transmission, engine')
            .in('slug', vehicleIds);
        referencedVehicles = vData || [];
    }

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1A1714]">
            {/* Global site navbar */}
            <Navbar solid />

            <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
                {error && (
                    <div className="mb-6 px-5 py-3 rounded-xl bg-red-400/10 border border-red-400/20 text-xs text-red-400">
                        Error al cargar reservas — {error.message}
                    </div>
                )}

                <ReservacionesClient reservations={data} vehiclesMap={referencedVehicles} />
            </main>
        </div>
    );
}
