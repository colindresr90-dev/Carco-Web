'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(solid);
  const { user } = useUser();

  useEffect(() => {
    if (solid) return; // always solid, no listener needed
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [solid]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#fcfaf8]/90 backdrop-blur-md border-[#A68966]/20' : 'bg-transparent backdrop-blur-sm border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`transition-transform group-hover:scale-110 ${isScrolled ? 'text-[#e6a219]' : 'text-white'}`}>
              {/* Material Symbol equivalent using Lucide or SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M11.25 0c-4.142 0-7.5 3.358-7.5 7.5 0 1.901.714 3.636 1.89 4.965l-1.39 2.78c-.2.4-.04.88.36 1.08l.9.45c.4.2.88.04 1.08-.36l1.25-2.5c1.03.37 2.15.58 3.32.58 4.142 0 7.5-3.358 7.5-7.5S15.392 0 11.25 0zm0 12c-2.485 0-4.5-2.015-4.5-4.5S8.765 3 11.25 3s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
                <path d="M18.75 9h-1.5v3h-3v1.5h3v3h1.5v-3h3V12h-3V9z" />
                <path d="M19 19H5V5h2V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h-2v2z" opacity="0.3" />
                {/* Replacing with a simple car icon SVG for clarity */}
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
            </span>
            <span className={`text-2xl font-bold tracking-tight font-serif italic ${isScrolled ? 'text-[#1A1714]' : 'text-white'}`}>CarCo</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] transition-colors text-sm font-medium tracking-wide uppercase`}>Inicio</Link>
            <Link href="/fleet" className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] transition-colors text-sm font-medium tracking-wide uppercase`}>Flota</Link>
            <Link href="/destinations" className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] transition-colors text-sm font-medium tracking-wide uppercase`}>Destinos</Link>
            <Link href="/about" className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] transition-colors text-sm font-medium tracking-wide uppercase`}>Nosotros</Link>
            <Link href="/soporte" className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] transition-colors text-sm font-medium tracking-wide uppercase`}>Soporte</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/login" className={`hidden sm:flex items-center justify-center px-6 py-2 border transition-all duration-300 rounded-full text-sm font-bold tracking-wide uppercase ${isScrolled ? 'border-[#A68966] text-[#A68966] hover:bg-[#A68966] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[#1A1714]'}`}>
                Iniciar Sesión
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="hidden sm:flex items-center gap-3">
                {user && (
                  <div className="flex items-center justify-center mr-2">
                    <span className={`text-xs uppercase font-sans tracking-[0.2em] font-medium ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
                      Bienvenido, {user.firstName}
                    </span>
                  </div>
                )}
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-white/20 hover:border-[#e6a219] transition-colors" } }}>
                  <UserButton.MenuItems>
                    {/* Mis Reservas — visible to all signed-in users */}
                    <UserButton.Action
                      label="Mis Reservas"
                      labelIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      }
                      onClick={() => { window.location.href = '/reservations'; }}
                    />
                    {/* Admin Links — only for admins */}
                    {user?.publicMetadata?.role === 'admin' && (
                      <UserButton.Action
                        label="Administrar Reservas"
                        labelIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                        }
                        onClick={() => { window.location.href = '/admin/reservations'; }}
                      />
                    )}
                    {user?.publicMetadata?.role === 'admin' && (
                      <UserButton.Action
                        label="Administrar Vehículos"
                        labelIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                            <circle cx="7" cy="17" r="2" />
                            <path d="M9 17h6" />
                            <circle cx="17" cy="17" r="2" />
                          </svg>
                        }
                        onClick={() => { window.location.href = '/admin/vehicles'; }}
                      />
                    )}
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>
            <button className={`${isScrolled ? 'text-[#1A1714]' : 'text-white'} hover:text-[#e6a219] font-medium text-sm hidden sm:block`}>
              ES | EN
            </button>
            <button className={`md:hidden ${isScrolled ? 'text-[#1A1714]' : 'text-white'}`}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
