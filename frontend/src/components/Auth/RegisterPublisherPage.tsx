import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { validatePassword } from "../../utils/password";

export const RegisterPublisherPage: React.FC = () => {
  const { setView } = useAppStore();
  const { registerPublisher } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) {
      setError("Veuillez indiquer le nom de votre entreprise");
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
      await registerPublisher({
        email,
        password,
        name,
        company_name: companyName,
        siret: siret || undefined,
        company_website: companyWebsite || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-4">
              Inscription reussie
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Compte editeur cree
            </h2>
            <p className="text-text-secondary mb-6">
              Votre compte editeur sera active par un administrateur sous 48h.
              Vous recevrez un email de confirmation une fois votre compte verifie.
            </p>
            <button
              onClick={() => setView("profile")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Voir mon profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Compte Editeur
            </div>
            <h2 className="text-2xl font-bold text-text-primary">
              Inscription Editeur
            </h2>
            <p className="text-text-secondary text-sm mt-2">
              Soumettez votre solution de sante mentale pour evaluation et
              referencement sur MentalTech Discover
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
                  htmlFor="publisher-name"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Nom complet
                </label>
                <input
                  id="publisher-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label
                  htmlFor="publisher-email"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Email professionnel
                </label>
                <input
                  id="publisher-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="contact@votre-entreprise.com"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Informations entreprise
              </h3>

              <div>
                <label
                  htmlFor="publisher-company"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Nom de l'entreprise *
                </label>
                <input
                  id="publisher-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="MaSolution SAS"
                />
              </div>

              <div>
                <label
                  htmlFor="publisher-siret"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  N SIRET
                  <span className="text-text-secondary font-normal ml-1">
                    (optionnel)
                  </span>
                </label>
                <input
                  id="publisher-siret"
                  type="text"
                  value={siret}
                  onChange={(e) => setSiret(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="123 456 789 00012"
                />
              </div>

              <div>
                <label
                  htmlFor="publisher-website"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Site web de l'entreprise
                  <span className="text-text-secondary font-normal ml-1">
                    (optionnel)
                  </span>
                </label>
                <input
                  id="publisher-website"
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="https://votre-entreprise.com"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-bold text-text-primary">
                Mot de passe
              </h3>

              <div>
                <label
                  htmlFor="publisher-password"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Mot de passe
                </label>
                <input
                  id="publisher-password"
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
                  htmlFor="publisher-confirm"
                  className="block text-sm font-semibold text-text-primary mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  id="publisher-confirm"
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
              {loading ? "Inscription..." : "Creer mon compte editeur"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-text-secondary">
              Deja un compte ?{" "}
              <button
                onClick={() => setView("login")}
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
