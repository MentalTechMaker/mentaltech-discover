import React from "react";
import { useAppStore } from "../../store/useAppStore";

export const Footer: React.FC = () => {
  const setView = useAppStore((state) => state.setView);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-text-secondary flex items-center justify-center gap-2">
            <span>Anonyme et confidentiel - Aucune donnée collectée</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="mailto:arnaud@mentaltechmaker.fr?subject=Signalement MentalTech Discover&body=Bonjour,%0D%0A%0D%0AJe souhaite signaler un problème concernant :%0D%0A%0D%0A[Décrivez le problème ici]%0D%0A%0D%0ACordialement"
              className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded px-2 py-1 font-semibold"
              aria-label="Signaler un problème"
            >
              🚨 Signaler un problème
            </a>
            <span className="text-text-secondary">|</span>
            <button
              onClick={() => setView("catalog")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Catalogue des solutions"
            >
              📚 Catalogue
            </button>
            <span className="text-text-secondary">|</span>
            <button
              onClick={() => setView("about")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Notre démarche"
            >
              🎯 Notre démarche
            </button>
            <span className="text-text-secondary">|</span>
            <button
              onClick={() => setView("faq")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Questions fréquentes"
            >
              ❓ FAQ
            </button>
            <span className="text-text-secondary">|</span>
            <button
              onClick={() => setView("privacy")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Politique de confidentialité"
            >
              🔒 Confidentialité
            </button>
            <span className="text-text-secondary">|</span>
            <button
              onClick={() => setView("legal")}
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Mentions légales"
            >
              🗎 Mentions légales
            </button>
          </div>

          <p className="text-xs text-text-secondary">
            Créé par{" "}
            <a
              href="https://mentaltechmaker.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              MentalTechMaker
            </a>{" "}
            pour le Collectif MentalTech - © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
