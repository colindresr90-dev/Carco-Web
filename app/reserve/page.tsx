import { Suspense } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Info } from 'lucide-react';
import { ReserveForm } from '@/components/ui/ReserveForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ReservePage({ searchParams }: { searchParams: Promise<{ vehicle_id?: string }> }) {
  const awaitedParams = await searchParams;
  const vehicleId = awaitedParams.vehicle_id;

  if (!vehicleId) {
    return <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center text-[#A68966]">No se proporcionó un ID de vehículo.</div>;
  }

  const supabase = createClient();
  const { data: vehicle, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .single();

  if (error) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center text-[#1A1714]">
        <h1 className="text-2xl font-bold mb-4">Error al cargar el vehículo</h1>
        <p className="text-[#A68966]">{error.message}</p>
        <p className="text-sm text-gray-400 mt-4">ID: {vehicleId}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center text-[#1A1714]">
        <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
        <p className="text-[#A68966]">No se pudo encontrar el vehículo con ID: {vehicleId}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfaf8] min-h-screen text-[#1A1714]">
      <Navbar />

      <main className="pb-24">
        {/* Hero */}
        <section className="relative h-[40vh] min-h-[350px] flex items-end pb-16 overflow-hidden mb-12">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kL753XQ_0i5c0q_5z_5p0l_2w_6h_4n_8r_0t_2y_4u_6i_8o_0p_2a_4s_6d_8f_0g_2h_4j_6k_8l_0z_2x_4c_6v_8b_0n_2m_4q_6w_8e_0r_2t_4y_6u_8i_0o_2p_4a_6s_8d_0f_2g_4h_6j_8k_0l_2z_4x_6c_8v_0b_2n_4m_6q_8w_0e_2r_4t_6y_8u_0i_2o_4p_6a_8s_0d_2f_4g_6h_8j_0k_2l_4z_6x_8c_0v_2b_4n_6m_8q_8w_2e_4r_6t_8y_0u_2i_4o_6p_8a_0s_2d_4f_6g_8h_0j_2k_4l_6z_8x_0c_2v_4b_6n_8m"
            alt="CarCo Reservation"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf8] via-black/80 to-black/80" />
          <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-4 drop-shadow-md">
              Finaliza tu Viaje
            </h1>
            <p className="text-white/80 font-light max-w-xl text-lg tracking-wide drop-shadow">
              Completa los detalles a continuación para asegurar tu reserva. Tu experiencia te espera.
            </p>
          </div>
        </section>

        <div className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Left Column: Interactive Form */}
          <div className="flex-grow">
            <ReserveForm vehicleId={vehicle.id} vehicleSlug={vehicle.slug} vehicleName={`${vehicle.brand} ${vehicle.model}`} pricePerDay={vehicle.price_per_day} />
          </div>

          {/* Right Column: Summary (static — server-rendered) */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="sticky top-24 bg-white border border-[#e7dfd0] rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={`${vehicle.hero_image}?t=${vehicle.id}`}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Vehículo Seleccionado
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#1A1714]">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-[#A68966] text-sm capitalize">{vehicle.category} · {vehicle.transmission}</p>
                </div>
                <div className="space-y-4 border-t border-[#e7dfd0] pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A68966]">Tarifa Diaria</span>
                    <span className="font-bold text-[#1A1714]">${vehicle.price_per_day}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A68966]">Duración</span>
                    <span className="font-bold text-[#1A1714]">Seleccione fechas</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A68966]">Seguro</span>
                    <span className="font-bold text-[#1A1714]">Incluido</span>
                  </div>
                </div>
                <div className="border-t border-[#e7dfd0] pt-6 flex justify-between items-end">
                  <span className="text-sm font-bold text-[#A68966] uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-serif text-[#1A1714]">—</span>
                </div>
                {vehicle.security_deposit && (
                  <div className="bg-[#e6a219]/10 p-4 rounded-lg flex gap-3 items-start">
                    <Info className="w-5 h-5 text-[#e6a219] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#A68966] leading-relaxed">
                      Se retendrá un depósito de seguridad de ${vehicle.security_deposit} en su tarjeta al recoger el vehículo y se liberará al devolverlo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

