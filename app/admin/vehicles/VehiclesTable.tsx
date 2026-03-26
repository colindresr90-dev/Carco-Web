'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import VehicleModal from './VehicleModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toggleVehicleField } from './actions';

export interface VehicleRecord {
    id: string;
    brand: string;
    model: string;
    slug: string;
    year: number;
    category: string;
    transmission: string;
    fuel: string;
    seats: number;
    price_per_day: number;
    security_deposit: number;
    engine: string;
    horsepower: number;
    torque_nm: number;
    drivetrain: string;
    features: string[];
    is_active: boolean;
    available: boolean;
    featured: boolean;
    hero_image: string;
    gallery: string[];
}

export default function VehiclesTable({ initialData }: { initialData: VehicleRecord[] }) {
    const [vehicles, setVehicles] = useState<VehicleRecord[]>(initialData);

    // Modals
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleRecord | null>(null);
    const [deletingVehicle, setDeletingVehicle] = useState<VehicleRecord | null>(null);

    // Search
    const [globalSearch, setGlobalSearch] = useState('');

    const filtered = useMemo(() => {
        const queryStr = globalSearch.trim().toLowerCase();
        if (!queryStr) return vehicles;

        return vehicles.filter(v => {
            const searchStr = `${v.brand} ${v.model} ${v.year} ${v.category}`.toLowerCase();
            return searchStr.includes(queryStr);
        });
    }, [vehicles, globalSearch]);

    const handleToggle = async (id: string, field: 'is_active' | 'available' | 'featured', currentValue: boolean) => {
        // Optimistic update
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, [field]: !currentValue } : v));
        try {
            await toggleVehicleField(id, field, !currentValue);
        } catch (error) {
            console.error('Failed to toggle:', error);
            // Revert on failure
            setVehicles(prev => prev.map(v => v.id === id ? { ...v, [field]: currentValue } : v));
        }
    };

    const handleCreateNew = () => {
        setEditingVehicle(null);
        setIsVehicleModalOpen(true);
    };

    const handleEdit = (vehicle: VehicleRecord) => {
        setEditingVehicle(vehicle);
        setIsVehicleModalOpen(true);
    };

    const handleDelete = (vehicle: VehicleRecord) => {
        setDeletingVehicle(vehicle);
    };

    // Filter Bar
    const filterBar = (
        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-white/[0.06] justify-between">
            <div className="relative w-full max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <title>Search Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10A7 7 0 113 10a7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-xs text-[#d8cfc4] placeholder-[#5a5a5a] focus:outline-none focus:border-[#A68966]/50 focus:ring-1 focus:ring-[#A68966]/20 transition-all font-medium"
                />
            </div>
            <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-[#A68966] text-[#0e0e0e] text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-[#d4af6e] transition-colors"
            >
                + Add Vehicle
            </button>
        </div>
    );

    return (
        <>
            {filterBar}

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-[#111111]">
                    <p className="text-xl font-serif italic text-[#ece8e1] mb-2">No vehicles found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Hero</th>
                                <th className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Vehicle</th>
                                <th className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Year</th>
                                <th className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Price/Day</th>
                                <th className="px-5 py-3.5 text-center text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Status</th>
                                <th className="px-5 py-3.5 text-right text-[9px] uppercase tracking-[0.2em] text-[#5a5a5a] font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v, i) => (
                                <tr key={v.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="w-40 h-28 rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/[0.05] relative">
                                            {v.hero_image ? (
                                                <Image
                                                    src={v.hero_image}
                                                    alt={v.slug}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 500px"
                                                    priority={i < 4}
                                                    quality={100}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#555] absolute inset-0">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="text-base font-semibold text-[#ece8e1] leading-none mb-1.5">{v.brand} {v.model}</p>
                                        <p className="text-[11px] text-[#1A1714] uppercase tracking-wider">{v.category} · {v.transmission}</p>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-[#d8cfc4]">{v.year}</td>
                                    <td className="px-5 py-3 text-sm font-medium text-[#c9b294]">
                                        ${v.price_per_day}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-center gap-4">
                                            <Toggle label="Active" checked={v.is_active} onChange={() => handleToggle(v.id, 'is_active', v.is_active)} />
                                            <Toggle label="Available" checked={v.available} onChange={() => handleToggle(v.id, 'available', v.available)} />
                                            <Toggle label="Featured" checked={v.featured} onChange={() => handleToggle(v.id, 'featured', v.featured)} />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleEdit(v)} className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] uppercase tracking-wider text-[#A68966] hover:bg-[#A68966]/10 hover:border-[#A68966]/40 transition-all font-medium">Edit</button>
                                            <button onClick={() => handleDelete(v)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-[10px] uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all font-medium">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <VehicleModal
                isOpen={isVehicleModalOpen}
                onClose={() => setIsVehicleModalOpen(false)}
                vehicle={editingVehicle}
                onSuccess={(data) => {
                    // Force refresh or optimistic update, we will rely on router.refresh/revalidatePath from server action and reload or we can update state.
                    // Doing a simple refresh on window for this admin panel since it's the safest to ensure fresh data.
                    window.location.reload();
                }}
            />

            <DeleteConfirmModal
                vehicle={deletingVehicle}
                onClose={() => setDeletingVehicle(null)}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] transition-colors">{label}</span>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex items-center h-4 w-8 rounded-full transition-colors ${checked ? 'bg-[#A68966]' : 'bg-white/10'}`}
                aria-label={label}
                aria-pressed={checked}
            >
                <span className={`inline-block w-3 h-3 transform bg-[#ece8e1] rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}
