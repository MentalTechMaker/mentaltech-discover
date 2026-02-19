import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { resetPassword } from "../../api/auth";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { validatePassword } from "../../utils/password";

export const ResetPasswordPage: React.FC = () => {
  const { setView } = useAppStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  };

  const token = getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Lien de réinitialisation invalide");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      window.history.replaceState(null, "", "/reset-password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Lien invalide</h2>
            <p className="text-text-secondary mb-4">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <button
              onClick={() => setView("forgot-password")}
              className="text-primary font-semibold hover:underline"
            >
              Demander un nouveau lien
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Nouveau mot de passe
          </h2>

          {success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <p className="font-semibold">Mot de passe réinitialisé</p>
                <p className="text-sm mt-1">
                  Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
                </p>
              </div>
              <button
                onClick={() => setView("prescriber-auth")}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-text-primary mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Min. 8 car., majuscule, minuscule, chiffre"
                  />
                  <PasswordStrengthBar password={newPassword} />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
