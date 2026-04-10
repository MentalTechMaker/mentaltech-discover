import React, { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { verifyEmail } from "../../api/auth";

export const VerifyEmailPage: React.FC = () => {
  const { setView } = useAppStore();
  const { loadUser } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Lien de vérification invalide");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
        loadUser();
        window.history.replaceState(null, "", "/check-email");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Erreur lors de la vérification",
        );
      });
  }, [loadUser]);

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          {status === "loading" && (
            <>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Vérification en cours...
              </h2>
              <p className="text-text-secondary">
                Veuillez patienter pendant la vérification de votre email.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 text-5xl">&#10003;</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Email vérifié
              </h2>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
                <p>{message}</p>
              </div>
              <button
                onClick={() => setView("landing")}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Continuer
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                Erreur de vérification
              </h2>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                <p>{message}</p>
              </div>
              <button
                onClick={() => setView("landing")}
                className="text-primary font-semibold hover:underline"
              >
                Retour à l'accueil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
