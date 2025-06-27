import { mockRecipes } from "../../mock/recipes";
import RecipeCard from "../components/RecipeCard";

const recipes = mockRecipes;

export default function HomePage() {
  return (
    <>
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
              className="p-2 w-sm h-sm rounded-4xl"
            />
          </div>
          {/* Resep */}
          <div className="my-4">
            <h2 className="my-4 font-bold">Resep Teratas Kami</h2>
            <div className="grid grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
        {/* Buat resep baru */}
        <div className="flex flex-row bg-white items-center gap-16">
          <div className="mask-r-from-80% mask-b-from-80% mask-radial-from-70% mask-radial-to-85%">
            <img
              src="/blueberry.png"
              alt="Ilustrasi Blueberry"
              className="w-md h-auto"
            />
          </div>
          <div className="flex flex-col text-wrap absolute left-1/2">
            <p className="text-2xl font-extrabold text-gray-800 leading-tight mb-2">
              Tidak Menemukan Resep Idamanmu?
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Yuk, bagikan kreasi kulinermu di sini dan jadi inspirasi!
            </p>
            <a
              href="#"
              className="w-fit bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
              effects
            >
              Unggah Resepmu Sekarang!
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
