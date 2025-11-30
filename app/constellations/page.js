import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function ConstellationsPage() {
  const { data: constellations, error } = await supabase.from("constellation")
    .select(`
      id,
      name,
      abbreviation
    `);

  if (error) {
    return (
      <div className="text-red-500 p-10">Error fetching data: {error.message}</div>
    );
  }

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
        Constellations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {constellations?.map((constellation) => (
          <Link key={constellation.id} href={`/constellations/${constellation.id}`}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-purple-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="h-48 bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
                <span className="text-gray-400 italic">
                  {constellation.name}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-bold mb-2">{constellation.name}</h2>
                {constellation.abbreviation && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Abbreviation:</span> {constellation.abbreviation}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
