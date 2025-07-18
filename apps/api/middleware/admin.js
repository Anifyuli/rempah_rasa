export default function adminMiddleware(req, res, next) {
  // Pastikan user sudah login (authMiddleware dipanggil sebelumnya)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Cek apakah user adalah admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }

  next();
}
