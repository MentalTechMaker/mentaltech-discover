import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { validatePassword } from "../../utils/password";

const professionOptions = [
  "Psychiatre",
  "Psychologue",
  "Médecin généraliste",
  "Infirmier(e) en pratique avancée",
  "Ergothérapeute",
  "Assistante sociale",
  "Éducateur spécialisé",
  "Conseiller en santé mentale",
  "Autre professionnel de santé",
];

export const RegisterPrescriberPage: React.FC = () => {
  const { setView } = useAppStore();
  const { registerPrescriber } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [rppsAdeli, setRppsAdeli] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!profession) {
      setError("Veuillez indiquer votre profession");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      await registerPrescriber(
        email,
        password,
        name,
        profession,
        organization || undefined,
        rppsAdeli || undefined
      );
      setView("profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold mb-4">
              Compte Prescripteur
            </div>
            <h2 className="text-2xl font-bold text-text-primary">
              Inscription Prescripteur
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              Accedez aux evaluations detaillees et justificatifs des solutions
              referencees
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Informations personnelles
              </h3>

              <div>
                <label
                  htmlFor="prescriber-name"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Nom complet
                </label>
                <input
                  id="prescriber-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Dr. Jean Dupont"
                />
              </div>

              <div>
                <label
                  htmlFor="prescriber-email"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Email professionnel
                </label>
                <input
                  id="prescriber-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="votre@email-professionnel.com"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Informations professionnelles
              </h3>

              <div>
                <label
                  htmlFor="prescriber-profession"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Profession *
                </label>
                <select
                  id="prescriber-profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                >
                  <option value="">Selectionnez votre profession</option>
                  {professionOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="prescriber-organization"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Etablissement / Organisation
                </label>
                <input
                  id="prescriber-organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="CHU, cabinet, association..."
                />
              </div>

              <div>
                <label
                  htmlFor="prescriber-rpps"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  N RPPS / ADELI
                  <span className="text-text-secondary font-normal ml-1">
                    (optionnel)
                  </span>
                </label>
                <input
                  id="prescriber-rpps"
                  type="text"
                  value={rppsAdeli}
                  onChange={(e) => setRppsAdeli(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Votre numero RPPS ou ADELI"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Mot de passe
              </h3>

              <div>
                <label
                  htmlFor="prescriber-password"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Mot de passe
                </label>
                <input
                  id="prescriber-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Min. 8 car., majuscule, minuscule, chiffre"
                />
                <PasswordStrengthBar password={password} />
              </div>

              <div>
                <label
                  htmlFor="prescriber-confirm"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="prescriber-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Inscription..." : "Créer mon compte prescripteur"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-text-secondary">
              Deja un compte ?{" "}
              <button
                onClick={() => setView("prescriber-auth")}
                className="text-primary font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
