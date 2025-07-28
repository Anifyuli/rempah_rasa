import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChefHat, PlusCircle } from "lucide-react";
import { useApi } from "../hooks/useApi"
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axios";

export default function CreateOrEditRecipePage() {
  const { user } = useAuth();
  const api = useApi()
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const isEditMode = Boolean(slug);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState("easy");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    axios
      .get(`/recipe/${slug}`)
      .then((res) => {
        const recipe = res.data;
        setTitle(recipe.title);
        setSummary(recipe.summary);
        setDuration(recipe.duration_minutes);
        setDifficulty(recipe.difficulty);
        setIngredients(recipe.ingredients);
        setSteps(recipe.steps);
        setTags(recipe.tags);
      })
      .catch((err) => {
        alert(
          "Gagal mengambil data resep: " +
            (err.response?.data?.message || err.message),
        );
        navigate("/recipes");
      });
  }, [slug]);

  const updateArrayField = (
    updater: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    updater((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addField = (
    updater: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    updater((prev) => [...prev, ""]);
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalSlug = slug ?? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (isEditMode) {
        // Untuk edit, Anda perlu menambahkan function di useApi
        await axios.patch(`/recipe/${slug}`, {
          title,
          summary,
          duration_minutes: duration,
          difficulty,
          ingredients,
          steps,
          tags,
        });
      } else {
        // Gunakan useApi
        await api.createNewRecipe({
          title,
          slug: finalSlug,
          summary,
          duration_minutes: duration,
          difficulty,
          ingredients,
          steps,
          tags,
        });
      }

      navigate(`/recipes/${finalSlug}`);
    } catch (err) {
      console.error('Error:', err); // tambahkan logging
      alert("Gagal menyimpan resep");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8">
          <div className="mb-6 flex items-center gap-2 text-cyan-600">
            <ChefHat className="w-6 h-6" />
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Resep" : "Tambah Resep Baru"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Judul Resep
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Contoh: Nasi Goreng Spesial"
              />
            </div>

            {/* Ringkasan */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Ringkasan
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
                placeholder="Deskripsi singkat tentang resep ini..."
              />
            </div>

            {/* Durasi & Kesulitan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Durasi Memasak (menit)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Tingkat Kesulitan
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="easy">Mudah</option>
                  <option value="medium">Sedang</option>
                  <option value="hard">Sulit</option>
                </select>
              </div>
            </div>

            {/* Bahan */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Bahan-bahan
              </label>
              {ingredients.map((item, index) => (
                <input
                  key={index}
                  value={item}
                  onChange={(e) =>
                    updateArrayField(setIngredients, index, e.target.value)
                  }
                  className="w-full p-3 mb-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Bahan #${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addField(setIngredients)}
                className="flex items-center text-cyan-600 font-medium mt-2 hover:underline"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Tambah bahan
              </button>
            </div>

            {/* Langkah */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Langkah-langkah
              </label>
              {steps.map((item, index) => (
                <textarea
                  key={index}
                  value={item}
                  onChange={(e) =>
                    updateArrayField(setSteps, index, e.target.value)
                  }
                  className="w-full p-3 mb-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Langkah #${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addField(setSteps)}
                className="flex items-center text-cyan-600 font-medium mt-2 hover:underline"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Tambah langkah
              </button>
            </div>

            {/* Tag */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Tag
              </label>
              {tags.map((tag, index) => (
                <input
                  key={index}
                  value={tag}
                  onChange={(e) =>
                    updateArrayField(setTags, index, e.target.value)
                  }
                  className="w-full p-3 mb-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Tag #${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addField(setTags)}
                className="flex items-center text-cyan-600 font-medium mt-2 hover:underline"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Tambah tag
              </button>
            </div>

            {/* Tombol Submit */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
              >
                {loading
                  ? "Menyimpan..."
                  : isEditMode
                    ? "Simpan Perubahan"
                    : "Simpan Resep"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
