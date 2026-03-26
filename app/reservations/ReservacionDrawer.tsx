'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ReservationStatus = 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

export interface UserReservation {
    id: string;
    vehicle_id: string;
    pickup_date: string;
    return_date: string;
    total_price: number;
    status: ReservationStatus;
    created_at: string;
    driver_first_name?: string;
    driver_last_name?: string;
    driver_email?: string;
    driver_phone?: string;
    user_id?: string;
    reservation_number?: string;
}

const STATUS_STYLE: Record<ReservationStatus, { bg: string; text: string; border: string; label: string }> = {
    pending: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.30)', label: 'Pendiente' },
    confirmed: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.30)', label: 'Confirmada' },
    delivered: { bg: 'rgba(212,175,110,0.14)', text: '#d4af6e', border: 'rgba(212,175,110,0.30)', label: 'Entregada' },
    completed: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.30)', label: 'Completada' },
    cancelled: { bg: 'rgba(239,68,68,0.10)', text: '#f87171', border: 'rgba(239,68,68,0.25)', label: 'Cancelada' },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateTime(d: string) {
    return new Date(d).toLocaleString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}
function durationDays(a: string, b: string) {
    const diff = new Date(b).getTime() - new Date(a).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#A68966] font-semibold">{label}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#A68966]/30 to-transparent" />
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

// ── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 border-b border-white/[0.04]">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#5a5a5a] flex-shrink-0 mt-0.5">{label}</span>
            <span className={`text-right text-xs text-[#d8cfc4] leading-snug ${mono ? 'font-mono text-[11px] text-[#A68966]' : ''}`}>
                {value || <span className="text-[#3a3a3a] italic">—</span>}
            </span>
        </div>
    );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
interface Props {
    reservation: UserReservation | null;
    vehicle?: any;
    onClose: () => void;
}

export function ReservacionDrawer({ reservation, vehicle, onClose }: Props) {
    const open = !!reservation;

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const res = reservation;
    const st = STATUS_STYLE[res?.status ?? 'pending'];
    const days = res ? durationDays(res.pickup_date, res.return_date) : 0;

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* ── Drawer Panel ── */}
            <aside
                className="fixed top-0 right-0 h-full w-full max-w-[480px] z-50 flex flex-col
                           bg-[#111111] border-l border-white/[0.08] shadow-2xl overflow-hidden
                           transition-transform duration-300 ease-out"
                style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
                aria-label="Panel de detalle de reserva"
            >
                {/* ── Top accent line ── */}
                <div className="h-px bg-gradient-to-r from-[#A68966]/80 via-[#d4af6e]/50 to-transparent flex-shrink-0" />

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#1A1714] font-semibold mb-0.5">Panel Privado</p>
                        <h2 className="font-serif italic text-[#ece8e1] text-base leading-tight">
                            Detalles de la Reserva
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05]
                                   hover:bg-white/10 text-[#6b6b6b] hover:text-white transition-all"
                        aria-label="Cerrar panel"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Scrollable content ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
                    {!res ? null : (
                        <>
                            {/* ── Vehicle image strip ── */}
                            {vehicle?.hero_image && (
                                <div className="relative h-36 rounded-xl overflow-hidden bg-[#1a1a1a]">
                                    <Image
                                        src={`${vehicle.hero_image}`}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        fill
                                        quality={90}
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover opacity-70"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-4">
                                        <p className="text-white font-serif italic text-lg leading-tight">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                        <p className="text-[#1A1714] text-[10px] uppercase tracking-[0.15em] capitalize">
                                            {vehicle.year} · {vehicle.category} · {vehicle.transmission}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── Vehículo ── */}
                            <Section label="Vehículo">
                                <div className="flex items-center justify-between gap-4">
                                    <InfoRow label="Nombre" value={vehicle ? `${vehicle.brand} ${vehicle.model}` : res.vehicle_id} />
                                    {vehicle && (
                                        <Link
                                            href={`/vehicles/${vehicle.id}`}
                                            className="px-3 py-1.5 bg-[#A68966]/10 hover:bg-[#A68966]/20 text-[#A68966] text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-[#A68966]/20"
                                        >
                                            Ver Vehículo
                                        </Link>
                                    )}
                                </div>
                                {vehicle && (
                                    <>
                                        <InfoRow label="Motor" value={vehicle.engine} />
                                        <InfoRow label="Categoría" value={`${vehicle.category} · ${vehicle.transmission}`} />
                                    </>
                                )}
                            </Section>

                            {/* ── Conductor ── */}
                            <Section label="Conductor">
                                <InfoRow
                                    label="Nombre"
                                    value={[res.driver_first_name, res.driver_last_name].filter(Boolean).join(' ') || '—'}
                                />
                                <InfoRow label="Email" value={res.driver_email ?? '—'} />
                                <InfoRow label="Teléfono" value={res.driver_phone ?? '—'} />
                            </Section>

                            {/* ── Detalles ── */}
                            <Section label="Detalles">
                                <InfoRow label="Fecha de recogida" value={formatDate(res.pickup_date)} />
                                <InfoRow label="Fecha de devolución" value={formatDate(res.return_date)} />
                                <InfoRow label="Duración" value={`${days} día${days !== 1 ? 's' : ''}`} />
                                <InfoRow
                                    label="Total"
                                    value={`$${Number(res.total_price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                                />
                            </Section>

                            {/* ── Estado ── */}
                            <Section label="Estado">
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#5a5a5a]">Estado actual</span>
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border"
                                        style={{ background: st.bg, color: st.text, borderColor: st.border }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.text }} />
                                        {st.label}
                                    </span>
                                </div>
                            </Section>

                            {/* ── Sistema ── */}
                            <Section label="Información del Sistema">
                                <InfoRow label="Nº de reserva" value={res.reservation_number || '—'} mono />
                                <InfoRow label="ID interno" value={res.id} mono />
                                <InfoRow label="Fecha de creación" value={formatDateTime(res.created_at)} />
                            </Section>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06]">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#3a3a3a] text-center">
                        CarCo · Reservas privadas y seguras
                    </p>
                </div>
            </aside>
        </>
    );
}
