import { CookingPot, Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="flex items-center max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <CookingPot className="w-5 h-5 text-cyan-500" />
        </div>
        <input
          type="text"
          id="simple-search"
          className="w-full pl-12 pr-4 py-4 text-gray-700 text-base placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none"
          placeholder="Cari resep yang diinginkan..."
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-14 h-14 m-1 text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:ring-4 focus:ring-cyan-200 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <Search className="w-5 h-5" />
        <span className="sr-only">Cari</span>
      </button>
    </div>
  );
}
