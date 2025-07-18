import User from "../model/user_model.js";
import Recipe from "../model/recipe_model.js";
import bcrypt from "bcrypt";

// ===== USER MANAGEMENT =====

// Get all users with pagination
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;

    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status === "verified") filter.isVerified = true;
    if (status === "unverified") filter.isVerified = false;
    if (status === "admin") filter.isAdmin = true;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Update user verification status
export async function updateUserVerification(req, res) {
  try {
    let { isVerified } = req.body;

    console.log("Received isVerified:", isVerified, typeof isVerified);

    if (typeof isVerified === "string") {
      if (isVerified.toLowerCase() === "true") {
        isVerified = true;
      } else if (isVerified.toLowerCase() === "false") {
        isVerified = false;
      } else {
        return res.status(400).json({
          message: "isVerified must be 'true' or 'false'",
        });
      }
    }

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        message: "isVerified must be a boolean value",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
    });
  } catch (err) {
    console.error("Update verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Update user admin status
export async function updateUserAdminStatus(req, res) {
  try {
    let { isAdmin } = req.body;

    if (typeof isAdmin === "string") {
      if (isAdmin.toLowerCase() === "true") {
        isAdmin = true;
      } else if (isAdmin.toLowerCase() === "false") {
        isAdmin = false;
      } else {
        return res.status(400).json({
          message: "isAdmin must be 'true' or 'false'",
        });
      }
    }

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({
        message: "isAdmin must be a boolean value",
      });
    }

    // Prevent admin from removing their own admin status
    if (req.params.id === req.user.id && !isAdmin) {
      return res.status(400).json({
        message: "Cannot remove admin status from yourself",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      message: `User ${isAdmin ? "promoted to" : "demoted from"} admin successfully`,
    });
  } catch (err) {
    console.error("Update admin status error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Create new admin account
export async function createAdminAccount(req, res) {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      isAdmin: true,
      isVerified: true, // Admin accounts are auto-verified
    });

    const userResponse = {
      _id: adminUser._id,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      username: adminUser.username,
      email: adminUser.email,
      isVerified: adminUser.isVerified,
      isAdmin: adminUser.isAdmin,
    };

    res.status(201).json({
      user: userResponse,
      message: "Admin account created successfully",
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete user account
export async function deleteUser(req, res) {
  try {
    // Prevent admin from deleting their own account
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        message: "Cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // TODO: Also delete user's recipes if needed
    await Recipe.deleteMany({ userId: req.params.id });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ===== RECIPE MANAGEMENT =====

// Get all recipes for admin
export async function getAllRecipesAdmin(req, res) {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;

    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter (if you have status field in recipe)
    // if (status === "published") filter.isPublished = true;
    // if (status === "draft") filter.isPublished = false;

    const recipes = await Recipe.find(filter)
      .populate("userId", "firstName lastName username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(filter);

    res.json({
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get all recipes admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete recipe (admin can delete any recipe)
export async function deleteRecipeAdmin(req, res) {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Delete recipe admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ===== DASHBOARD STATS =====

// Get dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      totalRecipes,
      verifiedUsers,
      adminUsers,
      recentUsers,
      recentRecipes,
    ] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isAdmin: true }),
      User.find().select("-password").sort({ createdAt: -1 }).limit(5),
      Recipe.find()
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalRecipes,
        verifiedUsers,
        adminUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
      },
      recent: {
        users: recentUsers,
        recipes: recentRecipes,
      },
    });
  } catch (err) {
    console.error("Get dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
