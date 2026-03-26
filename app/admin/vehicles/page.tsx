import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import VehiclesTable from './VehiclesTable';

export default async function AdminVehiclesPage() {
    const { userId } = await auth();
    if (!userId) redirect('/');

    const user = await currentUser();
    const isAdmin = (user?.publicMetadata as { role?: string })?.role === 'admin';

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#6b6b6b] mb-3">
                        403 — Forbidden
                    </p>
                    <h1 className="text-3xl font-serif italic text-[#d8cfc4]">Access denied.</h1>
                    <p className="mt-4 text-sm text-[#6b6b6b]">
                        You do not have permission to view this page.
                    </p>
                    <a href="/" className="mt-8 inline-block text-xs uppercase tracking-widest text-[#A68966] hover:text-white transition-colors">
                        ← Return Home
                    </a>
                </div>
            </div>
        );
    }

    // Bypass RLS using the Service Role Key
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: vehicles, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .order('id', { ascending: true });

    if (error) console.error('[AdminVehiclesPage] Supabase error:', error.message);

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-[#d8cfc4]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <header className="border-b border-white/8 px-8 md:px-12 py-5 flex items-center justify-between bg-[#0e0e0e]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-5">
                    <a href="/admin/reservations" className="text-[10px] uppercase tracking-[0.25em] text-[#6b6b6b] hover:text-[#A68966] transition-colors">
                        ← CarCo Admin
                    </a>
                    <span className="text-white/10">|</span>
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#A68966] block font-medium">Management</span>
                        <h1 className="text-base font-serif italic text-[#ece8e1] leading-tight">Vehicles Control Center</h1>
                    </div>
                </div>
            </header>
            <main className="px-8 md:px-12 py-10 max-w-[1500px] mx-auto">
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#1A1714] mb-1 font-medium">Live Data</p>
                        <h2 className="text-xl font-serif italic text-[#ece8e1]">Fleet Registry</h2>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-[#A68966]/60 via-[#d4af6e]/30 to-transparent mb-6" />
                <div className="bg-[#141414] border border-white/[0.07] rounded-xl overflow-hidden shadow-2xl">
                    <VehiclesTable initialData={vehicles || []} />
                </div>
            </main>
        </div>
    );
}
