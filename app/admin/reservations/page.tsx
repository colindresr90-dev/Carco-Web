import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReservationsTable } from './ReservationsTable';

export default async function AdminReservationsPage() {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
        redirect('/');
    }

    // 2. Check admin role via publicMetadata
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
                    <a
                        href="/"
                        className="mt-8 inline-block text-xs uppercase tracking-widest text-[#A68966] hover:text-white transition-colors"
                    >
                        ← Return Home
                    </a>
                </div>
            </div>
        );
    }

    const supabase = createClient();

    // 3. Fetch all reservations
    const { data: reservations, error } = await supabase
        .from('reservations')
        .select('id, reservation_number, vehicle_id, pickup_date, return_date, total_price, status, created_at, driver_first_name, driver_last_name, driver_email, driver_phone, user_id')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[AdminReservationsPage] Supabase error:', error.message);
    }

    const data = reservations ?? [];

    // 4. Compute dashboard metrics
    const metrics = {
        total: data.length,
        pending: data.filter((r) => r.status === 'pending').length,
        confirmed: data.filter((r) => r.status === 'confirmed').length,
        delivered: data.filter((r) => r.status === 'delivered').length,
        completed: data.filter((r) => r.status === 'completed').length,
        cancelled: data.filter((r) => r.status === 'cancelled').length,
        revenue: data.reduce((sum, r) => sum + (Number(r.total_price) || 0), 0),
    };

    // 5. Fetch vehicles based on reservations
    const vehicleIds = [...new Set(data.map(r => r.vehicle_id))];
    let vehiclesMap: any[] = [];
    if (vehicleIds.length > 0) {
        const { data: vData } = await supabase
            .from('vehicles')
            .select('id, slug, brand, model, hero_image, year, category, transmission')
            .in('slug', vehicleIds);
        vehiclesMap = vData || [];
    }

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-[#d8cfc4]" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Header ── */}
            <header className="border-b border-white/8 px-8 md:px-12 py-5 flex items-center justify-between bg-[#0e0e0e]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-5">
                    <a
                        href="/"
                        className="text-[10px] uppercase tracking-[0.25em] text-[#6b6b6b] hover:text-[#A68966] transition-colors"
                    >
                        ← CarCo
                    </a>
                    <span className="text-white/10">|</span>
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#A68966] block font-medium">
                            Management
                        </span>
                        <h1 className="text-base font-serif italic text-[#ece8e1] leading-tight">
                            Reservations Control Center
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">
                        {data.length} record{data.length !== 1 ? 's' : ''}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </header>

            {/* ── Main ── */}
            <main className="px-8 md:px-12 py-10 max-w-[1500px] mx-auto">

                {/* ── Metrics Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {/* Total */}
                    <MetricCard
                        label="Total Reservations"
                        value={metrics.total.toString()}
                        accent="#A68966"
                        glow="rgba(166,137,102,0.12)"
                    />
                    {/* Pending */}
                    <MetricCard
                        label="Pending"
                        value={metrics.pending.toString()}
                        accent="#f59e0b"
                        glow="rgba(245,158,11,0.10)"
                    />
                    {/* Confirmed */}
                    <MetricCard
                        label="Confirmed"
                        value={metrics.confirmed.toString()}
                        accent="#60a5fa"
                        glow="rgba(96,165,250,0.10)"
                    />
                    {/* Delivered */}
                    <MetricCard
                        label="Delivered"
                        value={metrics.delivered.toString()}
                        accent="#d4af6e"
                        glow="rgba(212,175,110,0.10)"
                    />
                    {/* Revenue */}
                    <MetricCard
                        label="Total Revenue"
                        value={`$${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                        accent="#34d399"
                        glow="rgba(52,211,153,0.10)"
                        wide
                    />
                </div>

                {/* ── Section Header ── */}
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#A68966] mb-1 font-medium">
                            Live Data
                        </p>
                        <h2 className="text-xl font-serif italic text-[#ece8e1]">All Reservations</h2>
                    </div>
                    {error && (
                        <p className="text-xs text-red-400 bg-red-400/10 px-4 py-2 rounded-md border border-red-400/20">
                            Failed to load — {error.message}
                        </p>
                    )}
                </div>

                {/* ── Gold divider ── */}
                <div className="h-px bg-gradient-to-r from-[#A68966]/60 via-[#d4af6e]/30 to-transparent mb-6" />

                {/* ── Table Card ── */}
                <div className="bg-[#141414] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl">
                    <ReservationsTable initialData={data} vehiclesMap={vehiclesMap} />
                </div>

                {/* ── Footer note ── */}
                <p className="mt-6 text-[10px] text-[#3a3a3a] text-center uppercase tracking-widest">
                    Status changes are applied immediately · CarCo Admin Console
                </p>
            </main>
        </div>
    );
}

// ── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({
    label,
    value,
    accent,
    glow,
    wide = false,
}: {
    label: string;
    value: string;
    accent: string;
    glow: string;
    wide?: boolean;
}) {
    return (
        <div
            className={`relative rounded-xl border border-white/[0.07] bg-[#141414] px-5 py-4 overflow-hidden ${wide ? 'md:col-span-2 lg:col-span-1' : ''}`}
            style={{ boxShadow: `0 0 20px ${glow}` }}
        >
            {/* Glow blob */}
            <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-30"
                style={{ background: accent }}
            />
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#6b6b6b] mb-2">{label}</p>
            <p className="text-2xl font-bold tabular-nums tracking-tight" style={{ color: accent }}>
                {value}
            </p>
        </div>
    );
}
