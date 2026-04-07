import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  onClose: () => void;
}

export const PrescriberOnboarding: React.FC<Props> = ({ onClose }) => {
  const setView = useAppStore((s) => s.setView);

  const STEPS = [
    {
      icon: "🩺",
      title: "Recommandez en 30 secondes",
      description: `La prochaine fois qu'un patient vous demande "quelle appli me conseillez-vous ?", sélectionnez 1 à 3 solutions et envoyez-lui un lien personnalisé. C'est plus rapide que de chercher de mémoire.`,
      cta: "Suivant",
      action: null,
    },
    {
      icon: "📋",
      title: "Créez votre première ordonnance",
      description:
        "Choisissez des solutions dans le catalogue, ajoutez un message pour votre patient, et partagez le lien ou le QR code directement en consultation. Votre patient reçoit les recommandations avec vos coordonnées.",
      cta: "Créer ma première ordonnance",
      action: "new-prescription" as const,
    },
    {
      icon: "⭐",
      title: "Construisez votre bibliothèque",
      description:
        "Au fil du temps, ajoutez vos solutions préférées en favoris et prenez des notes cliniques. Elles apparaîtront en priorité lors de vos prochaines prescriptions.",
      cta: "Explorer le catalogue",
      action: "catalog" as const,
    },
  ];

  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleCTA = () => {
    if (current.action) {
      onClose();
      setView(current.action);
    } else if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bienvenue sur votre espace prescripteur"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">
          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center pt-5 pb-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? "bg-primary" : "bg-gray-200"
                }`}
                aria-label={`Étape ${i + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="px-8 py-6 text-center space-y-4">
            <div className="text-5xl">{current.icon}</div>
            <h2 className="text-xl font-bold text-text-primary">
              {current.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Actions */}
          <div className="px-8 pb-7 space-y-2">
            <button
              type="button"
              onClick={handleCTA}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {current.cta}
            </button>
            {!isLast && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Passer l'introduction
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
