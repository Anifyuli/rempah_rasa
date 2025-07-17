import InteractiveLogo from "./InteractiveLogo";
import { Plus } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="bg-gradient-to-r from-emerald-50 to-cyan-50 backdrop-blur-lg border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-row justify-between items-center">
          {/* Logo Section */}
          <InteractiveLogo />

          {/* Navigation Menu */}
          <ul className="flex flex-row list-none gap-8 items-center">
            <li className="relative group">
              <a
                href="/"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Beranda
              </a>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
            </li>
            <li className="relative group">
              <a
                href="/recipes"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Daftar Resep
              </a>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
            </li>
            <li className="relative group">
              <a
                href="/about"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                Tentang Kami
              </a>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></div>
            </li>
          </ul>

          {/* CTA Button */}
          <a
            href="/recipes/new"
            className="relative group bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Plus />
              Tambahkan Resepmu
            </span>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </nav>
  );
}
