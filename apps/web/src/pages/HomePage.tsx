import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axios";

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  duration_minutes: number;
  difficulty: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    axios
      .get("/recipe")
      .then((res) => setRecipes(res.data))
      .catch((err) =>
        console.error("Gagal mengambil resep dari backend:", err),
      );
  }, []);

  const handleAddRecipe = () => {
    if (!user) {
      const returnUrl = encodeURIComponent("/recipes/new");
      navigate(`/login?returnUrl=${returnUrl}`);
    } else {
      navigate("/recipes/new");
    }
  };

  if (isInitialized) {
    return (
      <div className="m-0 bg-cyan-50">
        <div className="p-8">
          {/* Tagline */}
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="px-6 italic font-light">
                Masak Kreatif, <br />
                Hidup Lebih Berwarna
              </h1>
              {/* Welcome message untuk user yang sudah login */}
              {user && (
                <p className="px-6 mt-2 text-emerald-600 font-medium">
                  Selamat datang kembali, {user.firstName}! 👋
                </p>
              )}
            </div>
            <img
              src="/food-bg.jpg"
              alt=""
              className="p-2 w-sm h-sm rounded-[3rem]"
            />
          </div>

          {/* Resep */}
          <div className="my-4">
            <h2 className="my-4 font-bold">Resep Teratas Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recipes.slice(0, 6).map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>

        {/* Buat resep baru */}
        <div className="flex flex-row bg-white items-center gap-16 px-8 py-12 relative">
          <div className="mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85%">
            <img
              src="/blueberry.png"
              alt="Ilustrasi Blueberry"
              className="w-md h-auto"
            />
          </div>
          <div className="flex flex-col text-wrap">
            <p className="text-2xl font-extrabold text-gray-800 leading-tight mb-2">
              Tidak Menemukan Resep Idamanmu?
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Yuk, bagikan kreasi kulinermu di sini dan jadi inspirasi!
            </p>
            {user ? (
              // User sudah login - langsung ke halaman tambah resep
              <button
                onClick={handleAddRecipe}
                className="w-fit bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
              >
                Unggah Resepmu Sekarang! ✨
              </button>
            ) : (
              // User belum login - ajak login dulu
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddRecipe}
                  className="w-fit bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  Login & Unggah Resepmu! 🚀
                </button>
                <p className="text-sm text-gray-500">
                  *Login diperlukan untuk menambahkan resep
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
