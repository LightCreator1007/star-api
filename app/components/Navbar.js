import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
            Cosmos Explorer
          </Link>
          <div className="flex space-x-4">
            <Link href="/galaxies">
              <button className="px-4 py-2 text-sm font-semibold text-white hover:text-purple-300 hover:bg-gray-800 rounded-lg transition">
                Galaxies
              </button>
            </Link>
            <Link href="/stars">
              <button className="px-4 py-2 text-sm font-semibold text-white hover:text-yellow-300 hover:bg-gray-800 rounded-lg transition">
                Stars
              </button>
            </Link>
            <Link href="/planets">
              <button className="px-4 py-2 text-sm font-semibold text-white hover:text-blue-300 hover:bg-gray-800 rounded-lg transition">
                Planets
              </button>
            </Link>
            <Link href="/constellations">
              <button className="px-4 py-2 text-sm font-semibold text-white hover:text-pink-300 hover:bg-gray-800 rounded-lg transition">
                Constellations
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

