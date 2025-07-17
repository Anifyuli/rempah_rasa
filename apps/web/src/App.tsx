import { Route, Routes } from "react-router";
import "./App.css";
import NavBar from "./components/NavBar";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import Footer from "./components/Footer";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import CreateNewOrEditRecipePage from "./pages/CreateNewOrEditRecipe";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
        <Route path="/recipes/new" element={<CreateNewOrEditRecipePage />} />
        <Route
          path="/recipes/:slug/edit"
          element={<CreateNewOrEditRecipePage />}
        />
      </Routes>
      <Footer />
    </>
  );
}
