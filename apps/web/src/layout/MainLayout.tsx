import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useRef } from "react";

export default function MainLayout() {
  const footerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <NavBar />
      <main>
        <Outlet context={{ footerRef }} />
      </main>
      <Footer ref={footerRef} />
    </>
  );
}
