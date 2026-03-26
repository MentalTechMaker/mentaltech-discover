import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { analytics } from "../../lib/analytics";

interface EmergencyBannerProps {
  onContinue: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onContinue,
}) => {
  const answers = useAppStore((s) => s.answers);
  const isCritical = answers.urgency === "dark-thoughts";

  const handleCall = (number: string) => {
    analytics.emergencyNumberClicked(number);
    window.location.href = `tel:${number}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label="Ressources d'urgence"
      onKeyDown={(e) => e.key === "Escape" && onContinue()}
    >
      <div
        className={`max-w-lg w-full rounded-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
          isCritical
            ? "bg-red-50 border-2 border-red-300"
            : "bg-orange-50 border-2 border-orange-300"
        }`}
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-5xl">{isCritical ? "\u26a0\ufe0f" : "\ud83e\udde1"}</div>
          <h2
            className={`text-2xl font-bold ${
              isCritical ? "text-red-800" : "text-orange-800"
            }`}
          >
            {isCritical
              ? "Tu n'es pas seul\u00b7e. De l'aide existe maintenant."
              : "Des ressources sont disponibles pour toi"}
          </h2>
          <p
            className={`text-base leading-relaxed ${
              isCritical ? "text-red-700" : "text-orange-700"
            }`}
          >
            {isCritical
              ? "Ce que tu traverses est difficile, et tu m\u00e9rites d'\u00eatre accompagn\u00e9\u00b7e. Des professionnels sont l\u00e0 pour t'\u00e9couter gratuitement, 24h/24, en toute confidentialit\u00e9."
              : "Tu as indiqu\u00e9 ne pas te sentir bien en ce moment. C'est courageux d'en prendre conscience. Si tu ressens le besoin de parler \u00e0 quelqu'un, voici des ressources gratuites et confidentielles."}
          </p>
        </div>

        {/* Emergency numbers */}
        <div
          className={`rounded-xl p-5 space-y-3 ${
            isCritical
              ? "bg-red-100 border border-red-200"
              : "bg-orange-100 border border-orange-200"
          }`}
        >
          <p
            className={`font-semibold text-sm uppercase tracking-wide ${
              isCritical ? "text-red-800" : "text-orange-800"
            }`}
          >
            {isCritical
              ? "Num\u00e9ros d'urgence - Gratuits et disponibles 24h/24"
              : "Lignes d'\u00e9coute - Gratuites et confidentielles"}
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleCall("3114")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-left transition-colors ${
                isCritical
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <span className="text-xl">{"\ud83d\udcde"}</span>
              <div>
                <div className="text-lg">3114</div>
                <div className="text-sm font-normal opacity-90">
                  Pr\u00e9vention du suicide - 24h/24, 7j/7
                </div>
              </div>
            </button>

            <a
              href="tel:15"
              onClick={() => handleCall("15")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                isCritical
                  ? "bg-red-200 text-red-900 hover:bg-red-300"
                  : "bg-orange-200 text-orange-900 hover:bg-orange-300"
              }`}
            >
              <span className="text-xl">{"\ud83d\ude91"}</span>
              <div>
                <div className="text-base font-semibold">15 - SAMU</div>
                <div className="text-sm font-normal">Urgences m\u00e9dicales</div>
              </div>
            </a>

            <a
              href="tel:112"
              onClick={() => handleCall("112")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                isCritical
                  ? "bg-red-200 text-red-900 hover:bg-red-300"
                  : "bg-orange-200 text-orange-900 hover:bg-orange-300"
              }`}
            >
              <span className="text-xl">{"\ud83c\uddea\ud83c\uddfa"}</span>
              <div>
                <div className="text-base font-semibold">112</div>
                <div className="text-sm font-normal">
                  Urgences europ\u00e9ennes
                </div>
              </div>
            </a>

            <a
              href="tel:0972394050"
              onClick={() => handleCall("0972394050")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                isCritical
                  ? "bg-red-200 text-red-900 hover:bg-red-300"
                  : "bg-orange-200 text-orange-900 hover:bg-orange-300"
              }`}
            >
              <span className="text-xl">{"\ud83e\udd1d"}</span>
              <div>
                <div className="text-base font-semibold">
                  09 72 39 40 50 - SOS Amiti\u00e9
                </div>
                <div className="text-sm font-normal">\u00c9coute et soutien</div>
              </div>
            </a>
          </div>
        </div>

        {/* Online resource */}
        <div
          className={`rounded-xl p-4 text-center ${
            isCritical ? "bg-red-50" : "bg-orange-50"
          }`}
        >
          <p
            className={`text-sm mb-2 ${
              isCritical ? "text-red-700" : "text-orange-700"
            }`}
          >
            Tu peux aussi chatter en ligne avec un professionnel :
          </p>
          <a
            href="https://www.3114.fr"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 font-semibold underline ${
              isCritical
                ? "text-red-700 hover:text-red-900"
                : "text-orange-700 hover:text-orange-900"
            }`}
          >
            www.3114.fr
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Acknowledge button */}
        <div className="pt-2">
          <button
            onClick={onContinue}
            className={`w-full px-6 py-3 rounded-xl font-medium text-sm transition-colors ${
              isCritical
                ? "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                : "bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200"
            }`}
          >
            J'ai pris connaissance de ces ressources - Continuer
          </button>
        </div>
      </div>
    </div>
  );
};
