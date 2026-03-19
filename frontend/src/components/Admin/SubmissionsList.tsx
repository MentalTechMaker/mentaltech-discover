import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { PublicSubmissionsAdmin } from "./PublicSubmissionsAdmin";
import {
  listSubmissions,
  getAdminSubmission,
  listPublishers,
  verifyPublisher,
  rejectPublisher,
} from "../../api/publisher";
import type { PublisherListItem } from "../../api/publisher";
import type { ProductSubmission, SubmissionStatus } from "../../types";
import { SubmissionReview } from "./SubmissionReview";

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  draft: { label: "Brouillon", bg: "bg-gray-100", text: "text-gray-700" },
  submitted: { label: "Soumis", bg: "bg-blue-100", text: "text-blue-700" },
  under_review: { label: "En review", bg: "bg-orange-100", text: "text-orange-700" },
  approved: { label: "Approuve", bg: "bg-green-100", text: "text-green-700" },
  rejected: { label: "Rejete", bg: "bg-red-100", text: "text-red-700" },
  changes_requested: { label: "Modifs demandees", bg: "bg-yellow-100", text: "text-yellow-700" },
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "submitted", label: "Soumis" },
  { value: "under_review", label: "En review" },
  { value: "approved", label: "Approuves" },
  { value: "rejected", label: "Rejetes" },
  { value: "changes_requested", label: "Modifs demandees" },
];

type Tab = "submissions" | "publishers" | "public";

export const SubmissionsList: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const { setView } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>("submissions");
  const [statusFilter, setStatusFilter] = useState("");
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProductSubmission | null>(null);

  // Publishers tab
  const [publishers, setPublishers] = useState<PublisherListItem[]>([]);
  const [publishersLoading, setPublishersLoading] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setView("landing");
    }
  }, [isAdmin, setView]);

  useEffect(() => {
    if (activeTab === "submissions") {
      loadSubmissions();
    } else {
      loadPublishers();
    }
  }, [activeTab, statusFilter, pendingOnly]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await listSubmissions(statusFilter || undefined);
      setSubmissions(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const loadPublishers = async () => {
    setPublishersLoading(true);
    try {
      const data = await listPublishers(pendingOnly);
      setPublishers(data);
    } catch {
      // silently fail
    } finally {
      setPublishersLoading(false);
    }
  };

  const handleReviewClick = async (id: string) => {
    try {
      const data = await getAdminSubmission(id);
      setSelectedSubmission(data);
    } catch {
      // silently fail
    }
  };

  const handleVerify = async (id: string) => {
    setActionId(id);
    try {
      await verifyPublisher(id);
      await loadPublishers();
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionId(id);
    try {
      await rejectPublisher(id);
      await loadPublishers();
    } finally {
      setActionId(null);
    }
  };

  if (!isAdmin) return null;

  if (selectedSubmission) {
    return (
      <div className="min-h-[calc(100vh-280px)] px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <SubmissionReview
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onActionComplete={() => {
              setSelectedSubmission(null);
              loadSubmissions();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          Gestion des editeurs
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b-2 border-gray-200">
          {(
            [
              { key: "submissions", label: "Soumissions (compte)" },
              { key: "publishers", label: "Editeurs" },
              { key: "public", label: "Soumissions publiques & Collectif" },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 font-semibold text-sm rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === key
                  ? "bg-white text-primary border-gray-200"
                  : "bg-gray-50 text-text-secondary border-transparent hover:bg-white hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Submissions tab */}
        {activeTab === "submissions" && (
          <>
            <div className="flex gap-2 mb-6">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    statusFilter === value
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-text-secondary">
                Chargement...
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
                        Date
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub) => {
                      const statusConf = STATUS_CONFIG[sub.status];
                      return (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-text-primary">
                              {sub.name || "Sans titre"}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {sub.type || ""}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`${statusConf.bg} ${statusConf.text} px-2 py-1 rounded text-xs font-semibold`}
                            >
                              {statusConf.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {new Date(sub.createdAt).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleReviewClick(sub.id)}
                              className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90"
                            >
                              Reviewer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {submissions.length === 0 && (
                  <div className="p-12 text-center text-text-secondary">
                    Aucune soumission trouvee
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Publishers tab */}
        {activeTab === "publishers" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm font-semibold text-text-secondary">
                  Afficher uniquement "En attente"
                </span>
              </label>
              <button
                onClick={loadPublishers}
                disabled={publishersLoading}
                className="bg-gray-100 text-text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-50"
              >
                Rafraichir
              </button>
            </div>

            {publishersLoading ? (
              <div className="text-center py-12 text-text-secondary">
                Chargement...
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Nom / Email
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Entreprise
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        SIRET
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-text-secondary">
                        Statut
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {publishers.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-text-primary">
                            {p.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {p.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {p.company_name || "--"}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                          {p.siret || "--"}
                        </td>
                        <td className="px-6 py-4">
                          {p.is_verified_publisher ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              Verifie
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {!p.is_verified_publisher && (
                            <button
                              onClick={() => handleVerify(p.id)}
                              disabled={actionId === p.id}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                              Valider
                            </button>
                          )}
                          {p.is_verified_publisher && (
                            <button
                              onClick={() => handleReject(p.id)}
                              disabled={actionId === p.id}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200 disabled:opacity-50"
                            >
                              Revoquer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {publishers.length === 0 && (
                  <div className="p-12 text-center text-text-secondary">
                    {pendingOnly
                      ? "Aucun editeur en attente"
                      : "Aucun editeur trouve"}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Public submissions & collectif tab */}
        {activeTab === "public" && <PublicSubmissionsAdmin />}
      </div>
    </div>
  );
};
