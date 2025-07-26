import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { accessToken, user, isInitialized } = useAuth();
  const location = useLocation();

  // Tampilkan loading saat AuthContext belum siap
  if (!isInitialized) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // Jika tidak ada token, redirect ke login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
