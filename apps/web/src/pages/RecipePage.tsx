import { useNavigate } from "react-router-dom";
import { RecipeListContainer } from "../components/RecipeListContainer";
import SearchInput from "../components/SearchInput";
import axios from "../utils/axios";
import { useEffect, useState, useCallback } from "react";
import NewRecipeFloatingActionButton from "../components/NewRecipeFab";

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

type RecipePageProps = {
  footerRef: React.RefObject<HTMLElement | null>;
};

export default function RecipePage({ footerRef }: RecipePageProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Ambil resep dari backend dengan query search
  const fetchRecipes = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const url = query
        ? `/recipe?search=${encodeURIComponent(query)}`
        : "/recipe";
      const res = await axios.get(url);
      setRecipes(res.data);
    } catch (err) {
      console.error("Gagal ambil resep:", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch awal (semua resep)
  useEffect(() => {
    fetchRecipes("");
  }, [fetchRecipes]);

  // Jalankan search dengan debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchRecipes(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, fetchRecipes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white px-6 py-12">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Berbagi Rasa,
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
            {" "}
            Berbagi Cerita
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Kumpulan resep otentik dari dapur-dapur Indonesia. Dibagikan dengan
          cinta oleh sesama pecinta masak untuk keluarga Indonesia.
        </p>

        {/* Search bar */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        <p className="text-sm text-gray-500 mt-4">
          💡 Coba cari: "Nasi goreng", "Rendang", "Dessert mudah"
        </p>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Resep dari Komunitas
        </h2>
        <p className="text-gray-600 mb-5 max-w-2xl mx-auto">
          Koleksi resep terpercaya yang telah dicoba dan direkomendasikan oleh
          komunitas
        </p>

        {loading ? (
          <div className="text-cyan-600 font-medium">Memuat resep...</div>
        ) : (
          <RecipeListContainer
            recipes={recipes}
            onViewRecipe={(recipe: { slug: string }) => {
              navigate(`/recipes/${recipe.slug}`);
            }}
            onToggleLike={undefined}
            onLoadMore={undefined}
          />
        )}
      </div>
      <div className="mt-5">
        <NewRecipeFloatingActionButton onClick={() => navigate("/recipes/new")} footerRef={footerRef} />
      </div>
    </div>
  );
}
