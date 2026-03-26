'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, X, Clock, ShieldCheck, User, Zap } from 'lucide-react';

interface HistoryItem {
    id: string;
    action_type: string;
    performed_by_email: string;
    performed_by_role: string;
    notes: string;
    refund_type?: string;
    refund_amount?: number;
    created_at: string;
    note_category?: string;
}

const formatActionType = (action: string) => {
    switch (action.toLowerCase()) {
        case 'reservation_created': return 'Reservation Created';
        case 'status_changed': return 'Status Updated';
        case 'cancelled_by_admin': return 'Cancelled by Admin';
        case 'cancelled_by_customer': return 'Cancelled by Customer';
        case 'refund_failed': return 'Refund Failed';
        case 'manual_note': return 'Admin Note';
        default: return action; // Fallback
    }
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'general': return 'text-[#d8cfc4] bg-white/5 border-white/10';
        case 'customer_request': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'internal_note': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'payment_issue': return 'text-red-400 bg-red-400/10 border-red-400/20';
        case 'vip': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        case 'incident': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
        case 'system': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        default: return 'text-[#d8cfc4] bg-white/5 border-white/10';
    }
}

export function HistoryDrawer({ reservation, onClose }: { reservation: any; onClose: () => void }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    const open = !!reservation;

    useEffect(() => {
        if (!reservation) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/reservations/${reservation.id}/history`);
                const data = await res.json();

                console.log("History response:", data);

                if (data.history) {
                    setHistory(data.history);
                } else {
                    setHistory([]);
                }
            } catch (error) {
                console.error('Failed to fetch history', error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [reservation?.id]);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!open) return null;

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return <ShieldCheck className="w-4 h-4 text-[#A68966]" />;
            case 'system': return <Zap className="w-4 h-4 text-[#60a5fa]" />;
            default: return <User className="w-4 h-4 text-[#d8cfc4]" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-[#0e0e0e] border-l border-white/[0.08] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/[0.08] bg-[#141414]">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[#1A1714] font-semibold mb-1">
                            Audit Trail
                        </p>
                        <h2 className="text-lg font-serif italic text-[#ece8e1]">
                            Reservation History
                        </h2>
                        {reservation?.reservation_number && (
                            <p className="text-xs font-mono text-[#d8cfc4] tracking-wide mt-1">
                                {reservation.reservation_number}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-[#6b6b6b] hover:text-[#d8cfc4] hover:bg-white/5 rounded-full transition-colors"
                        aria-label="Close History Panel"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#6b6b6b]">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#A68966]" />
                            <p className="text-[10px] uppercase tracking-widest text-[#d8cfc4]">Loading History...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#6b6b6b]">
                            <Clock className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-[10px] uppercase tracking-widest text-[#d8cfc4]">No history log found.</p>
                        </div>
                    ) : (
                        <div className="relative max-w-sm mx-auto">
                            {/* Vertical Line */}
                            <div className="absolute top-4 bottom-4 left-6 w-px bg-white/[0.08]" />

                            <div className="space-y-8 relative">
                                {history.map((item, idx) => (
                                    <div key={item.id} className="relative flex items-start group">
                                        {/* Timeline Marker */}
                                        <div className="relative z-10 w-12 flex justify-center shrink-0 pt-1">
                                            <div className="w-[9px] h-[9px] rounded-full bg-[#1c1c1c] border-2 border-[#A68966] group-hover:scale-125 group-hover:bg-[#A68966] transition-all shadow-[0_0_10px_rgba(166,137,102,0.5)]" />
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 bg-[#141414] border border-white/[0.05] rounded-xl p-4 shadow-sm group-hover:border-[#A68966]/30 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-[13px] font-semibold text-[#ece8e1]">
                                                    {formatActionType(item.action_type)}
                                                </h4>
                                                <span className="text-[10px] text-[#6b6b6b] font-mono tracking-tighter">
                                                    {new Date(item.created_at).toLocaleString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
                                                    {getRoleIcon(item.performed_by_role)}
                                                    <span className="text-[9px] uppercase tracking-widest text-[#d8cfc4]">
                                                        {item.performed_by_role}
                                                    </span>
                                                </div>
                                                {item.note_category && (
                                                    <div className={`px-2 py-1 rounded-md border text-[9px] uppercase tracking-widest font-medium ${getCategoryColor(item.note_category)}`}>
                                                        {item.note_category.replace('_', ' ')}
                                                    </div>
                                                )}
                                                <span className="text-[11px] text-[#6b6b6b] truncate max-w-[180px]" title={item.performed_by_email}>
                                                    {item.performed_by_email}
                                                </span>
                                            </div>

                                            {item.notes && (
                                                <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                                                    <p className="text-[11px] text-[#a0a0a0] italic leading-relaxed">
                                                        "{item.notes}"
                                                    </p>
                                                </div>
                                            )}

                                            {item.refund_type && item.refund_type !== 'none' && (
                                                <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                                                    <span className="text-[10px] uppercase tracking-wider text-[#d4af6e]">Refund ({item.refund_type})</span>
                                                    <span className="text-xs font-mono font-medium text-white">${Number(item.refund_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
