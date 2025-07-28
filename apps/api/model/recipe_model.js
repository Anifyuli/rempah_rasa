import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    tags: [{ type: String }],
    duration_minutes: { type: Number },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Avoid duplicated model errors on reload
const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;
