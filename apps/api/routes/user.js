import express from "express";
import {
  changePassword,
  getProfile,
  login,
  register,
  updateProfile,
} from "../controller/auth.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

export default router;
