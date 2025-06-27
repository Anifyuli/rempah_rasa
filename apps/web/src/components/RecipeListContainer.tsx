import { ChefHat } from "lucide-react";
import { RecipeBigCard } from "./RecipeBigCard";

export function RecipeListContainer({
  recipes,
  onViewRecipe,
  onToggleLike,
  onLoadMore,
  hasMore = false,
  loading = false,
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-6">
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada resep yang tersedia</p>
        </div>
      ) : (
        <>
          {recipes.map((recipe) => (
            <RecipeBigCard
              key={recipe._id}
              recipe={recipe}
              onViewRecipe={onViewRecipe}
              onToggleLike={onToggleLike}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8">
              <button
                className="px-8 py-4 bg-white border-2 border-cyan-500 text-cyan-600 rounded-xl hover:bg-cyan-50 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? "Memuat..." : "Muat Lebih Banyak Resep"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
