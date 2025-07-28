import { ChefHat, Clock, Eye, Heart, Users } from "lucide-react";

export function RecipeBigCard({ recipe, onViewRecipe, onToggleLike }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Mudah';
      case 'medium': return 'Sedang';
      case 'hard': return 'Sulit';
      default: return 'Tidak diketahui';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} jam`;
    return `${hours} jam ${remainingMinutes} menit`;
  };

  // Default image jika tidak ada
  const defaultImage = "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop";
  const recipeImage = recipe.image || defaultImage;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/3 relative">
          <img 
            src={recipeImage} 
            alt={recipe.title}
            className="w-full h-64 lg:h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {getDifficultyText(recipe.difficulty)}
            </span>
          </div>
          <button 
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            onClick={() => onToggleLike && onToggleLike(recipe._id)}
          >
            <Heart className={`w-5 h-5 transition-colors ${recipe.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 hover:text-cyan-600 cursor-pointer transition-colors">
                {recipe.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {recipe.summary}
              </p>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium hover:bg-cyan-100 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(recipe.duration_minutes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{recipe.views?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{recipe.likes || 0}</span>
              </div>
            </div>

            <button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => onViewRecipe && onViewRecipe(recipe)}
            >
              <ChefHat className="w-4 h-4" />
              <span className="font-medium">Lihat Resep</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
