'use client';

import { X, RefreshCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export interface FilterState {
    seats: string[];
    fuel: string[];
    transmission: string[];
    priceRange: [number, number];
    sortBy: string;
}

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    onClear: () => void;
    resultCount: number;
}

export function FilterDrawer({
    isOpen,
    onClose,
    filters,
    setFilters,
    onClear,
    resultCount
}: FilterDrawerProps) {

    const handleCheckboxChange = (group: keyof FilterState, value: string) => {
        const currentGroup = filters[group] as string[];
        const newGroup = currentGroup.includes(value)
            ? currentGroup.filter((item) => item !== value)
            : [...currentGroup, value];

        setFilters({ ...filters, [group]: newGroup });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newVal = parseInt(e.target.value);
        const newRange: [number, number] = [...filters.priceRange];
        newRange[index] = newVal;
        setFilters({ ...filters, priceRange: newRange });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#fcfaf8] z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#e7dfd0]">
                            <div>
                                <h2 className="text-xl font-serif text-[#1A1714]">Filtros Avanzados</h2>
                                <p className="text-xs text-[#A68966] uppercase tracking-widest mt-1">{resultCount} Vehículos encontrados</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Cerrar filtros"
                            >
                                <X className="w-6 h-6 text-[#1A1714]" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">

                            {/* Sort By */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1714]">Ordenar Por</h3>
                                <div className="relative">
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                        className="w-full bg-white border border-[#e7dfd0] rounded-lg px-4 py-3 text-sm text-[#1A1714] appearance-none focus:outline-none focus:border-[#e6a219] transition-colors"
                                        aria-label="Ordenar por"
                                    >
                                        <option value="recent">Más recientes</option>
                                        <option value="price-low">Precio: menor a mayor</option>
                                        <option value="price-high">Precio: mayor a menor</option>
                                        <option value="popular">Más populares</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A68966] pointer-events-none" />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1714]">Rango de Precio</h3>
                                    <span className="text-sm font-medium text-[#e6a219]">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="30"
                                        max="1000"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handlePriceChange(e, 1)}
                                        className="w-full accent-[#e6a219]"
                                        aria-label="Rango de precio máximo"
                                    />
                                    <div className="flex justify-between text-[10px] text-[#A68966] uppercase tracking-wider">
                                        <span>Min $30</span>
                                        <span>Max $1000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seats */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1714]">Número de Asientos</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {['4', '5', '7+'].map((value) => (
                                        <label key={value} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.seats.includes(value)}
                                                    onChange={() => handleCheckboxChange('seats', value)}
                                                    className="peer appearance-none w-5 h-5 border border-[#e7dfd0] rounded checked:bg-[#1A1714] checked:border-[#1A1714] transition-all"
                                                />
                                                <X className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                            </div>
                                            <span className="text-sm text-[#A68966] group-hover:text-[#1A1714] transition-colors">{value} Asientos</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fuel Type */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1714]">Tipo de Combustible</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'gasolina', label: 'Gasolina' },
                                        { id: 'diesel', label: 'Diésel' },
                                        { id: 'hibrido', label: 'Híbrido' }
                                    ].map((item) => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.fuel.includes(item.id)}
                                                    onChange={() => handleCheckboxChange('fuel', item.id)}
                                                    className="peer appearance-none w-5 h-5 border border-[#e7dfd0] rounded checked:bg-[#1A1714] checked:border-[#1A1714] transition-all"
                                                />
                                                <X className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                            </div>
                                            <span className="text-sm text-[#A68966] group-hover:text-[#1A1714] transition-colors">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Transmission */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1714]">Transmisión</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'automatico', label: 'Automático' },
                                        { id: 'manual', label: 'Manual' }
                                    ].map((item) => (
                                        <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.transmission.includes(item.id)}
                                                    onChange={() => handleCheckboxChange('transmission', item.id)}
                                                    className="peer appearance-none w-5 h-5 border border-[#e7dfd0] rounded checked:bg-[#1A1714] checked:border-[#1A1714] transition-all"
                                                />
                                                <X className="absolute w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                            </div>
                                            <span className="text-sm text-[#A68966] group-hover:text-[#1A1714] transition-colors">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[#e7dfd0] bg-white space-y-4">
                            <button
                                onClick={onClear}
                                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest text-[#A68966] hover:text-[#e6a219] transition-colors"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                Limpiar Filtros
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-[#1A1714] text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-[#e6a219] transition-colors shadow-lg"
                            >
                                Mostrar {resultCount} Vehículos
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
