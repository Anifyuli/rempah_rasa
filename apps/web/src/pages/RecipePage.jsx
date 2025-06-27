import router from "react-router";
import { mockRecipes } from "../../mock/recipes";
import { RecipeListContainer } from "../components/RecipeListContainer";
import SearchInput from "../components/SearchInput";

export default function RecipePage() {
  return (
    <>
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
          <SearchInput />
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
          <RecipeListContainer
            recipes={mockRecipes}
            onViewRecipe={(recipe) => {
              // Navigate ke /recipe/[slug]
              router.push(`/recipe/${recipe.slug}`);
            }}
          />
        </div>
      </div>
    </>
  );
}
