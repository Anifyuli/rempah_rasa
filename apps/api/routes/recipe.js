import express from "express";
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
  .get(async (req, res) => {
    try {
      const recipes = await getAllRecipes();
      res.json(recipes);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch recipes",
        error: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const recipe = await createRecipe(req.body);
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
      const recipe = await getRecipeBySlug(req.params.slug);
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
  .put(async (req, res) => {
    try {
      const updated = await updateRecipe(req.params.slug, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(updated);
    } catch (err) {
      res.status(400).json({
        message: "Failed to update recipe",
        error: err.message,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const deleted = await deleteRecipe(req.params.slug);
      if (!deleted) {
        return res.status(404).json({ message: "Recipe not found" });
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
