export default function InteractiveLogo() {
  return (
    <div className="flex flex-row items-center gap-3 group">
      <div className="relative">
        <img
          src="/rempah-rasa.png"
          className="w-10 h-10 object-cover rounded-full transition-all duration-300"
          alt="Rempah Rasa Logo"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
      </div>
      <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
        Rempah Rasa
      </h1>
    </div>
  );
}
