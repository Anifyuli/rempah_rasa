import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";
import {
  getAllRecipes,
  getRecipeBySlug,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../service/recipe_service.js";

const router = express.Router();

// Routes for /api/recipe
router
  .route("/")
  // GET - bisa diakses tanpa login (optional auth)
  .get(async (req, res) => {
    try {
      const recipes = await getAllRecipes(req.user?.id || null);
      res.json(recipes);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch recipes",
        error: err.message,
      });
    }
  })
  // POST - wajib login
  .post(authMiddleware, async (req, res) => {
    try {
      const recipeData = {
        ...req.body,
        userId: req.user.id
      };
      const recipe = await createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (err) {
      res.status(400).json({
        message: "Failed to add recipe",
        error: err.message,
      });
    }
  });

// Routes for /api/recipe/:slug
router
  .route("/:slug")
  .get(async (req, res) => {
    try {
      const recipe = await getRecipeBySlug(req.params.slug, req.user?.id || null);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch recipe",
        error: err.message,
      });
    }
  })
  // PATCH - wajib login
  .patch(authMiddleware, async (req, res) => {
    try {
      const updated = await updateRecipe(req.params.slug, req.body, req.user.id);
      if (!updated) {
        return res.status(404).json({ message: "Recipe not found or unauthorized" });
      }
      res.json(updated);
    } catch (err) {
      res.status(400).json({
        message: "Failed to update recipe",
        error: err.message,
      });
    }
  })
  // DELETE - wajib login
  .delete(authMiddleware, async (req, res) => {
    try {
      const deleted = await deleteRecipe(req.params.slug, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Recipe not found or unauthorized" });
      }
      res.json({ message: "Recipe successfully deleted" });
    } catch (err) {
      res.status(500).json({
        message: "Failed to delete recipe",
        error: err.message,
      });
    }
  });

export default router;
