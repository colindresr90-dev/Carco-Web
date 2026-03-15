import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import {
    Building2,
    ArrowUpRight,
    Headset,
    Phone,
    Mail,
    Languages,
    ChevronDown,
    ArrowRight,
    Shield,
    BadgeCheck
} from 'lucide-react';
import Image from 'next/image';

export default function SupportPage() {
    return (
        <div className="font-serif min-h-screen text-[#1b180d] bg-[#fcfbf8] antialiased selection:bg-[#ecb613]/30 flex flex-col">
            <Navbar />

            <main className="flex flex-col flex-1">
                {/* Hero Header */}
                <section
                    className="relative px-6 py-12 md:px-10 lg:px-40 lg:py-20 overflow-hidden bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%270%200%20200%20200%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.65%27%20numOctaves=%273%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url(%23noiseFilter)%27%20opacity=%270.05%27/%3E%3C/svg%3E')]"
                >
                    <div className="max-w-[1200px] mx-auto text-center md:text-left relative z-10">
                        <h1 className="text-[#1b180d] text-5xl md:text-7xl font-black italic tracking-[-0.02em] mb-4">
                            Soporte <span className="text-[#ecb613] font-normal">&amp;</span> Concierge
                        </h1>
                        <p className="text-[#5c5645] text-lg md:text-xl font-normal font-sans max-w-2xl leading-relaxed">
                            Nuestro concierge está a su disposición para reservas, consultas de flota y peticiones especiales. Experimente el lujo sin fisuras de CarCo.
                        </p>
                    </div>
                </section>

                {/* Content Split */}
                <section className="px-6 pb-20 md:px-10 lg:px-40 font-sans">
                    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                        {/* Left Column: Contact Info */}
                        <div className="lg:col-span-5 flex flex-col gap-10">
                            {/* Image Block */}
                            <div className="w-full h-64 lg:h-80 overflow-hidden rounded-xl relative shadow-md group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                                <Image
                                    alt="Close up of classic car interior leather stitching"
                                    className="object-cover grayscale contrast-125 sepia-[0.2] transition-transform duration-700 group-hover:scale-105"
                                    src="/images/support/contact.png"
                                    fill
                                    quality={90}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>

                            {/* Direct Inquiries */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#1b180d] mb-6 flex items-center gap-2 font-serif">
                                    <Building2 className="w-6 h-6 text-[#ecb613]" />
                                    Consultas Directas
                                </h2>

                                <div className="flex flex-col gap-8 border-l-2 border-[#f3f0e7] pl-6">
                                    {/* Location 1 */}
                                    <div className="group">
                                        <h3 className="text-lg font-bold text-[#1b180d] mb-1 group-hover:text-[#ecb613] transition-colors">Sede San Benito</h3>
                                        <p className="text-[#5c5645] font-sans text-sm leading-relaxed mb-2">
                                            1200 Blvd del Hipódromo,<br />
                                            San Benito, San Salvador
                                        </p>
                                        <a className="inline-flex items-center gap-1 text-sm font-medium text-[#1b180d] hover:text-[#ecb613] border-b border-[#ecb613]/30 hover:border-[#ecb613] pb-0.5 transition-colors" href="#">
                                            Ver en Mapa <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>

                                    {/* Location 2 */}
                                    <div className="group">
                                        <h3 className="text-lg font-bold text-[#1b180d] mb-1 group-hover:text-[#ecb613] transition-colors">Sede La Libertad</h3>
                                        <p className="text-[#5c5645] font-sans text-sm leading-relaxed mb-2">
                                            Km 42, Carretera del Litoral,<br />
                                            La Libertad, El Salvador
                                        </p>
                                        <a className="inline-flex items-center gap-1 text-sm font-medium text-[#1b180d] hover:text-[#ecb613] border-b border-[#ecb613]/30 hover:border-[#ecb613] pb-0.5 transition-colors" href="#">
                                            Ver en Mapa <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Support Contacts */}
                            <div>
                                <h2 className="text-2xl font-bold text-[#1b180d] mb-6 flex items-center gap-2 font-serif">
                                    <Headset className="w-6 h-6 text-[#ecb613]" />
                                    Asistencia
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-lg border border-[#f3f0e7] shadow-sm hover:border-[#ecb613]/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="size-8 rounded-full bg-[#fcfbf8] flex items-center justify-center text-[#ecb613] border border-[#f3f0e7]">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#9a864c]">Línea Prioritaria</span>
                                        </div>
                                        <p className="text-lg font-bold text-[#1b180d]">+503 2211-3344</p>
                                        <p className="text-xs text-[#5c5645] mt-1">Lunes-Dom, 24 Horas</p>
                                    </div>

                                    <div className="bg-white p-5 rounded-lg border border-[#f3f0e7] shadow-sm hover:border-[#ecb613]/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="size-8 rounded-full bg-[#fcfbf8] flex items-center justify-center text-[#ecb613] border border-[#f3f0e7]">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#9a864c]">Concierge</span>
                                        </div>
                                        <p className="text-lg font-bold text-[#1b180d] font-serif">desk@carco.com</p>
                                        <p className="text-xs text-[#5c5645] mt-1">Respuesta típica: &lt; 2 hrs</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-3 text-[#5c5645] bg-[#f3f0e7]/50 p-3 rounded-lg">
                                    <Languages className="w-5 h-5 text-[#ecb613]" />
                                    <p className="text-sm font-medium">Soporte Bilingüe Dedicado (Inglés / Español)</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] border border-[#f3f0e7] relative overflow-hidden h-full">
                                {/* Decor element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

                                <h2 className="text-3xl font-bold text-[#1b180d] mb-2 italic font-serif">Solicitud de Concierge</h2>
                                <p className="text-[#5c5645] font-sans mb-10">Por favor, complete el formulario a continuación. Nuestro equipo coordinará su solicitud de inmediato.</p>

                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Name */}
                                        <div className="group relative z-0 w-full mb-2">
                                            <input
                                                className="block py-2.5 px-0 w-full text-lg text-[#1b180d] bg-transparent border-0 border-b border-[#dcd9ce] appearance-none focus:outline-none focus:ring-0 focus:border-[#ecb613] peer"
                                                id="name"
                                                name="name"
                                                placeholder=" "
                                                required
                                                type="text"
                                            />
                                            <label
                                                className="peer-focus:font-medium absolute text-sm text-[#9a864c] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#ecb613] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-serif italic"
                                                htmlFor="name"
                                            >
                                                Nombre Completo
                                            </label>
                                        </div>

                                        {/* Email */}
                                        <div className="group relative z-0 w-full mb-2">
                                            <input
                                                className="block py-2.5 px-0 w-full text-lg text-[#1b180d] bg-transparent border-0 border-b border-[#dcd9ce] appearance-none focus:outline-none focus:ring-0 focus:border-[#ecb613] peer"
                                                id="email"
                                                name="email"
                                                placeholder=" "
                                                required
                                                type="email"
                                            />
                                            <label
                                                className="peer-focus:font-medium absolute text-sm text-[#9a864c] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#ecb613] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-serif italic"
                                                htmlFor="email"
                                            >
                                                Correo Electrónico
                                            </label>
                                        </div>
                                    </div>

                                    {/* Subject Dropdown */}
                                    <div className="group relative z-0 w-full mb-2">
                                        <select
                                            className="block py-2.5 px-0 w-full text-lg text-[#1b180d] bg-transparent border-0 border-b border-[#dcd9ce] appearance-none focus:outline-none focus:ring-0 focus:border-[#ecb613] peer"
                                            id="subject"
                                            defaultValue="General Inquiry"
                                        >
                                            <option value="General Inquiry">Consulta General</option>
                                            <option value="reservation">Nueva Solicitud de Reserva</option>
                                            <option value="fleet">Disponibilidad de Flota</option>
                                            <option value="chauffeur">Servicios de Chofer</option>
                                            <option value="event">Evento Corporativo</option>
                                        </select>
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-[#9a864c] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#ecb613] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-serif italic"
                                            htmlFor="subject"
                                        >
                                            Asunto
                                        </label>
                                        <ChevronDown className="absolute right-0 top-3 text-[#9a864c] pointer-events-none w-5 h-5" />
                                    </div>

                                    {/* Message */}
                                    <div className="group relative z-0 w-full mb-2">
                                        <textarea
                                            className="block py-2.5 px-0 w-full text-lg text-[#1b180d] bg-transparent border-0 border-b border-[#dcd9ce] appearance-none focus:outline-none focus:ring-0 focus:border-[#ecb613] peer resize-none"
                                            id="message"
                                            name="message"
                                            placeholder=" "
                                            required
                                            rows={4}
                                        ></textarea>
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-[#9a864c] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#ecb613] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-serif italic"
                                            htmlFor="message"
                                        >
                                            ¿Cómo podemos ayudarle?
                                        </label>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-6">
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-4 h-4 text-[#ecb613] bg-gray-100 border-gray-300 rounded focus:ring-[#ecb613] focus:ring-2"
                                                id="newsletter"
                                                type="checkbox"
                                            />
                                            <label className="ml-2 text-sm font-medium text-[#5c5645] font-sans" htmlFor="newsletter">
                                                Suscribirse a nuestro journal.
                                            </label>
                                        </div>
                                        <button
                                            className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-3 bg-[#1b180d] text-white rounded-lg overflow-hidden transition-all hover:bg-[#ecb613] hover:text-[#1b180d] shadow-lg hover:shadow-[#ecb613]/30"
                                            type="button"
                                        >
                                            <span className="relative font-bold tracking-wide text-sm z-10">ENVIAR CONSULTA</span>
                                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>

                                {/* Trust Indicators */}
                                <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-xs font-sans font-bold tracking-widest text-[#5c5645]">TRANSMISIÓN SEGURA</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck className="w-4 h-4" />
                                        <span className="text-xs font-sans font-bold tracking-widest text-[#5c5645]">CONCIERGE OFICIAL</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
