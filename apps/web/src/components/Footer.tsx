import InteractiveLogo from "./InteractiveLogo";
import { forwardRef } from "react";

const Footer = forwardRef<HTMLElement>((_props, ref) => {
  const year = new Date();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer ref={ref} className="mt-8 p-8 bg-cyan-950 text-cyan-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <InteractiveLogo />
        <ul className="flex flex-wrap justify-center items-center gap-6 list-none">
          <li>
            <a
              href="/recipes"
              className="hover:text-lg hover:scale-110 transition-all duration-300"
            >
              Daftar Resep
            </a>
          </li>
          <li>
            <a
              href=""
              className="hover:text-lg hover:scale-110 transition-all duration-300"
            >
              Tentang Kami
            </a>
          </li>
          <li>
            <button
              onClick={scrollToTop}
              className="hover:text-lg hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              Kembali ke Atas
            </button>
          </li>
        </ul>
      </div>

      <p className="text-center text-sm mt-6">
        &copy; {year.getFullYear()} - Rempah Rasa, All Right Reserved
      </p>
    </footer>
  );
});

export default Footer;
