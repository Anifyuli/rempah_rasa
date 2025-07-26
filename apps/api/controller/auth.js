import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user_model.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "2d42c144f65cf74b073820c3318140d2a1fe9b6f792f962733172d8141fadf2a";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;

// Helper function untuk mapping user data (menggantikan userData template)
function mapUserData(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  };
}

// Validation helper
function validateUserInput(userData) {
  const errors = [];

  if (!userData.firstName || userData.firstName.trim().length < 2) {
    errors.push("Nama depan harus diisi minimal 2 karakter");
  }

  if (!userData.lastName || userData.lastName.trim().length < 2) {
    errors.push("Nama belakang harus diisi minimal 2 karakter");
  }

  if (!userData.username || userData.username.trim().length < 3) {
    errors.push("Username harus diisi minimal 3 karakter");
  }

  if (!userData.email || !userData.email.includes("@")) {
    errors.push("Email harus valid");
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push("Password harus minimal 6 karakter");
  }

  return errors;
}

// Login controller
export async function login(req, res) {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier dan password harus diisi",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Nama pengguna/surel tidak valid" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Kata sandi tidak tepat" });
    }

    // Access token (pendek)
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Refresh token
    const refreshToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    const userInfo = mapUserData(user);

    res.json({
      accessToken,
      refreshToken,
      user: userInfo,
      message: "Login berhasil",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token diperlukan" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Optional: Verify user masih exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // Generate access token baru
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        isAdmin: decoded.isAdmin,
        isVerified: decoded.isVerified,
      },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({
      accessToken: newAccessToken,
      message: "Token berhasil diperbaharui",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token expired, silakan login ulang" });
    }
    return res.status(403).json({ message: "Refresh token tidak valid" });
  }
}

// Register controller
export async function register(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Validasi input
    const validationErrors = validateUserInput({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: validationErrors,
      });
    }

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email atau username sudah digunakan",
      });
    }

    // Hash password dengan await
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // Mapping data user untuk response
    const userData = mapUserData(newUser);

    return res.status(201).json({
      user: userData,
      message: "Akun berhasil dibuat",
    });
  } catch (err) {
    console.error("Register error:", err);

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `${field} sudah digunakan`,
      });
    }

    return res.status(500).json({
      message: "Terjadi kesalahan server saat membuat akun",
    });
  }
}

// Get profile controller
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const userData = mapUserData(user);

    res.json({
      user: userData,
      message: "Profile berhasil diambil",
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

// Update profile controller
export async function updateProfile(req, res) {
  const { firstName, lastName, email } = req.body;

  try {
    // Validasi input
    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "Nama depan dan nama belakang harus diisi",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const userData = mapUserData(updatedUser);

    res.json({
      user: userData,
      message: "Profile berhasil diupdate",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

// Change password controller
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Password lama dan password baru harus diisi",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password baru harus minimal 6 karakter",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Password lama tidak tepat" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(req.user.id, { password: hashedNewPassword });

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
