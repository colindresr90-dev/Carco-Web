'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Filter, ChevronDown, Fuel, Users, Gauge, RefreshCcw } from 'lucide-react';
import { useState, useMemo } from 'react';
import { FilterDrawer, FilterState } from '@/components/ui/FilterDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_FILTERS: FilterState = {
    seats: [],
    fuel: [],
    transmission: [],
    priceRange: [0, 1000],
    sortBy: 'recent'
};

export default function FleetClient({ initialVehicles, renderTime }: { initialVehicles: any[], renderTime: number }) {
    const [activeCategory, setActiveCategory] = useState<'all' | 'suv' | 'sedan'>('all');
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const filteredVehicles = useMemo(() => {
        let result = initialVehicles;

        // Category Filter
        if (activeCategory !== 'all') {
            result = result.filter(v => v.category === activeCategory);
        }

        // Advanced Filters
        if (filters.seats.length > 0) {
            result = result.filter(v => {
                if (filters.seats.includes('7+') && v.seats >= 7) return true;
                return filters.seats.includes(v.seats.toString());
            });
        }

        if (filters.fuel.length > 0) {
            result = result.filter(v => filters.fuel.includes(v.fuel));
        }

        if (filters.transmission.length > 0) {
            result = result.filter(v => filters.transmission.includes(v.transmission));
        }

        result = result.filter(v => v.price_per_day >= filters.priceRange[0] && v.price_per_day <= filters.priceRange[1]);

        // Sorting
        result = [...result].sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-low': return a.price_per_day - b.price_per_day;
                case 'price-high': return b.price_per_day - a.price_per_day;
                case 'popular': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                default: return 0; // 'recent' or default
            }
        });

        return result;
    }, [activeCategory, filters, initialVehicles]);

    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setActiveCategory('all');
    };

    return (
        <div className="bg-[#fcfaf8] min-h-screen">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="relative h-[60vh] md:h-[65vh] lg:h-[75vh] min-h-[620px] flex items-center justify-center overflow-hidden">
                    <Image
                        src="/img/hero/flota.jpg"
                        alt="CarCo Fleet Hero"
                        fill
                        priority
                        quality={90}
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative z-10 text-center text-white px-6">
                        <h1 className="text-6xl md:text-[5rem] lg:text-[5.5rem] font-serif italic mb-6 drop-shadow-lg">Nuestra Colección</h1>
                        <p className="uppercase tracking-[0.4em] text-[10px] md:text-xs text-white/60 mb-8 font-medium">— Una Colección Pensada Para Cada Trayecto —</p>
                        <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto text-white/90 leading-relaxed">
                            Seleccionada para quienes valoran el carácter y la distinción. Elige el vehículo que te acompañará en tu próximo trayecto.
                        </p>
                    </div>
                </section>

                {/* Filter Bar */}
                <div className="sticky top-20 z-40 bg-[#fcfaf8]/95 backdrop-blur-sm border-b border-[#e7dfd0] py-4 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            {[
                                { id: 'all', label: 'TODOS LOS MODELOS' },
                                { id: 'suv', label: 'SUV' },
                                { id: 'sedan', label: 'SEDÁN' },
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id as any)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-[#1A1714] text-white shadow-lg'
                                        : 'bg-transparent hover:bg-[#A68966]/10 text-[#1A1714]'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <div
                            onClick={() => setIsDrawerOpen(true)}
                            className="flex items-center gap-2 text-[#A68966] text-sm font-medium cursor-pointer hover:text-[#e6a219] transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Más Filtros</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDrawerOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 flex justify-between items-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#A68966]">
                        {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehículo Disponible' : 'Vehículos Disponibles'}
                    </h2>
                    {(activeCategory !== 'all' || JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS)) && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-bold uppercase tracking-widest text-[#e6a219] flex items-center gap-2 hover:text-[#1A1714] transition-colors"
                        >
                            <RefreshCcw className="w-3 h-3" />
                            Limpiar Todo
                        </button>
                    )}
                </div>

                {/* Grid */}
                <section className="py-8 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredVehicles.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {filteredVehicles.map((car) => (
                                    <motion.div
                                        key={car.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#e7dfd0] hover:border-[#e6a219]/30"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <Image
                                                src={`${car.hero_image}?t=${renderTime}`}
                                                alt={`${car.brand} ${car.model}`}
                                                fill
                                                quality={90}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1A1714] shadow-sm">
                                                {car.category.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col gap-5">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-serif text-[#1A1714] group-hover:text-[#A68966] transition-colors">{car.brand} {car.model}</h3>
                                                <div className="text-right">
                                                    <span className="block text-xl font-bold text-[#1A1714]">${car.price_per_day}</span>
                                                    <span className="text-[10px] text-[#A68966] uppercase tracking-[0.1em] font-medium">por día</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 items-center text-center">
                                                <div className="flex flex-col items-center gap-1 text-[#A68966]">
                                                    <Users className="w-4 h-4 opacity-70" />
                                                    <span className="text-xs font-medium">{car.seats} Asientos</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 text-[#A68966] border-x border-gray-100">
                                                    <Fuel className="w-4 h-4 opacity-70" />
                                                    <span className="text-xs font-medium capitalize">{car.fuel}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 text-[#A68966]">
                                                    <Gauge className="w-4 h-4 opacity-70" />
                                                    <span className="text-xs font-medium capitalize">{car.transmission}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto">
                                                <Link
                                                    href={`/vehicles/${car.slug}`}
                                                    className="flex-1 py-3 border border-[#1A1714]/20 text-[#1A1714] flex items-center justify-center font-bold uppercase tracking-widest text-[10px] rounded-lg hover:border-[#1A1714] hover:bg-[#1A1714] hover:text-white transition-all duration-300"
                                                >
                                                    VER DETALLES
                                                </Link>
                                                {car.available ? (
                                                    <Link
                                                        href={`/reserve?vehicle_id=${car.id}`}
                                                        className="flex-1 py-3 bg-[#e6a219] text-[#1A1714] flex items-center justify-center font-bold uppercase tracking-widest text-[10px] rounded-lg hover:brightness-110 shadow-sm transition-all duration-300"
                                                    >
                                                        RESERVAR
                                                    </Link>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="flex-1 py-3 bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center font-bold uppercase tracking-widest text-[10px] rounded-lg shadow-sm"
                                                    >
                                                        NO DISPONIBLE
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-[#A68966]/10 rounded-full flex items-center justify-center text-[#A68966]">
                                    <Filter className="w-10 h-10 opacity-40" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif text-[#1A1714]">No hay vehículos disponibles</h3>
                                    <p className="text-[#A68966] font-light">Prueba ajustando los filtros seleccionados.</p>
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-3 bg-[#1A1714] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#e6a219] transition-colors shadow-lg"
                                >
                                    Limpiar Todos los Filtros
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </main>

            <FilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                filters={filters}
                setFilters={setFilters}
                onClear={() => setFilters(INITIAL_FILTERS)}
                resultCount={filteredVehicles.length}
            />

            <Footer />
        </div>
    );
}
