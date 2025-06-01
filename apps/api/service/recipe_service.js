// service/recipe_service.js
import Recipe from "../model/recipe_model.js";
import { slugify } from "../utils/slugify.js";

// Function to check if a string is a valid JSON array
function isJSONArray(str) {
  if (typeof str !== "string") return false;
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

// Function to fix arrays that might contain JSON strings
function fixArrayWithJSONStrings(arr) {
  if (!Array.isArray(arr)) return arr;

  return arr
    .map((item) => {
      if (typeof item === "string" && isJSONArray(item)) {
        try {
          const parsedArray = JSON.parse(item);
          return parsedArray;
        } catch (e) {
          return item;
        }
      }
      return item;
    })
    .flat();
}

// Function untuk membersihkan data input dan output
export default function cleanData(obj) {
  if (typeof obj === "string") {
    // Membersihkan escape sequences
    let cleanedStr = obj
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\b/g, "\b")
      .replace(/\\f/g, "\f")
      .replace(/\\v/g, "\v");

    // Cek apakah string yang sudah dibersihkan adalah JSON array
    if (isJSONArray(cleanedStr)) {
      try {
        const parsedArray = JSON.parse(cleanedStr);
        // Lanjutkan pembersihan pada array yang di-parse
        return cleanData(parsedArray);
      } catch (e) {
        return cleanedStr;
      }
    } else {
      return cleanedStr;
    }
  }

  if (Array.isArray(obj)) {
    const fixedArray = fixArrayWithJSONStrings(obj);
    return fixedArray.map((item) => cleanData(item));
  }

  if (obj && typeof obj === "object" && obj.constructor === Object) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanData(value);
    }
    return cleaned;
  }

  return obj;
}

// Generate a unique slug based on the recipe title
async function generateUniqueSlug(title) {
  let slug = slugify(title);
  let slugExists = await Recipe.findOne({ slug });
  let suffix = 1;

  while (slugExists) {
    slug = `${slugify(title)}-${suffix++}`;
    slugExists = await Recipe.findOne({ slug });
  }

  return slug;
}

// Create a new recipe dengan data yang sudah dibersihkan
export async function createRecipe(data) {
  if (!data.title) {
    throw new Error("Title is required");
  }

  const cleanedData = cleanData(data);
  cleanedData.slug = await generateUniqueSlug(cleanedData.title);

  const recipe = new Recipe(cleanedData);
  const savedRecipe = await recipe.save();

  // Gunakan cleanData, bukan cleanEscapeSequences
  return cleanData(savedRecipe.toObject());
}

// Get all recipes dengan data yang sudah dibersihkan
export async function getAllRecipes() {
  const recipes = await Recipe.find().sort({ created_at: -1 });
  return recipes.map((recipe) => cleanData(recipe.toObject()));
}

// Get a single recipe by its slug dengan data yang sudah dibersihkan
export async function getRecipeBySlug(slug) {
  const recipe = await Recipe.findOne({ slug });
  return recipe ? cleanData(recipe.toObject()) : null;
}

// Update a recipe dengan data yang sudah dibersihkan
export async function updateRecipe(slug, updates) {
  // Clean input data dan fix JSON strings
  const cleanedUpdates = cleanData(updates);

  const recipe = await Recipe.findOneAndUpdate({ slug }, cleanedUpdates, {
    new: true,
    runValidators: true,
  });

  return recipe ? cleanData(recipe.toObject()) : null;
}

// Delete a recipe by its slug
export async function deleteRecipe(slug) {
  return Recipe.findOneAndDelete({ slug });
}

// Bonus: Function untuk search recipes dengan cleaning
export async function searchRecipes(query) {
  const recipes = await Recipe.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { ingredients: { $regex: query, $options: "i" } },
    ],
  }).sort({ created_at: -1 });

  return recipes.map((recipe) => cleanData(recipe.toObject()));
}
