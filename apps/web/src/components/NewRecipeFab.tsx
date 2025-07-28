import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

type FloatingActionButtonProps = {
  footerRef: React.RefObject<HTMLElement | null>;
  onClick?: () => void;
};

export default function FloatingActionButton({
  footerRef,
  onClick,
}: FloatingActionButtonProps) {
  const [bottomOffset, setBottomOffset] = useState(24);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const overlap = windowHeight - footerRect.top;

      setBottomOffset(overlap > 0 ? overlap + 24 : 24);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerRef]);

  return (
    <button
      onClick={onClick}
      style={{ bottom: `${bottomOffset}px` }}
      className="
        fixed right-6 z-50
        flex items-center gap-2
        bg-gradient-to-r from-emerald-500 to-cyan-500
        text-white px-5 py-3 rounded-full shadow-2xl
        hover:scale-110 active:scale-95 transition-transform
        focus:outline-none focus:ring-4 focus:ring-emerald-300
      "
    >
      <Plus className="w-6 h-6" />
      <span className="font-medium">Tambahkan Resep</span>
    </button>
  );
}
