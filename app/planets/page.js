import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function PlanetsPage() {
  const { data: planets, error } = await supabase
    .from("planets")
    .select(`
      planet_id,
      name,
      moon_no,
      mass
    `);

  if (error) {
    return (
      <div className="text-red-500 p-10">Error fetching data: {error.message}</div>
    );
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
        Planets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planets?.map((planet) => (
          <Link key={planet.planet_id} href={`/planets/${planet.planet_id}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-blue-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="h-48 bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center">
                <span className="text-gray-400 italic">
                  {planet.name}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-bold mb-2">{planet.name}</h2>
                <p className="text-gray-400">
                  <span className="text-gray-500">Moons:</span> {planet.moon_no || 0}
                </p>
                <p className="text-gray-400 mt-1">
                  <span className="text-gray-500">Mass:</span> {planet.mass ? `${planet.mass} kg` : 'N/A'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
