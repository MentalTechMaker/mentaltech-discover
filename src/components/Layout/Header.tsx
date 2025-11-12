import React from "react";
import { useAppStore } from "../../store/useAppStore";

export const Header: React.FC = () => {
  const { currentView, reset, setView } = useAppStore();

  const handleLogoClick = () => {
    if (currentView !== "landing") {
      reset();
    }
  };

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded-lg px-2 py-1"
            aria-label="Retour à l'accueil"
          >
            <div className="bg-white rounded-full p-2">
              <span className="text-2xl">💙</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">
                MentalTech Discover
              </h1>
              <p className="text-xs text-white text-opacity-90">
                Trouvez votre solution en santé mentale
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setView("about")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentView === "about"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white hover:bg-opacity-20 hover:text-black"
              }`}
            >
              🎯 Notre démarche
            </button>
            <button
              onClick={() => setView("faq")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentView === "faq"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white hover:bg-opacity-20 hover:text-black"
              }`}
            >
              ❓ FAQ
            </button>
            <button
              onClick={() => setView("catalog")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentView === "catalog"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white hover:bg-opacity-20 hover:text-black"
              }`}
            >
              📚 Catalogue
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
