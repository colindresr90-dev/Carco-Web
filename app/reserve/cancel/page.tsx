import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

export default function ReserveCancelPage() {
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

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto w-full animate-fade-up">
                    <div className="inline-flex items-center gap-2 text-[#e6a219] uppercase tracking-widest text-xs font-bold mb-6">
                        Pago Cancelado
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
                        La Reserva No Fue Completada
                    </h1>

                    <div className="w-16 h-[1px] bg-white/20 mx-auto mb-8"></div>

                    <p className="text-[#1A1714] text-lg font-light max-w-xl mx-auto mb-12">
                        Puedes intentar nuevamente cuando lo desees.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/reserve" className="min-w-[200px] h-14 px-8 bg-[#e6a219] hover:bg-[#e6a219]/90 text-[#1A1714] text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#e6a219]/20 flex items-center justify-center">
                            Intentar Nuevamente
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
