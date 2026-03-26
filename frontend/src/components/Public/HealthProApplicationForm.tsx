import React, { useState, useRef, useEffect } from "react";
import { applyHealthPro } from "../../api/public";
import { useAppStore } from "../../store/useAppStore";
import { setPageMeta, setCanonical } from "../../utils/meta";

const PROFESSIONS = [
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

export const HealthProApplicationForm: React.FC = () => {
  const { setView } = useAppStore();
  const loadedAt = useRef(Date.now() / 1000);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [rppsAdeli, setRppsAdeli] = useState("");
  const [organization, setOrganization] = useState("");
  const [motivation, setMotivation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPageMeta(
      "Candidature professionnel de santé - MentalTech Collectif",
      "Rejoignez le réseau des professionnels de santé engagés dans le numérique en santé mentale. Candidatez gratuitement au Collectif MentalTech."
    );
    setCanonical("/pro-sante");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !profession) {
      setError("Le nom, l'email et la profession sont requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("L'adresse email n'est pas valide.");
      return;
    }
    if (linkedin.trim() && !linkedin.trim().startsWith("http")) {
      setError("Le lien LinkedIn doit commencer par http:// ou https://");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await applyHealthPro({
        name: name.trim(),
        email: email.trim(),
        profession,
        rpps_adeli: rppsAdeli.trim() || undefined,
        organization: organization.trim() || undefined,
        motivation: motivation.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        honeypot,
        submitted_at_ts: loadedAt.current,
      });
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Vérifiez votre boîte mail</h2>
          <p className="text-muted-foreground mb-6">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Cliquez sur le lien pour valider votre candidature.
          </p>
          <p className="text-sm text-muted-foreground">
            Le bureau du Collectif examinera ensuite votre dossier.
          </p>
          <button
            onClick={() => setView("landing")}
            className="mt-6 text-primary hover:underline text-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      {/* Honeypot */}
      <input
        type="text"
        name="website_url"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => setView("join-collective")}
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1"
          >
            ← Retour
          </button>
          <div className="text-4xl mb-3">👩‍⚕️</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Rejoindre le Collectif</h1>
          <p className="text-muted-foreground">
            Pour les professionnels de santé souhaitant soutenir et co-construire l'écosystème MentalTech.
          </p>
        </div>

        {/* Avantages */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-amber-900 mb-3">Pourquoi rejoindre le Collectif ?</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-2"><span>✅</span> Accès au réseau MentalTech et à ses membres</li>
            <li className="flex items-start gap-2"><span>✅</span> Participation aux groupes de travail thématiques</li>
            <li className="flex items-start gap-2"><span>✅</span> Contribution à l'évaluation des solutions</li>
            <li className="flex items-start gap-2"><span>✅</span> Accès aux événements et ressources exclusives</li>
          </ul>
          <p className="text-sm text-amber-700 mt-3 font-medium">Cotisation annuelle pour les professionnels de santé</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nom complet <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Prénom Nom"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@hopital.fr"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profession <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROFESSIONS.map(p => (
                <label
                  key={p}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    profession === p
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="profession"
                    value={p}
                    checked={profession === p}
                    onChange={() => setProfession(p)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Numéro RPPS ou ADELI <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={rppsAdeli}
                onChange={e => setRppsAdeli(e.target.value)}
                placeholder="10 chiffres"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Établissement / Organisation <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="CHU, cabinet libéral..."
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Profil LinkedIn <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/votre-profil"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Pourquoi souhaitez-vous rejoindre le Collectif ?
            </label>
            <textarea
              value={motivation}
              onChange={e => setMotivation(e.target.value)}
              placeholder="Partagez vos motivations et ce que vous espérez apporter au collectif..."
              rows={4}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Un email de confirmation vous sera envoyé. Votre candidature sera examinée par le bureau du Collectif.
            </p>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Vous souhaitez référencer une solution ?{" "}
          <button
            onClick={() => setView("public-submission")}
            className="text-primary hover:underline"
          >
            Formulaire de référencement
          </button>
        </p>
      </div>
    </div>
  );
};
