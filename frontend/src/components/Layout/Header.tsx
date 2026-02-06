import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";

export const Header: React.FC = () => {
  const { currentView, reset, setView } = useAppStore();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    if (currentView !== "landing") {
      reset();
    }
  };

  const handleLogout = () => {
    logout();
    reset();
    setMenuOpen(false);
  };

  const navigateTo = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
                  : "text-white hover:bg-white/20"
              }`}
            >
              🎯 Notre démarche
            </button>
            <button
              onClick={() => setView("faq")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentView === "faq"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/20"
              }`}
            >
              ❓ FAQ
            </button>
            <button
              onClick={() => setView("catalog")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentView === "catalog"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/20"
              }`}
            >
              📚 Catalogue
            </button>

            {/* Single account button with dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  menuOpen
                    ? "bg-white text-primary"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden lg:inline">
                  {isAuthenticated ? user?.name : "Mon compte"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => navigateTo("profile")}
                        className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                      >
                        Mon profil
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => navigateTo("admin")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                        >
                          Administration
                        </button>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigateTo("login")}
                        className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                      >
                        Connexion
                      </button>
                      <button
                        onClick={() => navigateTo("register")}
                        className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                      >
                        Inscription
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
