import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Check, Shield, Zap, Wind, Navigation, Bluetooth } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient();
  const { data: selectedVehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', id)
    .single();

  if (error) {
    console.error(`Vehicle Fetch Error for slug [${id}]:`, error.message);
  }

  if (error || !selectedVehicle) {
    notFound();
  }

  console.log(`Vehicle Fetch Data [slug:${id}]:`, selectedVehicle);

  const vehicle = {
    name: `${selectedVehicle.brand} ${selectedVehicle.model}`,
    price: selectedVehicle.price_per_day,
    image: `${selectedVehicle.hero_image}?t=${selectedVehicle.id}`,
    id: selectedVehicle.id,
    description: "Experimenta la movilidad premium con nuestra flota meticulosamente mantenida. Perfecto para largos recorridos costeros o traslados urbanos con absoluta comodidad.",
    features: [
      "Interior Premium",
      "Transmisión Automática",
      "Aire Acondicionado",
      "Bluetooth y Navegación",
      "Opciones de Seguro Completo",
      "Asistencia en Carretera 24/7"
    ]
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen text-[#1A1714]">
      <Navbar />

      <main>
        {/* Hero Image */}
        <div className="relative w-full h-[60vh] bg-gray-900">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf8] via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-20 relative z-10 pb-24">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Main Content */}
            <div className="flex-grow">
              <div className="mb-8">
                <span className="text-[#e6a219] font-bold tracking-widest uppercase text-xs mb-2 block">Colección SUV Premium</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1714] mb-4">{vehicle.name}</h1>
                <div className="flex items-center gap-4 text-[#A68966]">
                  <span className="px-3 py-1 border border-[#A68966]/30 rounded-full text-xs uppercase tracking-wider">{selectedVehicle.transmission}</span>
                  <span className="px-3 py-1 border border-[#A68966]/30 rounded-full text-xs uppercase tracking-wider">{selectedVehicle.seats} Asientos</span>
                  <span className="px-3 py-1 border border-[#A68966]/30 rounded-full text-xs uppercase tracking-wider">{selectedVehicle.fuel}</span>
                </div>
              </div>

              <div className="prose prose-lg text-[#A68966] font-light mb-12">
                <h3 className="text-[#1A1714] font-serif text-2xl mb-4">La Experiencia</h3>
                <p>{vehicle.description}</p>
              </div>

              <div className="mb-12">
                <h3 className="text-[#1A1714] font-serif text-2xl mb-6">Amenidades y Características</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white border border-[#e7dfd0] rounded-lg">
                      <Check className="w-5 h-5 text-[#e6a219]" />
                      <span className="text-[#1A1714] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-[#1A1714] font-serif text-2xl mb-6">Especificaciones</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2">
                    <Zap className="w-6 h-6 text-[#A68966]" />
                    <span className="text-xs uppercase tracking-widest text-[#A68966]">Potencia</span>
                    <span className="font-bold text-[#1A1714]">277 HP</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Wind className="w-6 h-6 text-[#A68966]" />
                    <span className="text-xs uppercase tracking-widest text-[#A68966]">0-100 km/h</span>
                    <span className="font-bold text-[#1A1714]">6.2 seg</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Navigation className="w-6 h-6 text-[#A68966]" />
                    <span className="text-xs uppercase tracking-widest text-[#A68966]">Tracción</span>
                    <span className="font-bold text-[#1A1714]">AWD</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Bluetooth className="w-6 h-6 text-[#A68966]" />
                    <span className="text-xs uppercase tracking-widest text-[#A68966]">Tecnología</span>
                    <span className="font-bold text-[#1A1714]">Wireless CP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="sticky top-24 bg-white border border-[#e7dfd0] rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-3xl font-serif text-[#1A1714] font-bold">${vehicle.price}</span>
                    <span className="text-[#A68966] text-sm"> / día</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1 h-4 bg-[#e6a219] rounded-full"></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-[#A68966]">
                    <Shield className="w-4 h-4 text-[#e6a219]" />
                    <span>Seguro Completo Incluido</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A68966]">
                    <Check className="w-4 h-4 text-[#e6a219]" />
                    <span>Cancelación Gratuita (24h)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A68966]">
                    <Check className="w-4 h-4 text-[#e6a219]" />
                    <span>Confirmación Instantánea</span>
                  </div>
                </div>

                <Link
                  href={`/reserve?vehicle_id=${vehicle.id}`}
                  className="flex items-center justify-center w-full py-4 bg-[#1A1714] text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-[#e6a219] hover:text-[#1A1714] transition-all shadow-lg"
                >
                  Reservar Ahora
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
