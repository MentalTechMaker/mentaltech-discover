import React, { useState } from "react";
import {
  approveSubmission,
  rejectSubmission,
  requestChanges,
} from "../../api/publisher";
import {
  protocolPillars,
  getAnswer,
} from "../../data/protocolQuestions";
import type { ProductSubmission } from "../../types";

interface Props {
  submission: ProductSubmission;
  onClose: () => void;
  onActionComplete: () => void;
}

export const SubmissionReview: React.FC<Props> = ({
  submission,
  onClose,
  onActionComplete,
}) => {
  const [scoreSecurity, setScoreSecurity] = useState<string>("");
  const [scoreEfficacy, setScoreEfficacy] = useState<string>("");
  const [scoreAccessibility, setScoreAccessibility] = useState<string>("");
  const [scoreUx, setScoreUx] = useState<string>("");
  const [scoreSupport, setScoreSupport] = useState<string>("");
  const [justificationSecurity, setJustificationSecurity] = useState("");
  const [justificationEfficacy, setJustificationEfficacy] = useState("");
  const [justificationAccessibility, setJustificationAccessibility] = useState("");
  const [justificationUx, setJustificationUx] = useState("");
  const [justificationSupport, setJustificationSupport] = useState("");
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [modalNotes, setModalNotes] = useState("");

  const canReview =
    submission.status === "submitted" || submission.status === "under_review";

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    try {
      await approveSubmission(submission.id, {
        admin_notes: adminNotes || undefined,
        score_security: scoreSecurity ? Number(scoreSecurity) : undefined,
        score_efficacy: scoreEfficacy ? Number(scoreEfficacy) : undefined,
        score_accessibility: scoreAccessibility ? Number(scoreAccessibility) : undefined,
        score_ux: scoreUx ? Number(scoreUx) : undefined,
        score_support: scoreSupport ? Number(scoreSupport) : undefined,
        justification_security: justificationSecurity || undefined,
        justification_efficacy: justificationEfficacy || undefined,
        justification_accessibility: justificationAccessibility || undefined,
        justification_ux: justificationUx || undefined,
        justification_support: justificationSupport || undefined,
      });
      onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError("");
    try {
      await rejectSubmission(submission.id, modalNotes);
      setShowRejectModal(false);
      onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    setLoading(true);
    setError("");
    try {
      await requestChanges(submission.id, modalNotes);
      setShowChangesModal(false);
      onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Review : {submission.name || "Sans titre"}
        </h2>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary"
        >
          Retour a la liste
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Submission data */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Informations de base
            </h3>
            <div className="space-y-3">
              {[
                { label: "Nom", value: submission.name },
                { label: "Type", value: submission.type },
                { label: "Accroche", value: submission.tagline },
                { label: "Description", value: submission.description },
                { label: "URL", value: submission.url },
                {
                  label: "Tarification",
                  value: [submission.pricingModel, submission.pricingAmount]
                    .filter(Boolean)
                    .join(" - "),
                },
                { label: "B2B", value: submission.forCompany ? "Oui" : "Non" },
                { label: "Public", value: submission.audience?.join(", ") },
                { label: "Problemes", value: submission.problemsSolved?.join(", ") },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-text-secondary">
                    {label}
                  </p>
                  <p className="text-sm text-text-primary">
                    {value || "Non renseigne"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol answers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Reponses au protocole
            </h3>
            {protocolPillars.map((pillar) => (
              <div key={pillar.id} className="mb-4">
                <h4 className="text-sm font-bold text-text-primary mb-2">
                  {pillar.id}. {pillar.title}
                </h4>
                {pillar.subCriteria.map((sc) => {
                  const answers = getAnswer(
                    submission.protocolAnswers,
                    sc.id
                  );
                  const hasAnswers = Object.values(answers).some(
                    (v) =>
                      v !== "" && v !== false && v !== null && v !== undefined
                  );
                  if (!hasAnswers) return null;
                  return (
                    <div
                      key={sc.id}
                      className="ml-4 mb-3 border-l-2 border-gray-200 pl-3"
                    >
                      <p className="text-xs font-semibold text-text-secondary">
                        {sc.id} - {sc.title}
                      </p>
                      {sc.questions.map((q) => {
                        const val = answers[q.id];
                        if (
                          val === undefined ||
                          val === "" ||
                          val === false ||
                          val === null
                        )
                          return null;
                        const displayVal =
                          typeof val === "boolean"
                            ? "Oui"
                            : String(val);
                        return (
                          <div key={q.id} className="text-xs mt-1">
                            <span className="text-text-secondary">
                              {q.label}:
                            </span>{" "}
                            <span className="text-text-primary font-medium">
                              {displayVal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scoring form */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Scores d'evaluation (0-20)
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Securite & Confidentialite",
                  score: scoreSecurity,
                  setScore: setScoreSecurity,
                  justification: justificationSecurity,
                  setJustification: setJustificationSecurity,
                },
                {
                  label: "Efficacite & Preuves cliniques",
                  score: scoreEfficacy,
                  setScore: setScoreEfficacy,
                  justification: justificationEfficacy,
                  setJustification: setJustificationEfficacy,
                },
                {
                  label: "Accessibilite & Inclusion",
                  score: scoreAccessibility,
                  setScore: setScoreAccessibility,
                  justification: justificationAccessibility,
                  setJustification: setJustificationAccessibility,
                },
                {
                  label: "Qualite UX",
                  score: scoreUx,
                  setScore: setScoreUx,
                  justification: justificationUx,
                  setJustification: setJustificationUx,
                },
                {
                  label: "Support & Accompagnement",
                  score: scoreSupport,
                  setScore: setScoreSupport,
                  justification: justificationSupport,
                  setJustification: setJustificationSupport,
                },
              ].map(
                ({ label, score, setScore, justification, setJustification }) => (
                  <div key={label} className="border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3 mb-1">
                      <label className="text-sm font-semibold text-text-primary flex-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        disabled={!canReview}
                        className="w-16 px-2 py-1 border-2 border-gray-200 rounded text-center text-sm focus:border-primary focus:outline-none disabled:bg-gray-50"
                        placeholder="0-20"
                      />
                    </div>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      disabled={!canReview}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded text-xs focus:border-primary focus:outline-none disabled:bg-gray-50"
                      placeholder="Justification..."
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-bold text-text-primary mb-2">
              Notes internes
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={!canReview}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none disabled:bg-gray-50"
              placeholder="Notes visibles par l'editeur..."
            />
          </div>

          {canReview && (
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Approuver et publier
              </button>
              <button
                onClick={() => {
                  setModalNotes("");
                  setShowChangesModal(true);
                }}
                disabled={loading}
                className="flex-1 bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Demander des modifications
              </button>
              <button
                onClick={() => {
                  setModalNotes("");
                  setShowRejectModal(true);
                }}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Rejeter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Rejeter la soumission
            </h3>
            <textarea
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none mb-4"
              placeholder="Raison du rejet (visible par l'editeur)..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg font-semibold hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Demander des modifications
            </h3>
            <textarea
              value={modalNotes}
              onChange={(e) => setModalNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:outline-none mb-4"
              placeholder="Decrivez les modifications demandees..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowChangesModal(false)}
                className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg font-semibold hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleRequestChanges}
                disabled={loading}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Envoyer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
