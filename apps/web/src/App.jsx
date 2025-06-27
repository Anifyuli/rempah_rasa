import { Route, Routes } from "react-router";
import "./App.css";
import NavBar from "./components/NavBar";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  );
}
