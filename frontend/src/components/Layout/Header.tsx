import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";

export const Header: React.FC = () => {
  const { currentView, reset, setView } = useAppStore();
  const { isAuthenticated, isAdmin, isPrescriber, isPrescriberPending, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    if (currentView !== "landing") reset();
  };

  const handleLogout = () => {
    logout();
    reset();
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const navigateTo = (view: Parameters<typeof setView>[0]) => {
    setView(view);
    setMenuOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const navLink = (view: string, emoji: string, text: string) => (
    <button
      onClick={() => setView(view as Parameters<typeof setView>[0])}
      className={`relative px-4 py-1.5 text-sm font-bold transition-all group text-white`}
    >
      <span aria-hidden="true">{emoji}</span> {text}
      <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-200 ${
        currentView === view ? "bg-white opacity-100" : "bg-white opacity-0 group-hover:opacity-60"
      }`} />
    </button>
  );

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-1"
            aria-label="Retour à l'accueil"
          >
            <div className="bg-white rounded-full p-2 shadow-sm">
              <span className="text-base leading-none" aria-hidden="true">💙</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">
              MentalTech Discover
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
            {navLink("about", "🎯", "Démarche")}
            {navLink("faq", "❓", "FAQ")}
            {navLink("catalog", "📚", "Catalogue")}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* CTA - desktop */}
            <button
              onClick={() => setView("public-submission")}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-secondary text-white hover:opacity-90 transition-opacity shadow-sm"
            >
              <span aria-hidden="true">➕</span>
              <span>Référencer</span>
            </button>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                    menuOpen
                      ? "bg-white text-primary border-white"
                      : "text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                  }`}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user?.name}</span>
                  <svg
                    className={`w-3 h-3 transition-transform flex-shrink-0 ${menuOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[200]">
                    <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => navigateTo("profile")}
                      className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                      <span aria-hidden="true">👤</span> Profil
                    </button>
                    {(isPrescriber || isPrescriberPending) && (
                      <>
                        <p className="px-4 pt-2 pb-1 text-xs font-bold text-text-secondary uppercase tracking-wider">Prescripteur</p>
                        <button onClick={() => navigateTo("prescriber-dashboard")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">📊</span> Tableau de bord
                        </button>
                        <button onClick={() => navigateTo("new-prescription")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">📝</span> Prescrire
                        </button>
                        <button onClick={() => navigateTo("veille")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">🔍</span> Veille
                        </button>
                        <button onClick={() => navigateTo("comparator")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">⚖️</span> Comparer
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <p className="px-4 pt-2 pb-1 text-xs font-bold text-text-secondary uppercase tracking-wider">Admin</p>
                        <button onClick={() => navigateTo("admin")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">⚙️</span> Admin
                        </button>
                        <button onClick={() => navigateTo("admin-submissions")}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors">
                          <span aria-hidden="true">📋</span> Soumissions
                        </button>
                      </>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                        <span aria-hidden="true">🚪</span> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setView("prescriber-auth")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-purple-500 hover:opacity-90 transition-opacity shadow-sm"
              >
                <span aria-hidden="true">🩺</span>
                <span className="hidden lg:inline">Prescripteur</span>
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-white/20 pb-3 pt-2 space-y-0.5">
            {[
              { view: "about", emoji: "🎯", text: "Démarche" },
              { view: "faq", emoji: "❓", text: "FAQ" },
              { view: "catalog", emoji: "📚", text: "Catalogue" },
            ].map(({ view, emoji, text }) => (
              <button
                key={view}
                onClick={() => navigateTo(view as Parameters<typeof setView>[0])}
                className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                  currentView === view
                    ? "text-white font-bold bg-white/10"
                    : "text-white/80 font-semibold hover:text-white hover:bg-white/10"
                }`}
              >
                <span aria-hidden="true">{emoji}</span> {text}
              </button>
            ))}
            <button
              onClick={() => navigateTo("public-submission")}
              className={`w-full text-left px-4 py-3 min-h-[44px] text-sm font-bold rounded-full transition-colors ${
                currentView === "public-submission"
                  ? "text-white bg-emerald-500/50"
                  : "text-white bg-emerald-500/30 hover:bg-emerald-500/40"
              }`}
            >
              <span aria-hidden="true">➕</span> Référencer
            </button>

            <div className="border-t border-white/20 mt-2 pt-2 space-y-0.5">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                  <button onClick={() => navigateTo("profile")}
                    className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                      currentView === "profile"
                        ? "text-white font-bold bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}>
                    <span aria-hidden="true">👤</span> Profil
                  </button>
                  {(isPrescriber || isPrescriberPending) && (
                    <>
                      <button onClick={() => navigateTo("prescriber-dashboard")}
                        className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                          currentView === "prescriber-dashboard"
                            ? "text-white font-bold bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}>
                        <span aria-hidden="true">📊</span> Tableau de bord
                      </button>
                      <button onClick={() => navigateTo("new-prescription")}
                        className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                          currentView === "new-prescription"
                            ? "text-white font-bold bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}>
                        <span aria-hidden="true">📝</span> Prescrire
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <button onClick={() => navigateTo("admin")}
                        className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                          currentView === "admin"
                            ? "text-white font-bold bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}>
                        <span aria-hidden="true">⚙️</span> Admin
                      </button>
                      <button onClick={() => navigateTo("admin-submissions")}
                        className={`w-full text-left px-4 py-3 min-h-[44px] text-sm rounded-lg transition-colors ${
                          currentView === "admin-submissions"
                            ? "text-white font-bold bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}>
                        <span aria-hidden="true">📋</span> Soumissions
                      </button>
                    </>
                  )}
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-white/10 rounded-lg transition-colors">
                    <span aria-hidden="true">🚪</span> Déconnexion
                  </button>
                </>
              ) : (
                <button onClick={() => navigateTo("prescriber-auth")}
                  className={`w-full text-left px-4 py-3 min-h-[44px] text-sm font-semibold rounded-lg transition-colors ${
                    currentView === "prescriber-auth"
                      ? "text-white font-bold bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}>
                  <span aria-hidden="true">🩺</span> Prescripteur
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
