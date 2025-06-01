// migrations/fix_escape_sequences.js
import mongoose from "mongoose";
import Recipe from "../model/recipe_model.js";
import cleanData from "../service/recipe_service.js";

// Koneksi ke MongoDB
mongoose.connect("mongodb://localhost:27017/rempah_rasa", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixExistingData() {
  try {
    // Ambil semua resep dari database
    const recipes = await Recipe.find();

    // Loop setiap resep
    for (const recipe of recipes) {
      // Bersihkan data menggunakan fungsi cleanData yang sudah diperbaiki
      const cleanedRecipe = cleanData(recipe.toObject());

      // Update fields yang perlu diperbaiki (contoh: ingredients, steps, tags)
      const updates = {
        ingredients: cleanedRecipe.ingredients,
        steps: cleanedRecipe.steps,
        tags: cleanedRecipe.tags,
      };

      // Simpan perubahan ke database
      await Recipe.updateOne({ _id: recipe._id }, { $set: updates });
    }

    console.log("Migration completed! Data has been cleaned.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    mongoose.disconnect();
  }
}

// Jalankan migrasi
fixExistingData();
