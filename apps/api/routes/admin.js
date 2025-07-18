import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserVerification,
  updateUserAdminStatus,
  createAdminAccount,
  deleteUser,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
  getDashboardStats
} from "../controller/admin.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ===== DASHBOARD =====
router.get("/dashboard", getDashboardStats);

// ===== USER MANAGEMENT =====
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/verify", updateUserVerification);
router.patch("/users/:id/admin", updateUserAdminStatus);
router.post("/users/create-admin", createAdminAccount);
router.delete("/users/:id", deleteUser);

// ===== RECIPE MANAGEMENT =====
router.get("/recipes", getAllRecipesAdmin);
router.delete("/recipes/:id", deleteRecipeAdmin);

export default router;
