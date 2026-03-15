import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Globe, ThumbsUp, Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1714] text-[#fcfaf8] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#e6a219]">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
              <h2 className="text-3xl font-bold tracking-tight font-serif italic">CarCo</h2>
            </div>
            <p className="text-[#A68966]/70 font-light leading-relaxed">
              Movilidad con carácter en El Salvador.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#e6a219] hover:border-[#e6a219] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#e6a219] hover:border-[#e6a219] transition-colors">
                <ThumbsUp className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#e6a219] hover:border-[#e6a219] transition-colors">
                <Camera className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex gap-12 md:gap-24 flex-wrap">
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest">Compañía</h4>
              <Link href="/about" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Sobre Nosotros</Link>
              <Link href="/fleet" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Nuestra Flota</Link>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Carreras</Link>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Prensa</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest">Soporte</h4>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Centro de Ayuda</Link>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Términos de Servicio</Link>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Política de Privacidad</Link>
              <Link href="#" className="text-[#A68966]/70 hover:text-[#e6a219] transition-colors text-sm">Contacto</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#A68966]/50 text-xs">© 2024 CarCo Luxury Rentals. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <MapPin className="text-[#A68966]/50 w-4 h-4" />
            <span className="text-[#A68966]/50 text-xs">San Benito • Santa Elena • La Libertad • El Tunco</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
