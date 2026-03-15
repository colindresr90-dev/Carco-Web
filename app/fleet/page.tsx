import { createClient } from '@/lib/supabase/server';
import FleetClient from './FleetClient';

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const supabase = createClient();
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) {
    console.error("Fleet Page Fetch Error:", error.message);
  }

  const activeVehicles = vehicles || [];
  console.log("Vehicles from DB (Fleet):", activeVehicles);

  if (!activeVehicles || activeVehicles.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif text-[#1A1714] mb-4">No vehicles available</h2>
        <a href="/" className="text-[#e6a219] hover:underline uppercase tracking-widest text-sm font-bold">Volver al inicio</a>
      </div>
    );
  }

  return <FleetClient initialVehicles={activeVehicles} renderTime={Date.now()} />;
}
