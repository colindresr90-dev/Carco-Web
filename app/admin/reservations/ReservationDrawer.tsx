'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, Copy, Ban, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type ReservationStatus = 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

export interface DrawerReservation {
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
    cancelled_by?: string;
    cancelled_at?: string;
    refund_amount?: number;
    cancellation_reason?: string;
    stripe_session_id?: string;
}

const STATUS_OPTIONS: ReservationStatus[] = ['pending', 'confirmed', 'delivered', 'completed', 'cancelled'];

const STATUS_STYLE: Record<ReservationStatus, { bg: string; text: string; border: string }> = {
    pending: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b', border: 'rgba(245,158,11,0.30)' },
    confirmed: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.30)' },
    delivered: { bg: 'rgba(212,175,110,0.14)', text: '#d4af6e', border: 'rgba(212,175,110,0.30)' },
    completed: { bg: 'rgba(52,211,153,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.30)' },
    cancelled: { bg: 'rgba(239,68,68,0.10)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatDateTime(d: string) {
    return new Date(d).toLocaleString('en-US', {
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
function InfoRow({ label, value, mono = false, colSpan = 1, customValue }: { label: string; value?: string; mono?: boolean, colSpan?: number, customValue?: React.ReactNode }) {
    return (
        <div className={`flex flex-col gap-1.5 ${colSpan === 2 ? 'col-span-2' : 'col-span-1'}`}>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#5a5a5a]">{label}</span>
            <div className={`text-[13px] text-[#d8cfc4] leading-snug ${mono ? 'font-mono text-[#A68966]' : ''}`}>
                {customValue || (value ? value : <span className="text-[#3a3a3a] italic">—</span>)}
            </div>
        </div>
    );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
interface ReservationDrawerProps {
    reservation: DrawerReservation | null;
    vehicle?: any;
    onClose: () => void;
    onStatusChange: (id: string, status: ReservationStatus) => void;
}

export function ReservationDrawer({ reservation, vehicle, onClose, onStatusChange }: ReservationDrawerProps) {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [localStatus, setLocalStatus] = useState<ReservationStatus | null>(null);
    const [statusError, setStatusError] = useState(false);
    const [flashSuccess, setFlashSuccess] = useState(false);

    // Quick Actions state
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    // Cancel / Refund state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancellationReason, setCancellationReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');
    const [refundType, setRefundType] = useState<'none' | 'full' | 'partial'>('none');
    const [refundAmount, setRefundAmount] = useState<string>('');
    const [isCancelling, setIsCancelling] = useState(false);

    // Add Note state
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteCategory, setNoteCategory] = useState('general');
    const [isSubmittingNote, setIsSubmittingNote] = useState(false);

    const open = !!reservation;

    // Sync local status when drawer opens for a new reservation
    useEffect(() => {
        if (reservation) {
            setLocalStatus(reservation.status);
            setStatusError(false);
            setFlashSuccess(false);
            setActionLoading(null);
            setActionFeedback(null);
            setActionError(null);
            setCancellationReason('');
            setOtherReason('');
            setRefundType('none');
            setRefundAmount('');
        }
    }, [reservation?.id]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    async function handleCancelSubmit() {
        if (!reservation) return;

        let finalReason = cancellationReason;
        if (cancellationReason === 'Otro') {
            finalReason = otherReason;
        }

        if (!finalReason || finalReason.trim() === '') {
            toast.error('Debe seleccionar o ingresar un motivo de cancelación');
            return;
        }

        if (!finalReason || finalReason.trim() === '') {
            toast.error('Debe seleccionar o ingresar un motivo de cancelación');
            return;
        }

        if (refundType === 'partial' && (!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > reservation.total_price)) {
            toast.error('Monto de reembolso parcial inválido');
            return;
        }

        setIsCancelling(true);
        try {
            const response = await fetch('/api/admin/cancel-reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservation_id: reservation.id,
                    refund_type: refundType,
                    amount: refundType === 'partial' ? parseFloat(refundAmount) : undefined,
                    cancellation_reason: finalReason
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to cancel');
            }

            const result = await response.json();

            // Refrescar estado UI localmente
            setLocalStatus('cancelled');
            if (result.refundAmount !== undefined) reservation.refund_amount = result.refundAmount;
            reservation.cancelled_by = 'admin';
            reservation.cancelled_at = new Date().toISOString();

            onStatusChange(reservation.id, 'cancelled');
            toast.success('Reserva cancelada exitosamente con reembolso procesado.');
            setIsCancelModalOpen(false);
        } catch (error: any) {
            console.error('Action error:', error);
            toast.error(error.message || 'Error executing action');
        } finally {
            setIsCancelling(false);
        }
    }

    async function handleAddNote() {
        if (!reservation || !noteText.trim()) return;
        setIsSubmittingNote(true);
        try {
            const res = await fetch(`/api/admin/reservations/${reservation.id}/add-note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note_text: noteText, note_category: noteCategory }),
            });
            if (!res.ok) throw new Error('Failed to add note');
            toast.success('Note added successfully');
            setIsNoteModalOpen(false);
            setNoteText('');
            setNoteCategory('general');
        } catch (err: any) {
            toast.error(err.message || 'Error adding note');
        } finally {
            setIsSubmittingNote(false);
        }
    }

    async function handleStatusChange(newStatus: ReservationStatus) {
        if (!reservation) return;
        setUpdatingStatus(true);
        setStatusError(false);

        try {
            const resData = await fetch(`/api/admin/reservations/${reservation.id}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'change_status', status: newStatus }),
            });
            const data = await resData.json();

            if (!resData.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            setLocalStatus(newStatus);
            onStatusChange(reservation.id, newStatus);
            setFlashSuccess(true);
            setTimeout(() => setFlashSuccess(false), 1500);
        } catch (error: any) {
            console.error('[drawer updateStatus]', error.message);
            setStatusError(true);
        } finally {
            setUpdatingStatus(false);
        }
    }

    async function handleAction(action: 'cancel' | 'resend_confirmation' | 'resend_cancellation') {
        if (!reservation) return;

        if (action === 'cancel') {
            setIsCancelModalOpen(true);
            return;
        }

        setActionLoading(action);
        setActionError(null);
        setActionFeedback(null);

        try {
            const res = await fetch(`/api/admin/reservations/${reservation.id}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to perform action');
            }

            if (action === 'resend_confirmation') {
                setActionFeedback('Email de confirmación enviado.');
            } else if (action === 'resend_cancellation') {
                setActionFeedback('Email de cancelación enviado.');
            }
        } catch (err: any) {
            setActionError(err.message || 'Error occurred');
        } finally {
            setActionLoading(null);
            setTimeout(() => {
                setActionFeedback(null);
                setActionError(null);
            }, 3000);
        }
    }

    const res = reservation;
    const currentStatus = (localStatus ?? res?.status ?? 'pending') as ReservationStatus;
    const st = STATUS_STYLE[currentStatus];
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
                aria-label="Reservation detail panel"
            >
                {/* ── Top accent line ── */}
                <div className="h-px bg-gradient-to-r from-[#A68966]/80 via-[#d4af6e]/50 to-transparent flex-shrink-0" />

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#A68966] font-semibold mb-0.5">Detail View</p>
                        <h2 className="font-serif italic text-[#ece8e1] text-base leading-tight">
                            Reservation Record
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05]
                                   hover:bg-white/10 text-[#6b6b6b] hover:text-white transition-all"
                        aria-label="Close panel"
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
                            {/* ── Vehicle image strip (if available) ── */}
                            {vehicle?.hero_image && (
                                <div className="relative h-36 rounded-xl overflow-hidden bg-[#1a1a1a] -mx-0">
                                    <Image
                                        src={`${vehicle.hero_image}?t=${Date.now()}`}
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
                                        <p className="text-[#A68966] text-[10px] uppercase tracking-[0.15em] capitalize">
                                            {vehicle.year} · {vehicle.category} · {vehicle.transmission}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* SECTION 1 - Reservation Info */}
                            <Section label="SECTION 1 – Reservation Info">
                                <div className="mb-4">
                                    <p className="text-xs opacity-60">Reservation Number</p>
                                    <p className="text-lg font-semibold tracking-wide text-amber-300">
                                        {res.reservation_number || "Generating..."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 bg-[#141414] border border-white/[0.04] p-5 rounded-xl">
                                    <InfoRow label="Vehicle" value={vehicle ? `${vehicle.brand} ${vehicle.model}` : '—'} colSpan={2} />
                                    <InfoRow label="Pickup" value={formatDate(res.pickup_date)} />
                                    <InfoRow label="Return" value={formatDate(res.return_date)} />
                                    <div className="col-span-2 pt-2 border-t border-white/[0.04]">
                                        <InfoRow
                                            label="Status"
                                            customValue={
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border"
                                                    style={{ background: st.bg, color: st.text, borderColor: st.border }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.text }} />
                                                    {currentStatus}
                                                </span>
                                            }
                                        />
                                    </div>
                                    <InfoRow label="Total Price" value={`$${Number(res.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                                    <InfoRow label="Payment Intent" value={res.stripe_session_id ? res.stripe_session_id.substring(0, 16) + '...' : '—'} mono />
                                </div>
                            </Section>

                            {/* SECTION 2 - Customer Info */}
                            <Section label="SECTION 2 – Customer Info">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 bg-[#141414] border border-white/[0.04] p-5 rounded-xl">
                                    <InfoRow label="Name" value={[res.driver_first_name, res.driver_last_name].filter(Boolean).join(' ') || '—'} colSpan={2} />
                                    <InfoRow label="Email" value={res.driver_email ?? '—'} colSpan={2} />
                                    <InfoRow label="Phone" value={res.driver_phone ?? '—'} />
                                    <InfoRow label="Clerk ID" value={res.user_id ? res.user_id.substring(0, 16) + '...' : '—'} mono />
                                </div>
                            </Section>

                            {/* SECTION 3 - Admin Actions */}
                            <Section label="SECTION 3 – Admin Actions">
                                <div className="bg-[#141414] border border-white/[0.04] p-5 rounded-xl space-y-5">
                                    {/* Status changer */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.15em] text-[#5a5a5a] block mb-3">Change Status</label>
                                        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                                            {STATUS_OPTIONS.filter(opt => opt !== 'cancelled').map((opt) => {
                                                const s = STATUS_STYLE[opt];
                                                const active = currentStatus === opt;
                                                return (
                                                    <button
                                                        key={opt}
                                                        onClick={() => !active && !updatingStatus && handleStatusChange(opt)}
                                                        disabled={updatingStatus}
                                                        className="rounded-lg py-2.5 px-2 text-[9px] uppercase tracking-wider font-semibold
                                                                transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                                                                focus:outline-none focus:ring-1 focus:ring-white/20"
                                                        style={{
                                                            background: active ? s.bg : 'rgba(255,255,255,0.03)',
                                                            color: active ? s.text : '#5a5a5a',
                                                            border: `1px solid ${active ? s.border : 'rgba(255,255,255,0.06)'}`,
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="h-4 mt-2">
                                            {updatingStatus && <span className="text-[10px] text-[#A68966] tracking-wider animate-pulse flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Updating...</span>}
                                            {flashSuccess && !updatingStatus && <span className="text-[10px] text-emerald-400 tracking-wider">Status updated successfully</span>}
                                            {statusError && !updatingStatus && <span className="text-[10px] text-red-400 tracking-wider">Update failed</span>}
                                        </div>
                                    </div>

                                    {/* Additional Actions */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-5">
                                        <button
                                            disabled={actionLoading === 'resend_confirmation'}
                                            onClick={() => handleAction('resend_confirmation')}
                                            className="w-full text-center px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-[#d8cfc4] text-[10px] uppercase tracking-widest font-semibold hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === 'resend_confirmation' ? 'Enviando...' : 'Reenviar Confirmación'}
                                        </button>
                                        <button
                                            disabled={actionLoading === 'resend_cancellation'}
                                            onClick={() => handleAction('resend_cancellation')}
                                            className="w-full text-center px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-[#d8cfc4] text-[10px] uppercase tracking-widest font-semibold hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === 'resend_cancellation' ? 'Enviando...' : 'Reenviar Cancelación'}
                                        </button>
                                        <button
                                            onClick={() => setIsNoteModalOpen(true)}
                                            className="col-span-2 w-full text-center px-4 py-2.5 rounded-lg border border-[#A68966]/30 bg-[#A68966]/10 text-[#A68966] text-[10px] uppercase tracking-widest font-semibold hover:bg-[#A68966]/20 transition-all duration-200"
                                        >
                                            Add Manual Note
                                        </button>
                                        <div className="col-span-2 h-4 flex items-center justify-center text-center">
                                            {actionFeedback && <p className="text-[10px] text-emerald-400 tracking-wider font-medium">{actionFeedback}</p>}
                                            {actionError && <p className="text-[10px] text-red-400 tracking-wider font-medium">{actionError}</p>}
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    {currentStatus !== 'cancelled' && (
                                        <div className="pt-2 border-t border-white/[0.04]">
                                            <button
                                                onClick={() => setIsCancelModalOpen(true)}
                                                className="w-full text-center px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-[10px] uppercase tracking-widest font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200"
                                            >
                                                Cancel Reservation & Refund
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        </>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06]">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#3a3a3a] text-center">
                        CarCo Admin Console · Status updates are immediate
                    </p>
                </div>
            </aside>
            {/* Cancel Modal with Refund Options */}
            {isCancelModalOpen && res && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1714] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d64040] to-red-600" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#d64040]/10 border border-[#d64040]/20 rounded-xl text-[#d64040] shadow-sm">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif text-[#fcfaf8] tracking-tight">Cancelar Reserva</h3>
                                    <p className="text-[11px] text-[#A68966] mt-0.5 font-mono uppercase tracking-widest">{res.reservation_number || res.id.substring(0, 8)}</p>
                                </div>
                            </div>
                            <button aria-label="Cerrar modal" onClick={() => setIsCancelModalOpen(false)} className="text-[#8c8c8c] hover:text-[#fcfaf8] hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-[13px] text-[#8c8c8c] mb-8 leading-relaxed">
                            Al cancelar esta reserva, puedes emitir un reembolso directamente hacia la tarjeta del cliente a través de Stripe. El cliente recibirá un correo de notificación automáticamente.
                        </p>

                        <div className="space-y-4 mb-7">
                            <div>
                                <label className="block text-xs font-bold text-[#A68966]/90 uppercase tracking-[0.15em] mb-2.5">Motivo de Cancelación *</label>
                                <div className="relative">
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8c8c] pointer-events-none" />
                                    <select
                                        value={cancellationReason}
                                        onChange={(e) => setCancellationReason(e.target.value)}
                                        aria-label="Motivo de cancelación"
                                        className="w-full bg-[#1A1714] border border-[#A68966]/30 focus:border-[#C6A14A] rounded-lg py-2.5 pl-3 pr-10 text-sm text-[#fcfaf8] appearance-none outline-none transition-colors"
                                    >
                                        <option value="" disabled>Seleccione un motivo...</option>
                                        <option value="Cliente solicitó cancelación">Cliente solicitó cancelación</option>
                                        <option value="Error en disponibilidad">Error en disponibilidad</option>
                                        <option value="Problema mecánico">Problema mecánico</option>
                                        <option value="Pago fraudulento">Pago fraudulento</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            {cancellationReason === 'Otro' && (
                                <div>
                                    <label className="block text-xs font-bold text-[#A68966] uppercase tracking-widest mb-2">Especifique el motivo</label>
                                    <input
                                        type="text"
                                        placeholder="Ingrese el motivo de cancelación..."
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        className="w-full bg-[#1A1714] border border-[#A68966]/30 focus:border-[#C6A14A] rounded-lg py-2.5 px-3 text-sm text-[#fcfaf8] outline-none transition-colors"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-white/5 w-full my-6" />

                        <div className="grid gap-3 mb-8">
                            <label className="block text-xs font-bold text-[#A68966]/90 uppercase tracking-[0.15em] mb-1">Opciones de Reembolso</label>

                            {/* Option: Full */}
                            <label className={`relative flex gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden group ${refundType === 'full' ? 'border-[#C6A14A] bg-[#C6A14A]/[0.04] shadow-[0_0_15px_rgba(198,161,74,0.05)]' : 'border-white/[0.06] hover:border-white/[0.12] bg-transparent hover:bg-white/[0.01]'}`}>
                                <input type="radio" name="refund" value="full" checked={refundType === 'full'} onChange={() => setRefundType('full')} className="sr-only" />
                                <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center mt-0.5 transition-colors ${refundType === 'full' ? 'border-[#C6A14A]' : 'border-white/20 group-hover:border-white/40'}`}>
                                    {refundType === 'full' && <div className="w-2 h-2 rounded-full bg-[#C6A14A]" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-[#fcfaf8]">Reembolso Total</p>
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">${res.total_price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-[#8c8c8c] mt-1.5 leading-relaxed pr-2">Se cancelará el Payment Intent en Stripe devolviendo el monto íntegro.</p>
                                </div>
                            </label>

                            {/* Option: Partial */}
                            <label className={`relative flex flex-col gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${refundType === 'partial' ? 'border-[#C6A14A] bg-[#C6A14A]/[0.04] shadow-[0_0_15px_rgba(198,161,74,0.05)]' : 'border-white/[0.06] hover:border-white/[0.12] bg-transparent hover:bg-white/[0.01]'}`}>
                                <div className="flex gap-4">
                                    <input type="radio" name="refund" value="partial" checked={refundType === 'partial'} onChange={() => setRefundType('partial')} className="sr-only" />
                                    <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center mt-0.5 transition-colors ${refundType === 'partial' ? 'border-[#C6A14A]' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {refundType === 'partial' && <div className="w-2 h-2 rounded-full bg-[#C6A14A]" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#fcfaf8]">Reembolso Parcial</p>
                                        <p className="text-xs text-[#8c8c8c] mt-1.5 leading-relaxed">Devolver un monto parcial personalizado.</p>
                                    </div>
                                </div>
                                {refundType === 'partial' && (
                                    <div className="ml-8 relative flex items-center animate-in fade-in slide-in-from-top-2 duration-200">
                                        <span className="absolute left-3 text-[#A68966] font-mono">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            max={res.total_price}
                                            min="0.01"
                                            value={refundAmount}
                                            onChange={(e) => setRefundAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-[#1A1714] border border-[#A68966]/30 focus:border-[#C6A14A] rounded-lg py-2.5 pl-8 pr-16 text-sm text-[#fcfaf8] font-mono outline-none transition-colors shadow-inner"
                                        />
                                        <span className="absolute right-3 text-[11px] text-[#A68966]/60 font-mono bg-[#1A1714] pl-2">/ ${res.total_price.toFixed(2)}</span>
                                    </div>
                                )}
                            </label>

                            {/* Option: None */}
                            <label className={`relative flex gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${refundType === 'none' ? 'border-[#d64040]/60 bg-[#d64040]/[0.03] shadow-[0_0_15px_rgba(214,64,64,0.05)]' : 'border-white/[0.06] hover:border-white/[0.12] bg-transparent hover:bg-white/[0.01]'}`}>
                                <input type="radio" name="refund" value="none" checked={refundType === 'none'} onChange={() => setRefundType('none')} className="sr-only" />
                                <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center mt-0.5 transition-colors ${refundType === 'none' ? 'border-[#d64040]' : 'border-white/20 group-hover:border-white/40'}`}>
                                    {refundType === 'none' && <div className="w-2 h-2 rounded-full bg-[#d64040]" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${refundType === 'none' ? 'text-[#d64040]' : 'text-[#fcfaf8] group-hover:text-[#d64040]/80 transition-colors'}`}>Sin Reembolso (No Show / Penalty)</p>
                                    <p className="text-xs text-[#8c8c8c] mt-1.5 leading-relaxed pr-2">Se cancelará la reserva en sistema pero Stripe conservará el 100% del pago.</p>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-white/[0.06]">
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                disabled={isCancelling}
                                className="px-5 py-2.5 text-sm font-medium text-[#8c8c8c] hover:text-[#fcfaf8] transition-colors rounded-lg hover:bg-white/5 disabled:opacity-50"
                            >
                                Mantener Reserva
                            </button>
                            <button
                                onClick={handleCancelSubmit}
                                disabled={isCancelling}
                                className="px-5 py-2.5 text-sm font-semibold bg-[#d64040] text-white hover:bg-[#b93535] transition-all rounded-lg flex items-center gap-2 shadow-lg shadow-[#d64040]/20 disabled:opacity-50"
                            >
                                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                Aplicar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {isNoteModalOpen && res && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-[#1A1714] border border-[#A68966]/20 rounded-xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-lg font-serif italic text-[#ece8e1]">Add Manual Note</h3>
                            <button aria-label="Close Note Modal" onClick={() => setIsNoteModalOpen(false)} className="text-[#8c8c8c] hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#A68966] mb-2">Category</label>
                                <select
                                    value={noteCategory}
                                    onChange={e => setNoteCategory(e.target.value)}
                                    aria-label="Note Category"
                                    className="w-full bg-[#111111] border border-white/10 rounded-lg py-2 px-3 text-sm text-[#d8cfc4] outline-none focus:border-[#A68966]/40 cursor-pointer"
                                >
                                    <option value="general" className="bg-[#111111]">General</option>
                                    <option value="customer_request" className="bg-[#111111]">Customer Request</option>
                                    <option value="internal_note" className="bg-[#111111]">Internal Note</option>
                                    <option value="payment_issue" className="bg-[#111111]">Payment Issue</option>
                                    <option value="vip" className="bg-[#111111]">VIP</option>
                                    <option value="incident" className="bg-[#111111]">Incident</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#A68966] mb-2">Note Details</label>
                                <textarea
                                    rows={4}
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    placeholder="Enter your note here..."
                                    className="w-full bg-[#111111] border border-white/10 rounded-lg py-2 px-3 text-sm text-[#d8cfc4] outline-none focus:border-[#A68966]/40 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/5">
                            <button onClick={() => setIsNoteModalOpen(false)} className="px-4 py-2 text-xs uppercase tracking-widest text-[#8c8c8c] hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                disabled={isSubmittingNote || !noteText.trim()}
                                className="px-5 py-2 text-xs uppercase tracking-widest bg-[#A68966] text-[#111111] font-semibold rounded-lg hover:bg-[#c4a67e] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmittingNote && <Loader2 className="w-3 h-3 animate-spin" />}
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
