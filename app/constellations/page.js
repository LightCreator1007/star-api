import { supabase } from "@/lib/supabaseClient"; // Adjust path if your lib folder is elsewhere

// This is a Server Component (async by default in Next.js 13+)
export default async function ConstellationsPage() {
  // 1. The Query: "Give me every constellation, and for each one, give me its stars (just the names)"
  const { data: constellations, error } = await supabase.from("constellation")
    .select(`
      id,
      name,
      stars (
        id,
        name
      )
    `);

  // 2. The Crash Handler: If the DB explodes, show the error
  if (error) {
    return (
      <div className="text-red-500">Error fetching data: {error.message}</div>
    );
  }

  // 3. The UI: Loop through the results and display cards
  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
        Star Maps
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {constellations?.map((constellation) => (
          <div
            key={constellation.id}
            className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-purple-500/50 hover:shadow-lg transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
              <span className="text-gray-400 italic">
                Image of {constellation.name}
              </span>
            </div>

            <div className="p-5">
              {/* Constellation Name */}
              <h2 className="text-2xl font-bold mb-2">{constellation.name}</h2>

              {/* Stars List */}
              <div className="mt-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
                  Major Stars:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {constellation.stars && constellation.stars.length > 0 ? (
                    constellation.stars.map((star) => (
                      <span
                        key={star.id}
                        className="px-2 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full border border-purple-700"
                      >
                        {star.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 text-sm">
                      No stars recorded yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
