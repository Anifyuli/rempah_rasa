import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="p-10 max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Halaman yang kamu cari tidak ditemukan.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
