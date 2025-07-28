import { Link } from "react-router-dom";

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  duration_minutes: number;
  difficulty: string;
  views: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "Mudah";
      case "medium":
        return "Sedang";
      case "hard":
        return "Sulit";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{recipe.summary}</p>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-orange-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {recipe.duration_minutes} menit
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {recipe.views} views
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
            recipe.difficulty
          )}`}
        >
          {getDifficultyText(recipe.difficulty)}
        </span>
      </div>

      {/* Tombol ke detail */}
      <Link
        to={`/recipes/${recipe.slug}`}
        className="block text-center bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
      >
        Lihat Resep
      </Link>
    </div>
  );
}
