import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PlanetDetailPage({ params }) {
  const { id } = await params;
  
  const { data: planet, error } = await supabase
    .from("planets")
    .select(`
      planet_id,
      name,
      moon_no,
      mass,
      surface_temp,
      radius,
      age,
      galaxy_id,
      galaxies (
        galaxy_id,
        name
      )
    `)
    .eq("planet_id", id)
    .single();

  if (error || !planet) {
    notFound();
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <Link href="/planets" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
        ← Back to Planets
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-900 to-cyan-800 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-300">
              {planet.name}
            </span>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">{planet.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">Mass</span>
                  <p className="text-xl">{planet.mass ? `${planet.mass} kg` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">Radius</span>
                  <p className="text-xl">{planet.radius ? `${planet.radius} km` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">Number of Moons</span>
                  <p className="text-xl">{planet.moon_no || 0}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">Surface Temperature</span>
                  <p className="text-xl">{planet.surface_temp ? `${planet.surface_temp} K` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">Age</span>
                  <p className="text-xl">{planet.age ? `${planet.age} years` : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Galaxy Link */}
            {planet.galaxies && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Galaxy</h2>
                <Link href={`/galaxies/${planet.galaxies.galaxy_id}`}>
                  <span className="px-4 py-2 bg-indigo-900/50 text-indigo-200 rounded-full border border-indigo-700 hover:bg-indigo-800 cursor-pointer transition inline-block">
                    {planet.galaxies.name}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

