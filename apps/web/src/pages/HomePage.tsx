import { useEffect, useState } from "react";
import axios from "../utils/axios";
import RecipeCard from "../components/RecipeCard";

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

  useEffect(() => {
    axios
      .get("/recipe")
      .then((res) => setRecipes(res.data))
      .catch((err) =>
        console.error("Gagal mengambil resep dari backend:", err)
      );
  }, []);

  return (
    <div className="m-0 bg-cyan-50">
      <div className="p-8">
        {/* Tagline */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="px-6 italic font-light">
            Masak Kreatif, <br />
            Hidup Lebih Berwarna
          </h1>
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
              <RecipeCard key={recipe._id} recipe={recipe}  />
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
          <a
            href="/recipes/new"
            className="w-fit bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Unggah Resepmu Sekarang!
          </a>
        </div>
      </div>
    </div>
  );
}
