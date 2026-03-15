'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0C10] flex flex-col md:flex-row">
      {/* Editorial Image Side */}
      <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen overflow-hidden shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/login/login.jpg')" }}
        ></div>
        {/* Dark subtle gradient overlay to keep it premium */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>

        {/* Branding Elements positioned over image */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest w-fit backdrop-blur-sm bg-black/10 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </Link>

          <div className="md:mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-white italic drop-shadow-lg mb-4">
              La Puerta de Entrada <br className="hidden md:block" />a la Excelencia.
            </h2>
            <p className="text-white/80 font-light max-w-md tracking-wide">
              Acceso exclusivo al portafolio de vehículos más refinado de El Salvador.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-y-auto bg-[#fcfaf8]">
        <div className="w-full max-w-sm">
          <SignIn
            routing="path"
            path="/login"
            fallbackRedirectUrl="/"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "auto",
                logoPlacement: "inside",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-white shadow-xl border border-gray-100 p-8 rounded-2xl flex flex-col gap-6 w-full",
                headerTitle: "text-2xl font-serif text-[#1A1714] font-bold tracking-tight text-center mb-1",
                headerSubtitle: "text-gray-500 text-sm text-center font-normal tracking-wide",
                socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-all duration-200 h-12 rounded-lg",
                socialButtonsBlockButtonText: "text-gray-700 font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-400 text-xs font-medium px-4",
                formFieldLabel: "text-sm font-bold text-gray-700 mb-1.5",
                formFieldInput: "bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-[#7b5dfa] focus:ring-1 focus:ring-[#7b5dfa] transition-all h-12 shadow-sm placeholder:text-gray-400",
                formButtonPrimary: "bg-[#7b5dfa] hover:bg-[#684be0] text-white font-bold py-3.5 h-12 rounded-lg text-sm transition-all shadow-md shadow-[#7b5dfa]/20 mt-4 w-full",
                footerAction: "mt-6 text-center bg-transparent p-0",
                footerActionText: "text-gray-500 text-sm",
                footerActionLink: "text-[#7b5dfa] hover:text-[#684be0] font-bold transition-colors ml-1",
                identityPreviewText: "text-gray-900 font-medium",
                identityPreviewEditButtonIcon: "text-gray-500 hover:text-gray-700",
                formFieldAction: "text-[#7b5dfa] hover:text-[#684be0] transition-colors text-xs font-semibold ml-auto",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-600",
                footer: "bg-gray-50 border-t border-gray-100 rounded-b-2xl p-4 mt-2",
                logoImage: "mx-auto mb-4"
              },
              variables: {
                colorPrimary: "#7b5dfa",
                colorText: "#1A1714",
                colorBackground: "#ffffff",
                colorInputText: "#1A1714",
                colorInputBackground: "#ffffff",
                fontFamily: "inherit",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
