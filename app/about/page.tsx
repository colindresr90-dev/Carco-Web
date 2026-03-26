import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { ArrowRight, CheckCircle, PenTool, Map, Users, Gem } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#fcfaf8] min-h-screen text-[#1A1714]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] w-full bg-[#1A1714] overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtNeHdEXWiFlmF4AyAY7rZl0rzjS8jC1BL_a5daCk_aHDaO9Q3xhnJAZM7_h5vJxb6vyWkf5QNiypskEnhk31gcWC_kvEca-4cG_2IMjZpnBbNERXk6ytFGW30WT5lBA6oQxpSBGMce_7ZdKyHukA2OoIQvvjG6FWdCDsOgzSuZlD211MUnB6IoO6k6jUKjHZ5_RG2rLXdZJHcoOTr0pnKH1dL5WDHt2TslI5V7GRaEzjoM6j_kUd4GqCZa0u2dchHeS-O6Q03kvg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf8] via-transparent to-transparent z-0"></div>
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-5xl mx-auto text-center">
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] font-serif drop-shadow-md">
              Impulsados por la <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6a219] to-amber-100 italic pr-4">Precisión.</span>
            </h1>
            <p className="max-w-2xl text-white/90 text-lg md:text-xl font-light leading-relaxed mt-4">
              Donde la excelencia operativa se encuentra con el detalle. En CarCo, cada vehículo y cada entrega están pensados para quienes valoran comodidad, puntualidad y distinción.
            </p>
            <div className="mt-8">
              <Link
                href="#filosofia"
                className="group flex items-center justify-center gap-2 rounded-full h-14 px-8 bg-[#1A1714] text-white text-base font-bold transition-all hover:scale-105 shadow-xl"
              >
                <span>Descubre Nuestra Filosofía</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-y-1 rotate-90" />
              </Link>
            </div>
          </div>
        </section>

        {/* Philosophy Block */}
        <section id="filosofia" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-b border-[#e7dfd0] scroll-mt-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 lg:order-1">
                <span className="text-[#e6a219] font-bold tracking-widest uppercase text-xs mb-4 block">Filosofía</span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-[#1A1714] mb-8">
                  &quot;El verdadero lujo no es exceso, es <span className="italic text-[#A68966]">tranquilidad.</span>&quot;
                </h2>
                <div className="w-24 h-1 bg-[#e6a219] mb-8"></div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col gap-6 text-[#A68966] text-lg leading-relaxed font-light">
                <p>
                  En CarCo creemos que alquilar un vehículo debe ser una experiencia fluida y sin complicaciones. Nuestro compromiso es simple: procesos claros, vehículos impecables y atención personalizada en cada etapa de tu viaje.
                </p>
                <p>
                  Cada detalle, desde la reserva hasta la entrega, está diseñado para que conduzcas con confianza y sin preocupaciones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Standards Grid */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#fcfaf8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1714] mb-4">El Estándar CarCo</h2>
                <p className="text-[#1A1714] text-lg">Tres pilares que definen nuestro compromiso con tu experiencia.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group flex flex-col gap-6 p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e7dfd0] hover:border-[#e6a219]/30">
                <div className="w-14 h-14 rounded-full bg-[#e6a219]/10 flex items-center justify-center text-[#e6a219] group-hover:bg-[#e6a219] group-hover:text-white transition-colors">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] mb-2">Calidad sin Compromisos</h3>
                  <p className="text-[#1A1714] leading-relaxed">
                    Cada vehículo pasa por inspecciones rigurosas antes de cada entrega. Mantenimiento preventivo constante y limpieza profesional garantizan una experiencia impecable.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="group flex flex-col gap-6 p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e7dfd0] hover:border-[#e6a219]/30">
                <div className="w-14 h-14 rounded-full bg-[#e6a219]/10 flex items-center justify-center text-[#e6a219] group-hover:bg-[#e6a219] group-hover:text-white transition-colors">
                  <PenTool className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] mb-2">Elegancia Funcional</h3>
                  <p className="text-[#1A1714] leading-relaxed">
                    Seleccionamos modelos que combinan diseño moderno con eficiencia. Nuestra flota está pensada para adaptarse tanto a entornos urbanos como a rutas escénicas.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="group flex flex-col gap-6 p-8 bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e7dfd0] hover:border-[#e6a219]/30">
                <div className="w-14 h-14 rounded-full bg-[#e6a219]/10 flex items-center justify-center text-[#e6a219] group-hover:bg-[#e6a219] group-hover:text-white transition-colors">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] mb-2">Experiencia Personalizada</h3>
                  <p className="text-[#1A1714] leading-relaxed">
                    Desde reservas digitales simples hasta atención directa cuando la necesites. Nuestro equipo está disponible para acompañarte antes, durante y después de tu alquiler.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Local Expertise */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <span className="text-[#e6a219] font-bold tracking-widest uppercase text-xs mb-3 block">Estándares Globales, Compromiso Local</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-6">Excelencia con Identidad Local</h2>
              <p className="text-[#1A1714] text-lg">Nuestra operación combina procesos internacionales de calidad con un profundo conocimiento del territorio salvadoreño. Entendemos las rutas, los tiempos y las necesidades reales de quienes recorren el país.</p>
            </div>
            {/* Editorial Row 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24">
              <div className="w-full lg:w-1/2 relative h-[500px] overflow-hidden rounded-lg group">
                <Image
                  src="/img/about/salvador_scenic_suv.png"
                  alt="Scenic SUV in El Salvador"
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[#e6a219]">
                  <Map className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-widest uppercase">El Paisaje</span>
                </div>
                <h3 className="font-serif text-4xl text-[#1A1714]">Dominando Cada Ruta</h3>
                <p className="text-[#1A1714] text-lg leading-relaxed">
                  Desde las avenidas modernas de San Benito hasta los caminos hacia el Volcán de Santa Ana o las playas de La Libertad, nuestra flota está preparada para cada tipo de trayecto. Conocemos el terreno porque operamos en él todos los días.
                </p>
              </div>
            </div>
            {/* Editorial Row 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 relative h-[500px] overflow-hidden rounded-lg group">
                <Image
                  src="/img/about/car_handover_san_salvador.png"
                  alt="Car handover in San Salvador"
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[#e6a219]">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-widest uppercase">El Equipo</span>
                </div>
                <h3 className="font-serif text-4xl text-[#1A1714]">Atención que Marca la Diferencia</h3>
                <p className="text-[#1A1714] text-lg leading-relaxed">
                  Nuestro equipo entiende que el servicio no termina con la entrega de llaves. Ya sea coordinación especial, ajustes de último momento o asistencia inmediata, respondemos con profesionalismo y eficiencia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-32 px-6 bg-[#fcfaf8] border-t border-[#e7dfd0] text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <Gem className="w-16 h-16 text-[#e6a219] opacity-50" />
            <h2 className="font-serif text-5xl md:text-6xl text-[#1A1714] leading-tight">¿Listo para Elevar tu Experiencia?</h2>
            <p className="text-[#1A1714] text-xl max-w-2xl">
              Descubre cómo CarCo redefine la movilidad en El Salvador. Reserva hoy y conduce con la tranquilidad que solo un servicio premium puede ofrecer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
              <Link
                href="/reserve"
                className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-[#e6a219] text-white text-base font-bold tracking-wide hover:bg-[#c58a15] transition-all shadow-xl shadow-[#e6a219]/20"
              >
                Reservar Vehículo
              </Link>
              <Link
                href="/fleet"
                className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white border border-[#e7dfd0] text-[#1A1714] text-base font-bold tracking-wide hover:bg-gray-50 transition-all"
              >
                Explorar Flota
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
