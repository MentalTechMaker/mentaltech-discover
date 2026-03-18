import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useProductsStore } from '../../store/useProductsStore';

interface Props {
  onClose: () => void;
}

export const PrescriberOnboarding: React.FC<Props> = ({ onClose }) => {
  const setView = useAppStore((s) => s.setView);
  const products = useProductsStore((s) => s.products);
  const productCount = products.filter((p) => !p.companyDefunct).length;
  const roundedCount = Math.floor(productCount / 10) * 10;
  const countLabel = roundedCount > 0 ? `Plus de ${roundedCount}` : 'Des dizaines de';

  const STEPS = [
    {
      icon: '🔍',
      title: 'Le catalogue évalué',
      description: `${countLabel} solutions de santé mentale évaluées selon notre grille de qualité : confidentialité des données, preuves cliniques, accessibilité, UX et support.`,
      cta: 'Suivant',
      action: null,
    },
    {
      icon: '⭐',
      title: 'Favoris et prescriptions',
      description:
        'Ajoutez vos solutions préférées en favoris pour les retrouver rapidement. Créez ensuite des prescriptions personnalisées à partager avec vos patients via un lien ou un QR code.',
      cta: 'Suivant',
      action: null,
    },
    {
      icon: '📊',
      title: 'Veille et comparateur',
      description:
        "Comparez plusieurs solutions côte à côte et suivez leurs mises à jour (nouveaux tarifs, études cliniques, nouvelles fonctionnalités) grâce à l'espace Veille.",
      cta: 'Voir le catalogue',
      action: 'catalog' as const,
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
                  i === step ? 'bg-primary' : 'bg-gray-200'
                }`}
                aria-label={`Étape ${i + 1}`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="px-8 py-6 text-center space-y-4">
            <div className="text-5xl">{current.icon}</div>
            <h2 className="text-xl font-bold text-text-primary">{current.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
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
