import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { validatePassword } from "../../utils/password";

const professionOptions = [
  "Médecin généraliste",
  "Médecin du travail",
  "Psychiatre",
  "Pédopsychiatre",
  "Psychologue",
  "Neuropsychologue",
  "Infirmier(e) en pratique avancée",
  "Infirmier(e) en psychiatrie",
  "Ergothérapeute",
  "Orthophoniste",
  "Psychomotricien(ne)",
  "Assistant(e) social(e)",
  "Éducateur(trice) spécialisé(e)",
  "Conseiller(e) en économie sociale et familiale",
  "Sage-femme",
  "Pharmacien(ne)",
  "Addictologue",
  "Pair-aidant(e) professionnel(le)",
  "Coach en santé mentale",
  "Psychothérapeute",
  "Médecin scolaire",
  "Infirmier(e) scolaire",
  "Autre professionnel de santé",
];

type Tab = "login" | "register";

export const PrescriberAuthPage: React.FC = () => {
  const { setView } = useAppStore();
  const { login, registerPrescriber } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [rppsAdeli, setRppsAdeli] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerConsent, setRegisterConsent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginError("Veuillez saisir une adresse email valide");
      return;
    }

    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      const { user } = useAuthStore.getState();
      if (user?.role === "admin") {
        setView("admin");
      } else if (user?.role === "prescriber") {
        setView("prescriber-dashboard");
      } else {
        setView("landing");
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setRegisterError("Veuillez saisir une adresse email valide");
      return;
    }

    if (!profession) {
      setRegisterError("Veuillez indiquer votre profession");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setRegisterError(passwordError);
      return;
    }

    if (!registerConsent) {
      setRegisterError("Veuillez accepter la politique de confidentialité");
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError("Les mots de passe ne correspondent pas");
      return;
    }

    setRegisterLoading(true);
    try {
      const result = await registerPrescriber(
        registerEmail,
        password,
        name,
        profession,
        organization || undefined,
        rppsAdeli || undefined,
      );
      if (result.email_sent === false) {
        setRegisterError(
          "Compte créé, mais l'email de vérification n'a pas pu être envoyé. Réessayez plus tard.",
        );
      }
      setView("profile");
    } catch (err) {
      setRegisterError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription",
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold mb-4">
            🩺 Espace prescripteur
          </div>
          <h2 className="text-2xl font-bold text-text-primary">
            {activeTab === "login"
              ? "Connexion"
              : "Créer un compte prescripteur"}
          </h2>
        </div>

        {/* Value proposition */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-indigo-900 mb-2">
            Vos avantages prescripteur :
          </p>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-indigo-500">✓</span> Prescriptions
              numériques à vos patients
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-500">✓</span> Évaluations complètes
              des solutions (5 piliers)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-500">✓</span> Réseau de
              professionnels engagés
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-500">✓</span> 100% gratuit
            </li>
          </ul>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "register"
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Créer un compte
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* LOGIN TAB */}
          {activeTab === "login" && (
            <>
              <form onSubmit={handleLogin} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-text-primary mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="votre@email-professionnel.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-text-primary mb-1"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Votre mot de passe"
                  />
                </div>
                {loginError && (
                  <div
                    role="alert"
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {loginError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loginLoading ? "Connexion..." : "Se connecter"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setView("forgot-password")}
                  className="text-sm text-text-secondary hover:text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </>
          )}

          {/* REGISTER TAB */}
          {activeTab === "register" && (
            <>
              <form onSubmit={handleRegister} noValidate className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">
                    Informations personnelles
                  </h3>
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Nom complet
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Dr. Jean Dupont"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Email professionnel
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                      htmlFor="reg-profession"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Profession *
                    </label>
                    <select
                      id="reg-profession"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    >
                      <option value="">Sélectionnez votre profession</option>
                      {professionOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-organization"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Établissement / Organisation
                    </label>
                    <input
                      id="reg-organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="CHU, cabinet, association..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-rpps"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      N° RPPS / ADELI
                      <span className="text-text-secondary font-normal ml-1">
                        (optionnel)
                      </span>
                    </label>
                    <input
                      id="reg-rpps"
                      type="text"
                      value={rppsAdeli}
                      onChange={(e) => setRppsAdeli(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Votre numéro RPPS ou ADELI"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">
                    Mot de passe
                  </h3>
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Mot de passe
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Min. 8 car., majuscule, minuscule, chiffre"
                    />
                    <PasswordStrengthBar password={password} />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-confirm"
                      className="block text-sm font-semibold text-text-primary mb-1"
                    >
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="reg-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>
                </div>

                {registerError && (
                  <div
                    role="alert"
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {registerError}
                  </div>
                )}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registerConsent}
                    onChange={(e) => setRegisterConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    J'accepte la{" "}
                    <button
                      type="button"
                      onClick={() => setView("privacy")}
                      className="text-primary underline"
                    >
                      politique de confidentialité
                    </button>
                    .
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={registerLoading || !registerConsent}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {registerLoading
                    ? "Inscription..."
                    : "Créer mon compte prescripteur"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
