'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ReservacionDrawer, type UserReservation } from './ReservacionDrawer';

type Tab = 'proximas' | 'completadas' | 'canceladas';

const TAB_CONFIG: { id: Tab; label: string; statuses: string[] }[] = [
    { id: 'proximas', label: 'Próximas', statuses: ['pending', 'confirmed', 'delivered'] },
    { id: 'completadas', label: 'Completadas', statuses: ['completed'] },
    { id: 'canceladas', label: 'Canceladas', statuses: ['cancelled'] },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: { bg: '#FEF9EC', text: '#B45309', border: '#F4D06A', label: 'Pendiente' },
    confirmed: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', label: 'Confirmada' },
    delivered: { bg: '#FDFAF4', text: '#92681A', border: '#DFC37E', label: 'Entregada' },
    completed: { bg: '#F0FDF4', text: '#166534', border: '#86EFAC', label: 'Completada' },
    cancelled: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'Cancelada' },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function durationDays(a: string, b: string) {
    return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #f7f2eb 0%, #ede8df 100%)', border: '1px solid #DDD4C2' }}
            >
                <svg className="w-8 h-8" fill="none" stroke="#A68966" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#1A1714] font-bold mb-3">Sin resultados</p>
            <h3 className="font-serif italic text-[#1A1714] text-2xl mb-2">No tienes reservas activas</h3>
            <p className="text-sm text-[#7A6E65] mb-10 max-w-xs leading-relaxed">
                Explora nuestra flota y comienza tu viaje con CarCo.
            </p>
            <Link
                href="/vehicles"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300"
                style={{ background: '#A68966', color: '#fff' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#8a7055'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#A68966'; }}
            >
                Ver Vehículos
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
    );
}

// ── Reservation Card ──────────────────────────────────────────────────────────
function ReservationCard({
    reservation,
    vehicle,
    onClick,
}: {
    reservation: UserReservation;
    vehicle?: any;
    onClick: () => void;
}) {
    const st = STATUS_STYLE[reservation.status] ?? STATUS_STYLE.pending;
    const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : reservation.vehicle_id;
    const days = durationDays(reservation.pickup_date, reservation.return_date);

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer
                       transition-all duration-300 hover:-translate-y-1"
            style={{
                border: '1px solid #E8E1D9',
                boxShadow: '0 2px 12px rgba(26,23,20,0.06)',
            }}
            onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = '0 12px 40px rgba(166,137,102,0.18)';
                el.style.borderColor = '#A68966';
            }}
            onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.boxShadow = '0 2px 12px rgba(26,23,20,0.06)';
                el.style.borderColor = '#E8E1D9';
            }}
        >
            {/* Vehicle image strip */}
            <div className="relative h-48 overflow-hidden bg-[#F4F0EB]">
                {vehicle?.hero_image ? (
                    <Image
                        src={vehicle.hero_image}
                        alt={vehicleName}
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-[#CFC6BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                        </svg>
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                        style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.text }} />
                        {st.label}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="flex flex-col flex-1 p-6">
                {/* Vehicle name */}
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#1A1714] font-bold">Vehículo</p>
                        {reservation.reservation_number && (
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#B3A999] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8E1]">
                                {reservation.reservation_number}
                            </p>
                        )}
                    </div>
                    <h3 className="font-serif italic text-[#1A1714] text-xl leading-snug group-hover:text-[#A68966] transition-colors duration-200">
                        {vehicleName}
                    </h3>
                    {vehicle && (
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#9E9189] mt-0.5 capitalize">
                            {vehicle.year} · {vehicle.category}
                        </p>
                    )}
                </div>

                {/* Date row */}
                <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-[#EDE8E1]">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#9E9189] mb-1">Recogida</p>
                        <p className="text-xs text-[#1A1714] font-semibold">{formatDate(reservation.pickup_date)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#9E9189] mb-1">Devolución</p>
                        <p className="text-xs text-[#1A1714] font-semibold">{formatDate(reservation.return_date)}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#9E9189] mb-0.5">
                            Total · {days} día{days !== 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold tabular-nums text-[#1A1714]">
                            ${Number(reservation.total_price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ background: '#F4F0EB', border: '1px solid #DDD4C2' }}
                    >
                        <svg className="w-4 h-4 text-[#A68966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Client Component ─────────────────────────────────────────────────────
export function ReservacionesClient({ reservations, vehiclesMap = [] }: { reservations: UserReservation[], vehiclesMap: any[] }) {
    const [activeTab, setActiveTab] = useState<Tab>('proximas');
    const [selectedReservation, setSelectedReservation] = useState<UserReservation | null>(null);

    const filtered = useMemo(() => {
        const tab = TAB_CONFIG.find((t) => t.id === activeTab)!;
        return reservations.filter((r) => tab.statuses.includes(r.status));
    }, [reservations, activeTab]);

    const totalCount = reservations.length;

    return (
        <>
            {/* ── Page header ── */}
            <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#1A1714] font-bold mb-3">
                    Panel Privado
                </p>
                <h1 className="font-serif italic text-[#1A1714] text-4xl md:text-5xl leading-tight mb-4">
                    Gestiona Tus Reservas
                </h1>
                <p className="text-base text-[#7A6E65] max-w-xl leading-relaxed">
                    Consulta tus próximas reservas y gestiona tu experiencia con CarCo.
                </p>

                {/* Gold divider */}
                <div className="mt-8 h-px" style={{ background: 'linear-gradient(to right, #A68966, #d4af6e40, transparent)' }} />
            </div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-0 mb-10" style={{ borderBottom: '1px solid #E8E1D9' }}>
                {TAB_CONFIG.map((tab) => {
                    const count = reservations.filter((r) => tab.statuses.includes(r.status)).length;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="relative px-6 py-4 text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 focus:outline-none"
                            style={{ color: isActive ? '#1A1714' : '#9E9189' }}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span
                                    className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold tabular-nums"
                                    style={{
                                        background: isActive ? '#A68966' : '#EDE8E1',
                                        color: isActive ? '#fff' : '#9E9189',
                                    }}
                                >
                                    {count}
                                </span>
                            )}
                            {/* Active underline */}
                            {isActive && (
                                <span
                                    className="absolute bottom-0 left-0 right-0 h-0.5"
                                    style={{ background: '#A68966' }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Content ── */}
            {totalCount === 0 ? (
                <EmptyState />
            ) : filtered.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((reservation) => {
                        const vehicle = vehiclesMap.find(v => v.slug === reservation.vehicle_id);
                        return (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                vehicle={vehicle}
                                onClick={() => setSelectedReservation(reservation)}
                            />
                        );
                    })}
                </div>
            )}

            {/* ── Drawer ── */}
            <ReservacionDrawer
                reservation={selectedReservation}
                vehicle={selectedReservation ? vehiclesMap.find(v => v.slug === selectedReservation.vehicle_id) : null}
                onClose={() => setSelectedReservation(null)}
            />
        </>
    );
}
