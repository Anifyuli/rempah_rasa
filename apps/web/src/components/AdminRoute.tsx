import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from "react";

interface AdminRouteProps {
  children: JSX.Element;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { accessToken, user, isInitialized } = useAuth();
  const location = useLocation();

  // Tunggu AuthContext siap
  if (!isInitialized) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Jika belum login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Jika login tapi bukan admin
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
