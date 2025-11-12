import React from "react";

interface MedicalDisclaimerProps {
  variant?: "banner" | "card" | "compact";
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  variant = "banner",
  className = "",
}) => {
  if (variant === "compact") {
    return (
      <div
        className={`bg-amber-50 border-l-4 border-amber-500 p-3 ${className}`}
        role="alert"
      >
        <div className="flex items-start gap-2">
          <div className="text-sm text-amber-900">
            <p className="font-semibold">Outil de découverte, pas un dispositif médical</p>
            <p className="mt-1">
              Pour un diagnostic ou traitement, consultez un professionnel de santé.{" "}
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
          <div className="items-center gap-3">
            <h3 className="text-xl font-bold text-amber-900">
              Information Importante
            </h3>
          </div>

          <div className="space-y-3 text-text-primary text-center">
            <p className="leading-relaxed">
              <strong>MentalTech Discover est un outil de découverte</strong>, pas
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
              outil de découverte, pas un dispositif médical. Pour un diagnostic,
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
