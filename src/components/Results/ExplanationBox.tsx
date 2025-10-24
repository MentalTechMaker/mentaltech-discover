import React from 'react';

interface ExplanationBoxProps {
  explanation: string;
}

export const ExplanationBox: React.FC<ExplanationBoxProps> = ({ explanation }) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-50/50 to-purple-50 p-8 shadow-lg border border-blue-100"
      style={{
        animation: 'fadeIn 0.8s ease-out',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="relative flex items-start gap-5">
        {/* Icône animée */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
            <span className="text-3xl" aria-hidden="true">
              💡
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-text-primary">
              Pourquoi ces solutions ?
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
          </div>

          <p className="text-text-primary leading-relaxed whitespace-pre-line text-base">
            {explanation}
          </p>

          {/* Badge de confiance */}
          <div className="flex items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-primary border border-blue-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Recommandations personnalisées
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
