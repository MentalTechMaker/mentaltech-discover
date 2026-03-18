import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { listMySubmissions } from "../../api/publisher";
import type { ProductSubmission, SubmissionStatus } from "../../types";

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  draft: { label: "Brouillon", bg: "bg-gray-100", text: "text-gray-700" },
  submitted: { label: "Soumis", bg: "bg-blue-100", text: "text-blue-700" },
  under_review: { label: "En cours de review", bg: "bg-orange-100", text: "text-orange-700" },
  approved: { label: "Approuve", bg: "bg-green-100", text: "text-green-700" },
  rejected: { label: "Rejete", bg: "bg-red-100", text: "text-red-700" },
  changes_requested: { label: "Modifications demandees", bg: "bg-yellow-100", text: "text-yellow-700" },
};

export const PublisherDashboard: React.FC = () => {
  const { setView } = useAppStore();
  const { isAuthenticated, user, isPublisher } = useAuthStore();

  const [submissions, setSubmissions] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMySubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== "publisher") {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-text-primary mb-2">Acces reserve</h2>
          <p className="text-text-secondary mb-4">
            Cette page est reservee aux editeurs de solutions.
          </p>
          <button
            onClick={() => setView("register-publisher")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Devenir editeur
          </button>
        </div>
      </div>
    );
  }

  if (!isPublisher) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-semibold mb-4">
            Compte en attente de verification
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Verification en cours
          </h2>
          <p className="text-text-secondary">
            Votre compte editeur est en cours de verification par notre equipe.
            Vous serez notifie par email une fois votre compte active (sous 48h).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Espace Editeur
            </h1>
            <p className="text-text-secondary mt-1">
              {user?.company_name ? `${user.company_name} - ` : ""}
              Gerez vos soumissions de solutions
            </p>
          </div>
          <button
            onClick={() => {
              // Clear any previous submission ID state, then navigate
              useAppStore.setState({ selectedProductId: null });
              setView("publisher-submission");
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            + Nouvelle soumission
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-text-secondary">Chargement...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-text-secondary text-lg mb-4">
              Vous n'avez encore aucune soumission.
            </p>
            <p className="text-text-secondary text-sm mb-6">
              Soumettez votre premiere solution pour qu'elle soit evaluee et
              referencee sur MentalTech Discover.
            </p>
            <button
              onClick={() => setView("publisher-submission")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Soumettre ma solution
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                    Solution
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                    Statut
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                    Derniere modification
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => {
                  const statusConf = STATUS_CONFIG[sub.status];
                  const canEdit = sub.status === "draft" || sub.status === "changes_requested";
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-text-primary">
                          {sub.name || "Sans titre"}
                        </p>
                        {sub.type && (
                          <p className="text-xs text-text-secondary">{sub.type}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${statusConf.bg} ${statusConf.text} px-2 py-1 rounded text-xs font-semibold`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(sub.updatedAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            useAppStore.setState({ selectedProductId: sub.id });
                            setView("publisher-submission");
                          }}
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            canEdit
                              ? "bg-primary text-white hover:opacity-90"
                              : "bg-gray-100 text-text-primary hover:bg-gray-200"
                          }`}
                        >
                          {canEdit ? "Modifier" : "Voir"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Show admin notes banner for rejected or changes_requested */}
            {submissions
              .filter(
                (s) =>
                  (s.status === "changes_requested" || s.status === "rejected") &&
                  s.adminNotes
              )
              .map((s) => (
                <div
                  key={`notes-${s.id}`}
                  className={`mx-6 mb-4 p-3 rounded-lg text-sm ${
                    s.status === "rejected"
                      ? "bg-red-50 border border-red-200 text-red-700"
                      : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                  }`}
                >
                  <span className="font-semibold">
                    {s.name || "Sans titre"} - Notes de l'administrateur :
                  </span>{" "}
                  {s.adminNotes}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
