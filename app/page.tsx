import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { ArrowRight, Clock, Shield, Gem } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('featured', true)
    .eq('is_active', true)
    .limit(3);

  if (error) {
    console.error("Home Page Fetch Error:", error.message);
  }

  const featuredCars = vehicles || [];
  console.log("Vehicles from DB (Home):", featuredCars);

  const renderTime = Date.now();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fcfaf8]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10"></div>
            <Image
              src="/img/hero/car-beach-sunset-cinematic.jpg"
              alt="CarCo El Salvador Luxury Hero"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center transition-transform duration-[20s] hover:scale-105"
            />
          </div>

          <div className="relative z-20 container mx-auto px-6 text-center text-white flex flex-col items-center gap-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight max-w-4xl drop-shadow-lg font-serif">
              Conduce El Salvador <br /><span className="italic text-[#e6a219]">con Distinción</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-xl tracking-wide">
              Presencia que domina ciudad y montaña.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/fleet" className="min-w-[160px] h-14 px-8 bg-[#e6a219] hover:bg-[#e6a219]/90 text-[#1A1714] text-base font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#e6a219]/50 flex items-center justify-center">
                Reservar Ahora
              </Link>
              <Link href="/destinos" className="min-w-[160px] h-14 px-8 bg-transparent border border-white/40 text-white/90 hover:bg-white hover:text-[#1A1714] text-base font-bold uppercase tracking-wider rounded-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center">
                Explorar Destinos
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16 opacity-80 border-t border-white/20 pt-8">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="text-xs tracking-widest uppercase">Seguro Premium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="text-xs tracking-widest uppercase">Concierge 24/7</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Gem className="w-6 h-6" />
                <span className="text-xs tracking-widest uppercase">Flota Selecta</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Preview Section */}
        <section id="fleet" className="py-32 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl text-[#1A1714] mb-4 font-serif">Nuestra Flota</h2>
              <p className="text-[#A68966] max-w-md font-light">Una colección curada de vehículos que combinan elegancia, eficiencia y presencia. Cada modelo ha sido seleccionado para adaptarse al ritmo de San Salvador, a la serenidad de la costa y a la aventura de nuestros paisajes naturales.</p>
            </div>
            <Link href="/fleet" className="group flex items-center gap-2 text-[#1A1714] font-medium border-b border-[#A68966]/50 pb-1 hover:border-[#e6a219] transition-colors">
              Ver Flota Completa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredCars && featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, index) => (
                <div key={car.id} className={`group flex flex-col gap-4 ${index === 2 ? 'md:col-span-2 lg:col-span-1 md:w-[calc(50%-1rem)] lg:w-full md:mx-auto lg:mx-0' : ''}`}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#fcfaf8] shadow-sm">
                    <Image
                      src={`${car.hero_image}?t=${renderTime}`}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <Link
                        href={`/reserve?vehicle_id=${car.id}`}
                        className="bg-[#e6a219] text-[#1A1714] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                      >
                        Reservar
                      </Link>
                      <Link
                        href={`/vehicles/${car.slug}`}
                        className="bg-white text-[#1A1714] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#e6a219]"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl text-[#1A1714] font-serif">{car.brand} {car.model}</h3>
                      <span className="text-[#e6a219] font-bold text-lg">${car.price_per_day}<span className="text-sm font-normal text-[#A68966]/80">/día</span></span>
                    </div>
                    <p className="text-[#A68966] text-sm font-medium tracking-wide uppercase">{car.category} • {car.transmission}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-[#1A1714] font-serif">No vehicles available</p>
            </div>
          )}


        </section>

        {/* Membership Section */}
        <section id="membership" className="bg-[#1A1714] text-[#fcfaf8] py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 text-[#e6a219]/80 border border-[#e6a219]/30 px-4 py-1 rounded-full text-xs uppercase tracking-widest">
                  <Gem className="w-4 h-4" /> Acceso Exclusivo
                </div>
                <h2 className="text-4xl md:text-6xl font-light leading-tight">
                  Una Experiencia <br /> <span className="font-serif italic text-[#e6a219]">Pensada en el Detalle</span>
                </h2>
                <p className="text-lg text-[#A68966]/80 font-light max-w-md leading-relaxed">
                  En CarCo entendemos que la movilidad es una extensión del estilo personal. Por eso ofrecemos procesos ágiles, atención precisa y vehículos en condiciones impecables. Cada reserva es el inicio de una experiencia diseñada para quienes valoran la excelencia.
                </p>
                <Link href="/about" className="inline-flex items-center gap-3 text-white border-b border-[#e6a219] pb-1 hover:text-[#e6a219] transition-colors uppercase tracking-widest text-sm font-bold mt-4">
                  Comenzar Experiencia
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#e6a219]/50 transition-colors duration-300">
                  <Shield className="text-[#e6a219] w-10 h-10 mb-4" />
                  <h3 className="text-xl font-serif mb-2">Discreción</h3>
                  <p className="text-[#A68966]/70 text-sm leading-relaxed">Privacidad absoluta y procesos ágiles asegurando que su experiencia sea impecable.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#e6a219]/50 transition-colors duration-300">
                  <Gem className="text-[#e6a219] w-10 h-10 mb-4" />
                  <h3 className="text-xl font-serif mb-2">Calidad</h3>
                  <p className="text-[#A68966]/70 text-sm leading-relaxed">Una selección minuciosa de vehículos recientes, inspeccionados al más alto estándar.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-[#e6a219]/50 transition-colors duration-300 sm:col-span-2">
                  <Clock className="text-[#e6a219] w-10 h-10 mb-4" />
                  <h3 className="text-xl font-serif mb-2">Precisión</h3>
                  <p className="text-[#A68966]/70 text-sm leading-relaxed">Tiempos exactos y atención personalizada en cada detalle. Entendemos el valor de su tiempo.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Header Add-On */}
        <section className="bg-[#1A1714] text-center pt-24 pb-16 px-6 relative">
          <h2 className="text-4xl md:text-5xl text-white font-serif mb-6">Destinos que Definen el Viaje</h2>
          <p className="text-[#A68966] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            El Salvador es contraste y carácter. Ciudad y océano. Modernidad y naturaleza. Nuestra experiencia está diseñada para acompañarte en cada escenario.
          </p>
        </section>

        {/* Destinations Section Grid */}
        <section id="destinations" className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 min-h-[600px]">
          <div className="relative group h-[400px] md:h-auto overflow-hidden">
            <Image
              src="/img/Destiny/San-Benito-Santa Elena.jpg"
              alt="San Benito y Santa Elena"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <h3 className="text-4xl md:text-5xl text-white font-serif mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">San Benito y Santa Elena</h3>
              <p className="text-white/80 max-w-xs font-light translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                El corazón contemporáneo de San Salvador. Arquitectura, gastronomía y negocios en un entorno sofisticado.
              </p>
              <Link href="/destinations" className="mt-8 px-6 py-2 border border-white text-white rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-[#1A1714] transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200">
                Explorar Ruta
              </Link>
            </div>
          </div>

          <div className="relative group h-[400px] md:h-auto overflow-hidden">
            <Image
              src="/img/Destiny/La Libertad-El Tunco.jpg"
              alt="La Libertad y El Tunco"
              fill
              quality={90}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <h3 className="text-4xl md:text-5xl text-white font-serif mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">La Libertad y El Tunco</h3>
              <p className="text-white/80 max-w-xs font-light translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                Atardeceres dorados, brisa marina y una energía vibrante que conecta lujo y libertad.
              </p>
              <Link href="/destinations" className="mt-8 px-6 py-2 border border-white text-white rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-[#1A1714] transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200">
                Explorar Ruta
              </Link>
            </div>
          </div>

          <div className="relative group h-[400px] md:h-auto overflow-hidden bg-[#1A1714] md:col-span-2 lg:col-span-1 border-t border-white/5 lg:border-t-0">
            <Image
              src="/img/Destiny/Santa-Ana.jpg"
              alt="El Salvador Offroad"
              fill
              quality={90}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-[10s] group-hover:scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors duration-500 border-l border-white/10"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <h3 className="text-4xl md:text-5xl text-white font-serif mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">El Salvador Offroad</h3>
              <p className="text-white/80 max-w-xs font-light translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                Rutas volcánicas, paisajes abiertos y caminos que invitan a explorar más allá de lo evidente.
              </p>
              <Link href="/destinations" className="mt-8 px-6 py-2 border border-white text-white rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-[#1A1714] transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-200">
                Explorar Ruta
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
