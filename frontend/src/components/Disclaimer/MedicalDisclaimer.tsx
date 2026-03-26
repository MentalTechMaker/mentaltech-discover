import React, { useState } from "react";

interface MedicalDisclaimerProps {
  variant?: "banner" | "card" | "compact" | "collapsible";
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = "banner",
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  if (variant === "collapsible") {
    return (
      <div className={`${className}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-amber-700 text-xs font-medium hover:text-amber-900 transition-colors"
          aria-expanded={open}
        >
          <span>⚠️</span>
          <span>Information importante - pas un dispositif médical</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
            MentalTech Discover est une plateforme d'orientation, pas un dispositif médical certifié.
            Pour un diagnostic, traitement ou urgence, consultez un professionnel de santé.{" "}
            <span className="font-bold">Numéro national de prévention du suicide : 3114 (gratuit 24h/24)</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`bg-amber-50 border-l-4 border-amber-500 p-3 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-2">
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Plateforme d'orientation, pas un dispositif médical</p>
            <p className="mt-1">
              Pour un diagnostic ou traitement, consultez un professionnel de santé.
            </p>
            <p className="mt-1">
              <span className="font-bold">Urgence : 3114</span> (gratuit 24h/24)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-white border-2 border-amber-400 rounded-lg p-6 shadow-md ${className}`}
        role="alert"
      >
        <div className="space-y-4">
          <div className="items-center gap-3 text-center">
            <h3 className="text-xl font-bold text-amber-900">
              Information Importante
            </h3>
          </div>

          <div className="space-y-3 text-text-primary text-center">
            <p className="leading-relaxed">
              <strong>MentalTech Discover est une plateforme d'orientation</strong>, pas
              un dispositif médical certifié.
            </p>

            <p className="leading-relaxed">
              Les solutions référencées sont celles des membres du{" "}
              <strong>Collectif MentalTech</strong>. Ce référencement ne constitue
              pas une recommandation médicale.
            </p>

            <p className="leading-relaxed">
              Pour un <strong>diagnostic</strong>, un <strong>traitement</strong>{" "}
              ou une <strong>urgence</strong>, consultez un professionnel de santé.
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-center">
            <p className="font-bold text-red-900 mb-2">En cas de crise :</p>
            <div className="space-y-2 text-text-primary">
              <div className="items-center gap-2">
                <span className="font-bold text-lg">3114</span>
                <span> - Numéro national de prévention du suicide (gratuit 24h/24)</span>
              </div>
              <div className="items-center gap-2">
                <span className="font-bold text-lg">15</span>
                <span> - SAMU (urgences médicales)</span>
              </div>
              <div className="items-center gap-2">
                <span className="font-bold text-lg">112</span>
                <span> - Urgences européennes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-amber-50 to-orange-50 py-4 ${className}`}
      role="alert"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-amber-900 leading-relaxed text-center">
              <strong>Information importante :</strong> MentalTech Discover est un
              plateforme d'orientation, pas un dispositif médical. Pour un diagnostic,
              traitement ou urgence, consultez un professionnel de santé.{" "}
              <span className="font-bold whitespace-nowrap">
                Urgence : 3114 (gratuit 24h/24)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
