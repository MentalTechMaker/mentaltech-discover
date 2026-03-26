import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { changePassword, resendVerification } from "../../api/auth";
import { PasswordStrengthBar } from "./PasswordStrengthBar";

const roleLabels: Record<string, string> = {
  user: "Utilisateur",
  admin: "Administrateur",
  prescriber: "Prescripteur",
};
import { validatePassword } from "../../utils/password";

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { setView } = useAppStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <p className="text-text-secondary">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const result = await changePassword(currentPassword, newPassword);
      setSuccess(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      setVerificationSent(true);
    } catch {
      setError("Erreur lors de l'envoi de l'email de vérification");
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Mon profil
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Nom</label>
              <p className="text-text-primary font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Email</label>
              <div className="flex items-center gap-2">
                <p className="text-text-primary font-medium">{user.email}</p>
                {user.email_verified ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Vérifié
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Non vérifié
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Rôle</label>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-text-primary font-medium">{roleLabels[user.role] ?? user.role}</p>
                {user.role === "prescriber" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Prescripteur
                  </span>
                )}
                {user.role === "prescriber" && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.is_verified_prescriber
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}>
                    {user.is_verified_prescriber ? "Identité vérifiée" : "En attente de validation"}
                  </span>
                )}
              </div>
            </div>

            {user.role === "prescriber" && (
              <>
                {user.profession && (
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Profession</label>
                    <p className="text-text-primary font-medium">{user.profession}</p>
                  </div>
                )}
                {user.organization && (
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Établissement / Organisation</label>
                    <p className="text-text-primary font-medium">{user.organization}</p>
                  </div>
                )}
                {user.rpps_adeli && (
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">N° RPPS / ADELI</label>
                    <p className="text-text-primary font-medium">{user.rpps_adeli}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!user.email_verified && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Votre adresse email n'est pas vérifiée.
              </p>
              {verificationSent ? (
                <p className="text-sm text-yellow-700 mt-1">
                  Un email de vérification a été envoyé.
                </p>
              ) : (
                <button
                  onClick={handleResendVerification}
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                >
                  Renvoyer l'email de vérification
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pending prescriber banner */}
        {user.role === "prescriber" && !user.is_verified_prescriber && (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⏳</span>
              <div>
                <h3 className="text-base font-bold text-amber-900 mb-1">Dossier en cours d'examen</h3>
                <p className="text-sm text-amber-800">
                  Votre dossier est en cours d'examen par notre équipe. Vous recevrez un email de confirmation dès validation de votre compte prescripteur (généralement sous 48h).
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  En attendant, vous pouvez explorer le catalogue et accéder aux fiches produits.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User benefits hint (for non-prescribers) */}
        {user.role === "user" && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-base font-bold text-blue-900 mb-2">Votre espace personnel</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Sauvegardez vos résultats de questionnaire</li>
              <li>Retrouvez vos recommandations personnalisées</li>
              <li>Accédez à un historique de vos recherches</li>
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              Vous êtes professionnel de santé ?{" "}
              <button
                onClick={() => setView("prescriber-auth")}
                className="font-semibold underline"
              >
                Créer un compte prescripteur
              </button>
            </p>
          </div>
        )}

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Changer le mot de passe
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-text-primary mb-1">
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Min. 8 car., majuscule, minuscule, chiffre"
              />
              <PasswordStrengthBar password={newPassword} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
