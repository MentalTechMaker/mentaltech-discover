import React, { useEffect, useState } from "react";
import { confirmPublicSubmission } from "../../api/public";
import { useAppStore } from "../../store/useAppStore";

export const ConfirmSubmissionPage: React.FC = () => {
  const { setView } = useAppStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide - aucun token trouvé.");
      return;
    }
    confirmPublicSubmission(token)
      .then(() => {
        setStatus("success");
        setMessage("Votre soumission est confirmée et sera examinée par notre équipe.");
      })
      .catch((e: unknown) => {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Lien invalide ou expiré.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-muted-foreground">Confirmation en cours...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Soumission confirmée !</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setView("catalog")} className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90">
                Voir le catalogue
              </button>
              <button onClick={() => setView("about")} className="px-6 py-2.5 bg-gray-100 text-text-primary rounded-lg text-sm font-medium hover:bg-gray-200">
                Découvrir notre démarche
              </button>
              <button onClick={() => setView("health-pro-application")} className="px-6 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5">
                Rejoindre le Collectif MentalTech
              </button>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Lien invalide</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <button onClick={() => setView("public-submission")} className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
              Soumettre à nouveau
            </button>
          </>
        )}
      </div>
    </div>
  );
};
