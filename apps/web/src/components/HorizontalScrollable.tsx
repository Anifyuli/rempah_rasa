import RecipeCard from "./RecipeCard";

export default function HorizontalScrollable({ title, recipes, className = "" }) {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      )}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 w-max">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="w-80 flex-shrink-0">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
