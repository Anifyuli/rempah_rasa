import { Route, Routes } from "react-router-dom";
import "./App.css";

import AdminLayout from "./layout/AdminLayout";
import MainLayout from "./layout/MainLayout";

import { useRef } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminPage";
import CreateNewOrEditRecipePage from "./pages/CreateNewOrEditRecipe";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipePage from "./pages/RecipePage";
import UserProfile from "./pages/UserPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {

  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
        <Route
          path="/recipes/new"
          element={
            <ProtectedRoute>
              <CreateNewOrEditRecipePage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/recipes/:slug/edit"
          element={
            <ProtectedRoute>
              <CreateNewOrEditRecipePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Admin Layout */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
