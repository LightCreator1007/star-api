import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-lg">
          Explore the Cosmos
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Discover the wonders of the universe, from distant galaxies to mesmerizing constellations.
        </p>
        <Link href="/constellations">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105">
            Explore Constellations
          </button>
        </Link>
      </div>
    </div>
  );
}
