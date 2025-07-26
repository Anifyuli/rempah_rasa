import {
  ArrowLeft,
  Calendar,
  ChefHat,
  Clock,
  Eye,
  Pencil,
  Star,
  Trash2,
  UserRoundCheck,
  UserRoundX,
  Utensils,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axios";

interface Author {
  _id: string;
  username: string;
  isVerified: boolean;
}

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  duration_minutes: number;
  difficulty: string;
  created_at: string;
  updated_at: string;
  views: number;
  userId: Author;
}

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">(
    "ingredients",
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 500));
        const res = await axios.get(`/recipe/${slug}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail:", err);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Mudah";
      case "medium":
        return "Sedang";
      case "hard":
        return "Sulit";
      default:
        return difficulty;
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Apakah kamu yakin ingin menghapus resep ini?",
    );
    if (!confirm) return;

    try {
      await axios.delete(`/recipe/${slug}`);
      alert("Resep berhasil dihapus.");
      navigate("/recipes");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus resep.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-cyan-700 font-semibold">Memuat resep...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Resep Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Resep dengan slug "{slug}" tidak tersedia.
          </p>
          <button
            onClick={() => navigate("/recipes")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Kembali ke Daftar Resep
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/recipes")}
          className="flex items-center gap-2 mb-6 text-cyan-600 hover:text-cyan-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Resep</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-8 h-8" />
                <span className="text-cyan-100 text-lg font-medium">
                  Resep Spesial
                </span>
              </div>
              {user &&
                ((typeof recipe.userId === "string" &&
                  recipe.userId === user._id) ||
                  (typeof recipe.userId === "object" &&
                    recipe.userId._id === user._id)) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/recipes/${slug}/edit`)}
                      className="flex items-center gap-1 bg-white text-cyan-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            <p className="text-lg">{recipe.summary}</p>

            {/* Creator detail */}
            <div className="mt-3 flex items-center gap-2 text-sm text-cyan-100">
              <span>Ditulis oleh:</span>
              <span className="font-semibold">
                {recipe.userId.username}
              </span>
              {recipe.userId.isVerified ? (
                <span className="flex items-center gap-1 bg-emerald-500/80 text-white px-2 py-0.5 rounded-full text-xs">
                  <UserRoundCheck className="w-4 h-4" />
                  Terverifikasi
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-gray-500/40 text-gray-100 px-2 py-0.5 rounded-full text-xs">
                  <UserRoundX className="w-4 h-4" />
                  Belum Verifikasi
                </span>
              )}
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <InfoBox
                icon={<Clock />}
                label="Waktu"
                value={`${recipe.duration_minutes} menit`}
              />
              <InfoBox
                icon={<Star />}
                label="Tingkat"
                value={getDifficultyText(recipe.difficulty)}
              />
              <InfoBox icon={<Eye />} label="Views" value={`${recipe.views}`} />
              <InfoBox
                icon={<Calendar />}
                label="Dibuat"
                value={new Date(recipe.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {recipe.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-md">
          <div className="flex">
            <TabButton
              active={activeTab === "ingredients"}
              onClick={() => setActiveTab("ingredients")}
              icon={<Utensils />}
              label="Bahan-bahan"
            />
            <TabButton
              active={activeTab === "steps"}
              onClick={() => setActiveTab("steps")}
              icon={<ChefHat />}
              label="Langkah-langkah"
            />
          </div>
          <div className="p-6">
            {activeTab === "ingredients" && (
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100"
                  >
                    <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-gray-800">{ing}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "steps" && (
              <ol className="space-y-4">
                {recipe.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-cyan-200"
                  >
                    <div className="w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-800">{step}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Resep ini telah dilihat {recipe.views} kali • Terakhir diperbarui:{" "}
          {new Date(recipe.updated_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1 text-white/90">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition ${
        active ? "bg-cyan-500 text-white" : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
