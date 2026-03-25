import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { MapPin, ArrowRight, Sun, Mountain } from 'lucide-react';

export default function DestinationsPage() {
  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1C1C1C]">
      <Navbar solid={true} />

      <main>
        {/* Hero */}
        <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto text-center border-b border-[#1C1C1C]/10">
          <span className="text-[#e6a219] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">RUTAS SELECCIONADAS</span>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-[#1C1C1C]">Explora Más Allá de lo Ordinario</h1>
          <p className="text-[#1C1C1C]/70 max-w-3xl mx-auto text-lg font-light leading-relaxed">
            Hemos seleccionado rutas icónicas de El Salvador para que cada trayecto se convierta en una experiencia.
            Cada destino está acompañado por el vehículo ideal para disfrutarlo al máximo.
          </p>
        </section>

        {/* Content Container */}
        <div className="relative w-full py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32">

            {/* Destination 1 */}
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
                  <Image
                    src="/img/Destiny/San-Benito-Santa Elena.jpg"
                    alt="San Benito y Santa Elena"
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-10">
                    <div className="flex items-center gap-2 text-[#e6a219] mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">SAN BENITO / SANTA ELENA</span>
                    </div>
                    <h2 className="text-4xl font-serif text-white">El Pulso Urbano</h2>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-4xl font-serif text-[#1C1C1C]">Descubre la sofisticación urbana</h3>
                  <p className="text-[#1C1C1C]/80 leading-relaxed text-lg font-light">
                    Descubre la sofisticación de San Benito y Santa Elena. Restaurantes de autor, galerías contemporáneas y avenidas arboladas crean el escenario perfecto para un recorrido elegante y cómodo. Aquí, cada trayecto es parte del estilo de vida.
                  </p>
                </div>

                <Link href="/vehicles/hyundai-elantra" className="block bg-[#fcfaf8] border border-[#1C1C1C]/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group/card">
                  <span className="text-[10px] text-[#e6a219] font-bold uppercase tracking-[0.2em] block mb-6">Vehículo Recomendado</span>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-20 bg-white rounded-xl overflow-hidden relative shadow-inner border border-[#1C1C1C]/5">
                      <Image
                        src="/img/vehicles/hyundai-elantra.jpg"
                        alt="Hyundai Elantra"
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-center transition-transform group-hover/card:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#1C1C1C] font-serif text-xl font-bold group-hover/card:text-[#e6a219] transition-colors">Hyundai Elantra</h4>
                      <p className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider mt-1">Sedán • Automático • 5 Asientos</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-[#e6a219] transition-colors group/link">
                      <div className="w-12 h-12 rounded-full border border-[#e6a219]/30 flex items-center justify-center group-hover/card:bg-[#e6a219] group-hover/card:border-[#e6a219] transition-all">
                        <ArrowRight className="w-5 h-5 group-hover/card:text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest group-hover/card:text-[#1A1714]">Detalles</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Destination 2 */}
            <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
                  <Image
                    src="/img/Destiny/La Libertad-El Tunco.jpg"
                    alt="La Libertad y El Tunco"
                    fill
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-10">
                    <div className="flex items-center gap-2 text-[#e6a219] mb-3">
                      <Sun className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">LA LIBERTAD / EL TUNCO</span>
                    </div>
                    <h2 className="text-4xl font-serif text-white">La Ruta Costera</h2>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-4xl font-serif text-[#1C1C1C]">Donde el asfalto se encuentra con el océano</h3>
                  <p className="text-[#1C1C1C]/80 leading-relaxed text-lg font-light">
                    Donde el asfalto se encuentra con el océano. La Ruta hacia La Libertad ofrece vistas abiertas del Pacífico, brisa marina y atardeceres memorables. Ideal para un viaje relajado con carácter.
                  </p>
                </div>

                <Link href="/vehicles/kia-forte" className="block bg-[#fcfaf8] border border-[#1C1C1C]/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group/card">
                  <span className="text-[10px] text-[#e6a219] font-bold uppercase tracking-[0.2em] block mb-6">Vehículo Recomendado</span>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-20 bg-white rounded-xl overflow-hidden relative shadow-inner border border-[#1C1C1C]/5">
                      <Image
                        src="/img/vehicles/kia-forte.jpg"
                        alt="Kia Forte"
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-center transition-transform group-hover/card:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#1C1C1C] font-serif text-xl font-bold group-hover/card:text-[#e6a219] transition-colors">Kia Forte</h4>
                      <p className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider mt-1">Sedán • Automático • 5 Asientos</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-[#e6a219] transition-colors group/link">
                      <div className="w-12 h-12 rounded-full border border-[#e6a219]/30 flex items-center justify-center group-hover/card:bg-[#e6a219] group-hover/card:border-[#e6a219] transition-all">
                        <ArrowRight className="w-5 h-5 group-hover/card:text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest group-hover/card:text-[#1A1714]">Detalles</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Destination 3 */}
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl group">
                  <Image
                    src="/img/Destiny/Santa-Ana.jpg"
                    alt="Volcán de Santa Ana"
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-10">
                    <div className="flex items-center gap-2 text-[#e6a219] mb-3">
                      <Mountain className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">VOLCÁN DE SANTA ANA</span>
                    </div>
                    <h2 className="text-4xl font-serif text-white">La Ascensión</h2>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-10">
                <div className="space-y-6">
                  <h3 className="text-4xl font-serif text-[#1C1C1C]">Naturaleza imponente en las alturas</h3>
                  <p className="text-[#1C1C1C]/80 leading-relaxed text-lg font-light">
                    Para quienes buscan altura y aventura. El Volcán de Santa Ana ofrece caminos que atraviesan naturaleza imponente. Una experiencia ideal para quienes desean explorar más allá del pavimento urbano.
                  </p>
                </div>

                <Link href="/vehicles/toyota-prado" className="block bg-[#fcfaf8] border border-[#1C1C1C]/5 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group/card">
                  <span className="text-[10px] text-[#e6a219] font-bold uppercase tracking-[0.2em] block mb-6">Vehículo Recomendado</span>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-20 bg-white rounded-xl overflow-hidden relative shadow-inner border border-[#1C1C1C]/5">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZG23LkUmcJiBdTvRb-6jrYxIf4-2yKmq8p5DyKcrLk3YILASpbB6XOJ5TJ4yV9YNDTaJdXsh_fDR-rmWjyYL7JbGjBbyqlqeZ9i66sQR0NDgokCxSKE0vz64fjRpg5FVgLdlz31s6ebSW6dNbsoxpyWcdnVTQVY8iecRoFqTago75d5tr64a5wY6cQoFiNa7hLRuWv8IIAQvW2NZqtBlSmuVTgfbf_ZKvg2eRgxyzYfkCWux8QOzo9q80zkzoagBdI5nu_H5-swk"
                        alt="Toyota Prado"
                        fill
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-center transition-transform group-hover/card:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#1C1C1C] font-serif text-xl font-bold group-hover/card:text-[#e6a219] transition-colors">Toyota Prado</h4>
                      <p className="text-[#1C1C1C]/50 text-xs uppercase tracking-wider mt-1">SUV • 7 Asientos • Diésel</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-[#e6a219] transition-colors group/link">
                      <div className="w-12 h-12 rounded-full border border-[#e6a219]/30 flex items-center justify-center group-hover/card:bg-[#e6a219] group-hover/card:border-[#e6a219] transition-all">
                        <ArrowRight className="w-5 h-5 group-hover/card:text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest group-hover/card:text-[#1A1714]">Detalles</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Planifica Tu Ruta Section */}
        <section className="bg-[#fcfaf8] py-24 px-6 md:px-12 text-center border-t border-[#1C1C1C]/5">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1C1C]">Planifica Tu Ruta</h2>
            <p className="text-[#1C1C1C]/70 text-lg font-light leading-relaxed">
              Reserva el vehículo ideal y comienza tu experiencia en El Salvador con la seguridad y estilo que distingue a CarCo.
            </p>
            <Link
              href="/fleet"
              className="inline-block px-10 py-4 bg-[#1C1C1C] text-[#fcfaf8] font-bold uppercase tracking-widest text-sm hover:bg-[#e6a219] transition-colors shadow-lg"
            >
              Explorar Flota
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
