import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CheckCircle } from 'lucide-react';

export default function ReserveSuccessPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#1A1714] text-[#fcfaf8]">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 px-6 relative">
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s ease-out forwards;
            opacity: 0;
          }
        `}} />

                {/* Hero Confirmation */}
                <div className="text-center max-w-3xl mx-auto w-full mb-8 animate-fade-up">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-[#e6a219]/10 rounded-full flex items-center justify-center border border-[#e6a219]/20">
                            <CheckCircle className="w-10 h-10 text-[#e6a219]" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-[#e6a219] uppercase tracking-widest text-xs font-bold mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#e6a219]"></span>
                        Reserva Confirmada
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
                        Tu Vehículo Está Asegurado
                    </h1>

                    <div className="w-24 h-[1px] bg-[#e6a219]/50 mx-auto mb-8"></div>

                    <p className="text-[#A68966] text-lg md:text-xl font-light max-w-2xl mx-auto mb-4">
                        El pago ha sido procesado con éxito. Tu reserva ha sido guardada y tu experiencia CarCo comienza ahora.
                    </p>

                    <p className="text-white/60 text-sm max-w-lg mx-auto mb-10">
                        Hemos enviado un correo electrónico con los detalles completos de tu reserva.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        <Link href="/reservations" className="min-w-[200px] h-14 px-8 bg-[#e6a219] hover:bg-[#e6a219]/90 text-[#1A1714] text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#e6a219]/20 flex items-center justify-center">
                            Ver Mis Reservas
                        </Link>
                        <Link href="/" className="min-w-[200px] h-14 px-8 bg-transparent border border-white/40 text-white/90 hover:bg-white hover:text-[#1A1714] text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

