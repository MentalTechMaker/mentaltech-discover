import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { validatePassword } from "../../utils/password";

export const RegisterPage: React.FC = () => {
  const { setView } = useAppStore();
  const { register } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      await register(email, password, name);
      setView("landing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Inscription
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-1">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-1">
                Mot de passe
              </label>
              <input
                id="password"
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
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Déjà un compte ?{" "}
            <button
              onClick={() => setView("prescriber-auth")}
              className="text-primary font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>

          <p className="mt-3 text-center text-sm text-text-secondary">
            Professionnel de santé ?{" "}
            <button
              onClick={() => setView("prescriber-auth")}
              className="text-primary font-semibold hover:underline"
            >
              Inscription Prescripteur →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
