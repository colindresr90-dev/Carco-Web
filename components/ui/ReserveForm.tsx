'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar as CalendarIcon, MapPin, CreditCard, Loader2, AlertCircle, X } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parseISO, isWithinInterval, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';

interface ReserveFormProps {
    vehicleId: string;
    vehicleSlug: string;
    vehicleName?: string;
    pricePerDay: number;
}

function differenceInDays(from: Date, to: Date): number {
    return Math.max(0, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
}

type ReservedRange = { pickup_date: string; return_date: string };

export function ReserveForm({ vehicleId, vehicleSlug, vehicleName, pricePerDay }: ReserveFormProps) {
    const { isSignedIn } = useUser();
    const today = startOfToday();

    const [range, setRange] = useState<DateRange | undefined>(undefined);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [unavailableRanges, setUnavailableRanges] = useState<ReservedRange[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setUnavailableRanges([]);
        setRange(undefined); // Reset range when vehicle changes
        if (!vehicleSlug) return;

        async function fetchDates() {
            try {
                const res = await fetch(`/api/vehicle-unavailable-dates?vehicle_id=${vehicleSlug}`);
                if (res.ok) {
                    const data = await res.json();
                    setUnavailableRanges(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch unavailable dates", error);
            }
        }
        fetchDates();
    }, [vehicleSlug]);

    // Close calendar on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const pickupDate = range?.from;
    const returnDate = range?.to;
    const days = pickupDate && returnDate ? differenceInDays(pickupDate, returnDate) : 0;
    const totalPrice = days * pricePerDay;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isSignedIn || !pickupDate || !returnDate) return;

        if (days <= 0) {
            setToast({ type: 'error', message: 'Return date must be after pick-up date.' });
            return;
        }

        if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
            setToast({ type: 'error', message: 'Please fill in all driver information fields.' });
            return;
        }

        setLoading(true);
        setToast(null);

        const payload = {
            vehicle_id: vehicleSlug,
            vehicle_name: vehicleName,
            pickup_date: format(pickupDate, 'yyyy-MM-dd'),
            return_date: format(returnDate, 'yyyy-MM-dd'),
            total_price: totalPrice,
            driver_first_name: firstName,
            driver_last_name: lastName,
            driver_phone: phone,
        };

        console.log('[ReserveForm] Submitting payload:', payload);

        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.error ?? 'Could not create checkout session.');
            }

            window.location.href = data.url;
        } catch (err: unknown) {
            console.error('[ReserveForm Submit Error]', err);
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
            setToast({ type: 'error', message });
            setLoading(false);
        }
    }

    const disabledDays = [
        { before: today },
        ...unavailableRanges.map(r => ({
            from: parseISO(r.pickup_date),
            to: parseISO(r.return_date)
        }))
    ];

    const base = 'w-full bg-white border border-[#e7dfd0] rounded-lg px-4 py-4 focus:outline-none focus:border-[#e6a219] transition-colors disabled:opacity-50';

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <style jsx global>{`
                .rdp {
                    --rdp-accent-color: #e6a219;
                    --rdp-background-color: #f7f3ed;
                    margin: 0;
                    font-family: var(--font-sans);
                }
                .rdp-month_caption {
                    font-family: var(--font-serif);
                    font-size: 1.25rem;
                    font-style: italic;
                    color: #1A1714;
                    margin-bottom: 1rem;
                }
                .rdp-weekday {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #A68966;
                }
                .rdp-day {
                    border-radius: 8px !important;
                    transition: all 0.2s ease;
                }
                .rdp-day_disabled {
                    opacity: 0.2 !important;
                    background-color: transparent !important;
                    color: #9ca3af !important;
                    cursor: not-allowed !important;
                }
                .rdp-day_selected {
                    background-color: #1A1714 !important;
                    color: white !important;
                    font-weight: 600;
                }
                .rdp-day_range_start {
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                    background-color: #1A1714 !important;
                }
                .rdp-day_range_end {
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                    background-color: #1A1714 !important;
                }
                .rdp-day_range_middle {
                    background-color: #f7f3ed !important;
                    color: #1A1714 !important;
                    border-radius: 0 !important;
                }
                .rdp-button:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                    background-color: #e6a219 !important;
                    color: #1A1714 !important;
                    transform: scale(1.1);
                }
                .rdp-nav_button {
                    color: #A68966 !important;
                    transition: color 0.2s ease;
                }
                .rdp-nav_button:hover {
                    color: #e6a219 !important;
                    background: transparent !important;
                }
            `}</style>

            {/* Section 1: Itinerary */}
            <section>
                <div className="flex items-center gap-4 mb-6 border-b border-[#e7dfd0] pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#1A1714] text-white flex items-center justify-center font-bold text-sm">1</div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">Detalles del Itinerario</h2>
                </div>

                <div className="relative" ref={calendarRef}>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer"
                        onClick={() => !loading && setShowCalendar(!showCalendar)}
                    >
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-[#A68966] uppercase tracking-widest group-hover:text-[#e6a219] transition-colors">Fecha de Recogida</label>
                            <div className="relative">
                                <CalendarIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showCalendar ? 'text-[#e6a219]' : 'text-[#A68966]'}`} />
                                <div className={`w-full bg-white border rounded-lg pl-12 pr-4 py-4 text-[#1A1714] transition-all ${showCalendar ? 'border-[#e6a219] ring-2 ring-[#e6a219]/10' : 'border-[#e7dfd0]'}`}>
                                    {pickupDate ? format(pickupDate, 'PP', { locale: es }) : 'Seleccionar fecha'}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-[#A68966] uppercase tracking-widest group-hover:text-[#e6a219] transition-colors">Fecha de Devolución</label>
                            <div className="relative">
                                <CalendarIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${showCalendar ? 'text-[#e6a219]' : 'text-[#A68966]'}`} />
                                <div className={`w-full bg-white border rounded-lg pl-12 pr-4 py-4 text-[#1A1714] transition-all ${showCalendar ? 'border-[#e6a219] ring-2 ring-[#e6a219]/10' : 'border-[#e7dfd0]'}`}>
                                    {returnDate ? format(returnDate, 'PP', { locale: es }) : 'Seleccionar fecha'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showCalendar && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute z-50 mt-2 p-6 bg-white/95 backdrop-blur-md border border-[#e7dfd0] rounded-2xl shadow-2xl left-0 md:left-auto right-0 md:right-auto inline-block origin-top"
                            >
                                <div className="flex justify-between items-center mb-6 md:hidden">
                                    <span className="font-serif italic text-xl text-[#1A1714]">Seleccionar Fechas</span>
                                    <button onClick={() => setShowCalendar(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Cerrar calendario">
                                        <X className="w-5 h-5 text-[#A68966]" />
                                    </button>
                                </div>
                                <DayPicker
                                    mode="range"
                                    selected={range}
                                    onSelect={(newRange) => {
                                        setRange(newRange);
                                    }}
                                    disabled={disabledDays}
                                    locale={es}
                                    numberOfMonths={typeof window !== 'undefined' && window.innerWidth > 768 ? 2 : 1}
                                    className="border-0 m-0"
                                />
                                <div className="mt-6 pt-4 border-t border-[#e7dfd0] flex justify-between items-center">
                                    <div className="text-xs text-[#A68966]">
                                        {pickupDate && returnDate ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#e6a219]" />
                                                {days} {days === 1 ? 'día' : 'días'} seleccionados
                                            </span>
                                        ) : 'Selecciona un rango de fechas'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCalendar(false)}
                                        className="text-xs font-bold uppercase tracking-widest text-[#1A1714] hover:text-[#e6a219] transition-colors"
                                    >
                                        Hecho
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Section 2: Driver Details */}
            <section>
                <div className="flex items-center gap-4 mb-6 border-b border-[#e7dfd0] pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#1A1714] text-white flex items-center justify-center font-bold text-sm">2</div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">Información del Conductor</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#A68966] uppercase tracking-widest">Nombre</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} placeholder="John" className={base} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#A68966] uppercase tracking-widest">Apellido</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required disabled={loading} placeholder="Doe" className={base} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-[#A68966] uppercase tracking-widest">Número de Teléfono</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading} placeholder="+1 (555) 000-0000" className={base} />
                    </div>
                </div>
            </section>

            {/* Section 3: Payment */}
            <section>
                <div className="flex items-center gap-4 mb-6 border-b border-[#e7dfd0] pb-4">
                    <div className="w-8 h-8 rounded-full bg-[#1A1714] text-white flex items-center justify-center font-bold text-sm">3</div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">Método de Pago</h2>
                </div>
                <div className="bg-white border border-[#e7dfd0] rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 border border-[#e6a219] bg-[#e6a219]/5 rounded-lg cursor-pointer">
                        <div className="w-5 h-5 rounded-full border-2 border-[#e6a219] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#e6a219]" />
                        </div>
                        <CreditCard className="w-6 h-6 text-[#1A1714]" />
                        <span className="font-bold text-[#1A1714]">Credit Card</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-[#e7dfd0] rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="w-5 h-5 rounded-full border-2 border-[#e7dfd0]" />
                        <span className="font-bold text-[#A68966]">Apple Pay</span>
                    </div>
                </div>
            </section>

            {/* Auth guard */}
            {!isSignedIn && (
                <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    Por favor, inicia sesión para completar tu reserva.
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="flex items-start gap-3 px-5 py-4 rounded-xl text-sm border bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={!isSignedIn || loading || !pickupDate || !returnDate}
                className={`flex items-center justify-center gap-3 w-full bg-[#1A1714] text-white font-bold text-lg py-5 rounded-xl
          hover:bg-[#e6a219] hover:text-[#1A1714] transition-all shadow-xl
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1A1714] disabled:hover:text-white`}
            >
                {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Procesando…</>
                ) : (
                    'Confirmar Reserva'
                )}
            </button>

            {/* Live total */}
            {days > 0 && (
                <p className="text-center text-sm text-[#A68966]">
                    {days} day{days !== 1 ? 's' : ''} × ${pricePerDay} = <span className="font-bold text-[#1A1714]">${totalPrice.toFixed(2)} total</span>
                </p>
            )}
        </form>
    );
}
