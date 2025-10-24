import React from 'react';

interface EmergencyBannerProps {
  onContinue: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onContinue }) => {
  const handleCall = () => {
    window.location.href = 'tel:3114';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-danger">
            Tu as besoin d'aide maintenant
          </h2>
          <p className="text-text-primary leading-relaxed">
            Si tu es en détresse, il est important de parler à quelqu'un immédiatement.
          </p>
        </div>

        <div className="bg-red-50 border-2 border-danger rounded-lg p-4 space-y-3">
          <p className="font-semibold text-text-primary">
            Numéros d'urgence gratuits 24h/24 :
          </p>
          <ul className="space-y-2 text-text-primary">
            <li className="flex items-center gap-2">
              <span className="font-bold">3114</span>
              <span>- Numéro national de prévention du suicide</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">15</span>
              <span>- SAMU (urgences médicales)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCall}
            className="w-full bg-danger text-white px-6 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-danger focus:ring-opacity-50"
            aria-label="Appeler le 3114"
          >
            📞 Appeler le 3114
          </button>
          <button
            onClick={onContinue}
            className="w-full bg-white text-text-secondary border-2 border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
            aria-label="Continuer quand même"
          >
            Continuer quand même
          </button>
        </div>
      </div>
    </div>
  );
};
