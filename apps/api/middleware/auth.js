import jwt from "jsonwebtoken";
import User from "../model/user_model.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "2d42c144f65cf74b073820c3318140d2a1fe9b6f792f962733172d8141fadf2a";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tidak memiliki token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: Verify user masih exist di database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED", // Frontend bisa detect ini untuk auto refresh
      });
    }
    return res.status(403).json({ message: "Token tidak valid" });
  }
}
