'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ReservationDrawer, DrawerReservation } from './ReservationDrawer';
import { HistoryDrawer } from './HistoryDrawer';
import { Loader2 } from 'lucide-react';

// --- Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

type ReservationStatus = 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

interface Reservation extends DrawerReservation {
    reservation_number?: string;
}

const STATUS_OPTIONS: ReservationStatus[] = [
    'pending',
    'confirmed',
    'delivered',
    'completed',
    'cancelled',
];

const STATUS_BADGE: Record<ReservationStatus, { bg: string; text: string; border: string; dot: string }> = {
    pending: { bg: 'rgba(245,158,11,0.10)', text: '#f59e0b', border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
    confirmed: { bg: 'rgba(96,165,250,0.10)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)', dot: '#60a5fa' },
    delivered: { bg: 'rgba(212,175,110,0.12)', text: '#d4af6e', border: 'rgba(212,175,110,0.28)', dot: '#d4af6e' },
    completed: { bg: 'rgba(52,211,153,0.10)', text: '#34d399', border: 'rgba(52,211,153,0.25)', dot: '#34d399' },
    cancelled: { bg: 'rgba(239,68,68,0.08)', text: '#f87171', border: 'rgba(239,68,68,0.22)', dot: '#f87171' },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReservationStatus }) {
    const s = STATUS_BADGE[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
            {status}
        </span>
    );
}

export function ReservationsTable({ initialData, vehiclesMap }: { initialData: Reservation[], vehiclesMap: any[] }) {
    const [reservations, setReservations] = useState<Reservation[]>(initialData);

    // ── Drawer
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedHistory, setSelectedHistory] = useState<Reservation | null>(null);

    // ── Filters
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'all'>('all');
    const [globalSearch, setGlobalSearch] = useState('');
    const debouncedSearch = useDebounce(globalSearch, 300);
    const [filterDate, setFilterDate] = useState('');
    // Derived search load state
    const isFiltering = globalSearch !== debouncedSearch;

    // Called from the drawer's own status select
    function handleDrawerStatusChange(id: string, newStatus: ReservationStatus) {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setSelectedReservation((prev) =>
            prev && prev.id === id ? { ...prev, status: newStatus } : prev
        );
    }

    // ── Filtered data
    const filtered = useMemo(() => {
        const queryStr = debouncedSearch.trim().toLowerCase();

        const results = reservations.filter((r) => {
            // 1. Status Filter
            const matchStatus = filterStatus === 'all' || r.status === filterStatus;

            // 2. Date Filter (pickup_date)
            // r.pickup_date is an ISO string (e.g. "2026-03-01T...").
            // filterDate is "YYYY-MM-DD".
            const matchDate = filterDate === '' || r.pickup_date.startsWith(filterDate);

            // 3. Global Text Search
            let matchGlobal = true;
            if (queryStr) {
                const searchFields = [
                    r.reservation_number || '',
                    r.driver_email || '',
                    r.driver_phone || '',
                    [r.driver_first_name, r.driver_last_name].join(' '),
                    r.vehicle_id || '',
                    r.stripe_session_id || ''
                ].map(f => f.toLowerCase());

                matchGlobal = searchFields.some(field => field.includes(queryStr));
            }

            return matchStatus && matchDate && matchGlobal;
        });

        // Optional Enhancement: exact match priority at top
        if (queryStr) {
            results.sort((a, b) => {
                const isExactA = a.reservation_number?.toLowerCase() === queryStr;
                const isExactB = b.reservation_number?.toLowerCase() === queryStr;
                if (isExactA && !isExactB) return -1;
                if (!isExactA && isExactB) return 1;
                return 0; // maintain relative order
            });
        }

        return results;
    }, [reservations, filterStatus, debouncedSearch, filterDate]);

    // ── Filter bar ────────────────────────────────────────────────────────────
    const filterBar = (
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
            <div className="flex-1" />

            {/* Global search */}
            <div className="relative flex-1 max-w-md">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                    <title>Search Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10A7 7 0 113 10a7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by reservation #, email, phone, name..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    aria-label="Global Search"
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-xs
                               text-[#d8cfc4] placeholder-[#5a5a5a] focus:outline-none focus:border-[#A68966]/50
                               focus:ring-1 focus:ring-[#A68966]/20 transition-all font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6b6b6b]">
                    {isFiltering ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : globalSearch && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#A68966] drop-shadow-[0_0_4px_rgba(166,137,102,0.8)]" />
                    )}
                </div>
            </div>

            {/* Status filter */}
            <div className="relative">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'all')}
                    title="Filter by status"
                    aria-label="Filter by status"
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-white/[0.04] border border-white/10
                               text-[11px] text-[#d8cfc4] focus:outline-none focus:border-[#A68966]/40
                               focus:ring-1 focus:ring-[#A68966]/20 transition-all cursor-pointer"
                >
                    <option value="all" className="bg-[#1c1c1c]">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#1c1c1c]">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
                <svg
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b6b6b]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Date filter */}
            <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                title="Filter by date"
                aria-label="Filter by date"
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px]
                           text-[#d8cfc4] focus:outline-none focus:border-[#A68966]/40
                           focus:ring-1 focus:ring-[#A68966]/20 transition-all cursor-pointer
                           [color-scheme:dark]"
            />

            {(filterStatus !== 'all' || globalSearch || filterDate) && (
                <button
                    onClick={() => { setFilterStatus('all'); setGlobalSearch(''); setFilterDate(''); }}
                    className="text-[10px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#A68966] transition-colors"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );

    // ── Empty state ───────────────────────────────────────────────────────────
    if (filtered.length === 0) {
        return (
            <>
                {filterBar}
                <div className="flex flex-col items-center justify-center py-32 bg-[#111111] overflow-hidden">
                    <div className="relative mb-5">
                        <svg className="w-14 h-14 text-[#A68966]/10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <div className="absolute inset-0 bg-[#A68966] blur-2xl opacity-[0.05] rounded-full scale-150" />
                    </div>
                    <p className="text-xl font-serif italic text-[#ece8e1] mb-2 tracking-wide">
                        No reservations match your filters.
                    </p>
                    <p className="text-xs tracking-[0.1em] text-[#6b6b6b]">
                        Try adjusting your search criteria or modifying dates.
                    </p>
                </div>
            </>
        );
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    return (
        <>
            {filterBar}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {['#', 'Res. Number', 'Vehicle ID', 'Pickup', 'Return', 'Price', 'Status', 'Created', 'Actions'].map((col) => (
                                <th
                                    key={col}
                                    className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((res, i) => {
                            const isSelected = selectedReservation?.id === res.id || selectedHistory?.id === res.id;

                            return (
                                <tr
                                    key={res.id}
                                    className="border-b border-white/[0.04] transition-all duration-200 group hover:bg-white/[0.02]"
                                    style={{
                                        background: isSelected ? 'rgba(166,137,102,0.07)' : (i % 2 !== 0 ? 'rgba(255,255,255,0.015)' : 'transparent'),
                                        borderLeft: isSelected ? '2px solid rgba(166,137,102,0.5)' : '2px solid transparent',
                                    }}
                                >
                                    {/* Row number */}
                                    <td className="px-5 py-4 text-[10px] text-[#3a3a3a] tabular-nums select-none">
                                        {i + 1}
                                    </td>

                                    {/* Reservation Number */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-[11px] text-[#amber-300] font-medium tracking-wide">
                                            {res.reservation_number || <span className="text-amber-300">Generating...</span>}
                                        </span>
                                    </td>

                                    {/* Vehicle ID */}
                                    <td className="px-5 py-4">
                                        <span
                                            className="font-mono text-[11px] text-[#A68966] bg-[#A68966]/[0.08]
                                                       px-2 py-0.5 rounded border border-[#A68966]/15 inline-block
                                                       max-w-[160px] truncate"
                                            title={res.vehicle_id}
                                        >
                                            {res.vehicle_id}
                                        </span>
                                    </td>

                                    {/* Pickup */}
                                    <td className="px-5 py-4 text-[#d8cfc4] text-xs whitespace-nowrap">
                                        {formatDate(res.pickup_date)}
                                    </td>

                                    {/* Return */}
                                    <td className="px-5 py-4 text-[#d8cfc4] text-xs whitespace-nowrap">
                                        {formatDate(res.return_date)}
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-4 text-[#ece8e1] text-xs tabular-nums font-medium">
                                        ${Number(res.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-5 py-4">
                                        <StatusBadge status={res.status} />
                                    </td>

                                    {/* Created At */}
                                    <td className="px-5 py-4 text-[#5a5a5a] text-[11px] whitespace-nowrap">
                                        {formatDateTime(res.created_at)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => setSelectedReservation(res)}
                                                className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] uppercase tracking-wider text-[#A68966] hover:bg-[#A68966]/10 hover:border-[#A68966]/40 transition-all font-medium"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => setSelectedHistory(res)}
                                                className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] uppercase tracking-wider text-[#d8cfc4] hover:bg-white/5 hover:border-white/20 transition-all font-medium"
                                            >
                                                History
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                    <p className="text-[10px] text-[#3a3a3a] uppercase tracking-widest">
                        Showing {filtered.length} of {reservations.length} reservations
                    </p>
                    {selectedReservation && (
                        <p className="text-[10px] text-[#A68966] uppercase tracking-widest">
                            Row selected · click to view details
                        </p>
                    )}
                </div>
            </div>

            {/* ── Drawers ── */}
            <ReservationDrawer
                reservation={selectedReservation}
                vehicle={selectedReservation ? vehiclesMap.find(v => v.slug === selectedReservation.vehicle_id) : null}
                onClose={() => setSelectedReservation(null)}
                onStatusChange={handleDrawerStatusChange}
            />

            <HistoryDrawer
                reservation={selectedHistory}
                onClose={() => setSelectedHistory(null)}
            />
        </>
    );
}
