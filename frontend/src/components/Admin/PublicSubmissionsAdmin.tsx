import React, { useState, useEffect, useRef } from "react";
import {
  listPublicSubmissions,
  approvePublicSubmission,
  rejectPublicSubmission,
  markSubmissionUnderReview,
  updateCollectifStatus,
  listHealthProApplications,
  acceptHealthProApplication,
  refuseHealthProApplication,
  setHealthProCollectiveMember,
} from "../../api/public";
import type { PublicSubmission, HealthProfApplication } from "../../types";

const COLLECTIF_BADGES: Record<string, { label: string; cls: string }> = {
  none: { label: "Non demandé", cls: "bg-gray-100 text-gray-500" },
  pending: { label: "En attente", cls: "bg-blue-100 text-blue-600" },
  discussing: { label: "Discussion", cls: "bg-orange-100 text-orange-700" },
  accepted: { label: "Accepté", cls: "bg-green-100 text-green-700" },
  refused: { label: "Refusé", cls: "bg-red-100 text-red-700" },
};

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  pending_email: { label: "Email non confirmé", cls: "bg-gray-100 text-gray-600" },
  submitted: { label: "Soumis", cls: "bg-blue-100 text-blue-700" },
  under_review: { label: "En review", cls: "bg-orange-100 text-orange-700" },
  approved: { label: "Approuvé", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejeté", cls: "bg-red-100 text-red-700" },
  changes_requested: { label: "Modifs demandées", cls: "bg-yellow-100 text-yellow-700" },
};

type Tab = "submissions" | "health-pro";

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

interface Props {
  onCreateProduct?: (sub: PublicSubmission) => void;
}

export const PublicSubmissionsAdmin: React.FC<Props> = ({ onCreateProduct }) => {
  const [activeTab, setActiveTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [healthProApps, setHealthProApps] = useState<HealthProfApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<HealthProfApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [helloassoUrl, setHelloassoUrl] = useState("");
  // Inline actions for submissions
  const [rejectingSubId, setRejectingSubId] = useState<string | null>(null);
  const [collectifSubId, setCollectifSubId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeTab === "submissions") loadSubmissions();
    else loadHealthPro();
  }, [activeTab]);

  const loadSubmissions = async () => {
    setLoading(true);
    try { setSubmissions(await listPublicSubmissions()); }
    finally { setLoading(false); }
  };

  const loadHealthPro = async () => {
    setLoading(true);
    try { setHealthProApps(await listHealthProApplications()); }
    finally { setLoading(false); }
  };

  const refreshSub = (updated: PublicSubmission) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const refreshApp = (updated: HealthProfApplication) => {
    setHealthProApps(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedApp(updated);
  };

  const withLoading = async (fn: () => Promise<void>) => {
    setActionLoading(true);
    try { await fn(); } finally { setActionLoading(false); }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (sub.name || "").toLowerCase().includes(q) ||
      (sub.contactName || "").toLowerCase().includes(q) ||
      (sub.contactEmail || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([
          { key: "submissions", label: `Soumissions (${submissions.length})` },
          { key: "health-pro", label: `Pros de santé (${healthProApps.length})` },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSelectedApp(null); setRejectingSubId(null); setCollectifSubId(null); }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-text-secondary py-4">Chargement...</p>}

      {/* ── SUBMISSIONS TAB ──────────────────────────────────────── */}
      {!loading && activeTab === "submissions" && (
        <div className="space-y-2">
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, contact, email..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
          {filteredSubmissions.length === 0 && (
            <p className="text-sm text-text-secondary py-8 text-center">
              {submissions.length === 0 ? "Aucune soumission publique." : "Aucun résultat pour cette recherche."}
            </p>
          )}
          {filteredSubmissions.map(sub => {
            const st = STATUS_BADGES[sub.status] ?? { label: sub.status, cls: "bg-gray-100 text-gray-600" };
            const isRejecting = rejectingSubId === sub.id;
            const isCollectif = collectifSubId === sub.id;
            const canReject = ["submitted", "under_review"].includes(sub.status);
            return (
              <div key={sub.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                {/* Main clickable area → opens SubmissionForm */}
                <div
                  className={`p-4 transition-colors ${onCreateProduct ? "hover:bg-gray-50 cursor-pointer" : ""}`}
                  onClick={() => onCreateProduct?.(sub)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">{sub.name || "(sans titre)"}</p>
                      <p className="text-sm text-text-secondary">{sub.contactName} · {sub.contactEmail}</p>
                      <p className="text-xs text-text-secondary mt-1">{new Date(sub.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge {...st} />
                      {sub.collectifRequested && (
                        <Badge
                          label={`Collectif${sub.collectifCaRange ? ` · ${sub.collectifCaRange}` : ""}: ${COLLECTIF_BADGES[sub.collectifStatus]?.label ?? sub.collectifStatus}`}
                          cls="bg-amber-100 text-amber-700"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline action bar */}
                {(canReject || sub.collectifRequested) && (
                  <div className="px-4 pb-2 flex gap-3 border-t border-gray-100 pt-2">
                    {canReject && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); withLoading(async () => { refreshSub(await approvePublicSubmission(sub.id, {})); showToast("Soumission approuvée"); }); }}
                          disabled={actionLoading}
                          className="text-xs text-green-700 hover:text-green-800 font-semibold disabled:opacity-50"
                        >
                          Approuver
                        </button>
                        {sub.status === "submitted" && (
                          <button
                            onClick={e => { e.stopPropagation(); withLoading(async () => { refreshSub(await markSubmissionUnderReview(sub.id)); showToast("Mise en review"); }); }}
                            disabled={actionLoading}
                            className="text-xs text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50"
                          >
                            En review
                          </button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); setRejectingSubId(isRejecting ? null : sub.id); setAdminNotes(""); setCollectifSubId(null); }}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          {isRejecting ? "Annuler" : "Rejeter"}
                        </button>
                      </>
                    )}
                    {sub.collectifRequested && !["accepted", "refused"].includes(sub.collectifStatus) && (
                      <button
                        onClick={e => { e.stopPropagation(); setCollectifSubId(isCollectif ? null : sub.id); setHelloassoUrl(""); setRejectingSubId(null); }}
                        className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                      >
                        {isCollectif ? "Fermer" : "Gérer Collectif ▾"}
                      </button>
                    )}
                  </div>
                )}

                {/* Inline reject form */}
                {isRejecting && (
                  <div className="px-4 pb-4 pt-2 space-y-2 border-t border-red-100 bg-red-50">
                    <textarea
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Raison du refus (optionnel)..."
                      rows={2}
                      className="w-full border border-red-200 bg-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none"
                    />
                    <button
                      onClick={() => withLoading(async () => {
                        refreshSub(await rejectPublicSubmission(sub.id, adminNotes));
                        setRejectingSubId(null);
                        showToast("Soumission rejetée", "error");
                      })}
                      disabled={actionLoading}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
                    >
                      Confirmer le refus
                    </button>
                  </div>
                )}

                {/* Inline collectif management */}
                {isCollectif && (
                  <div className="px-4 pb-4 pt-3 space-y-3 border-t border-amber-200 bg-amber-50">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-amber-900">Collectif MentalTech</p>
                      {sub.collectifContactEmail && (
                        <span className="text-xs text-amber-700">· {sub.collectifContactEmail}</span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={helloassoUrl}
                      onChange={e => setHelloassoUrl(e.target.value)}
                      placeholder="Lien HelloAsso (pour accepter)"
                      className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => withLoading(async () => { refreshSub(await updateCollectifStatus(sub.id, "discussing", undefined, undefined)); showToast("Statut: En discussion"); })}
                        disabled={actionLoading}
                        className="px-3 py-1.5 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 font-semibold"
                      >
                        En discussion
                      </button>
                      <button
                        onClick={() => withLoading(async () => { refreshSub(await updateCollectifStatus(sub.id, "accepted", undefined, helloassoUrl || undefined)); setCollectifSubId(null); showToast("Collectif accepté"); })}
                        disabled={actionLoading}
                        className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 font-semibold"
                      >
                        Accepter + lien
                      </button>
                      <button
                        onClick={() => withLoading(async () => { refreshSub(await updateCollectifStatus(sub.id, "refused", undefined, undefined)); setCollectifSubId(null); showToast("Collectif refusé", "error"); })}
                        disabled={actionLoading}
                        className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 font-semibold"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── HEALTH PRO TAB - LIST ───────────────────────────────── */}
      {!loading && activeTab === "health-pro" && !selectedApp && (
        <div className="space-y-2">
          {healthProApps.length === 0 && (
            <p className="text-sm text-text-secondary py-8 text-center">Aucune candidature.</p>
          )}
          {healthProApps.map(app => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-primary/50 cursor-pointer transition-colors bg-white"
              onClick={() => { setSelectedApp(app); setAdminNotes(app.adminNotes || ""); setHelloassoUrl(""); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary">{app.name}</p>
                  <p className="text-sm text-text-secondary">{app.profession} · {app.email}</p>
                  {app.organization && <p className="text-xs text-text-secondary">{app.organization}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge
                    label={
                      app.status === "pending_email" ? "Email non confirmé" :
                      app.status === "submitted" ? "Soumis" :
                      app.status === "accepted" ? "Accepté" :
                      app.status === "refused" ? "Refusé" : app.status
                    }
                    cls={
                      app.status === "accepted" ? "bg-green-100 text-green-700" :
                      app.status === "refused" ? "bg-red-100 text-red-700" :
                      app.status === "submitted" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }
                  />
                  {app.isCollectiveMember && <Badge label="Membre" cls="bg-amber-100 text-amber-700" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HEALTH PRO TAB - DETAIL ─────────────────────────────── */}
      {activeTab === "health-pro" && selectedApp && (
        <div className="space-y-5">
          <button
            onClick={() => setSelectedApp(null)}
            className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1"
          >
            ← Retour à la liste
          </button>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg text-text-primary">{selectedApp.name}</h3>
              <Badge
                label={selectedApp.status === "accepted" ? "Accepté" : selectedApp.status === "refused" ? "Refusé" : "Soumis"}
                cls={selectedApp.status === "accepted" ? "bg-green-100 text-green-700" : selectedApp.status === "refused" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-text-secondary text-xs">Email</p>
                <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline">{selectedApp.email}</a>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Profession</p>
                <p className="font-medium text-text-primary">{selectedApp.profession}</p>
              </div>
              {selectedApp.rppsAdeli && (
                <div>
                  <p className="text-text-secondary text-xs">RPPS / ADELI</p>
                  <p className="font-mono font-medium text-text-primary">{selectedApp.rppsAdeli}</p>
                </div>
              )}
              {selectedApp.organization && (
                <div>
                  <p className="text-text-secondary text-xs">Établissement</p>
                  <p className="font-medium text-text-primary">{selectedApp.organization}</p>
                </div>
              )}
            </div>

            {selectedApp.motivation && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-text-secondary mb-1">Motivation</p>
                <p className="text-sm text-text-primary">{selectedApp.motivation}</p>
              </div>
            )}
          </div>

          {selectedApp.status === "submitted" && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">Lien HelloAsso</label>
                <input
                  type="url"
                  value={helloassoUrl}
                  onChange={e => setHelloassoUrl(e.target.value)}
                  placeholder="https://helloasso.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-text-primary">Notes admin</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Notes internes..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => withLoading(async () => { refreshApp(await acceptHealthProApplication(selectedApp.id, helloassoUrl || undefined, adminNotes || undefined)); showToast("Candidature acceptée"); })}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  Accepter
                </button>
                <button
                  onClick={() => withLoading(async () => { refreshApp(await refuseHealthProApplication(selectedApp.id, adminNotes || undefined)); showToast("Candidature refusée", "error"); })}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  Refuser
                </button>
              </div>
            </>
          )}

          {selectedApp.status === "accepted" && (
            <label className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-xl p-3 bg-white">
              <input
                type="checkbox"
                checked={selectedApp.isCollectiveMember}
                onChange={() => withLoading(async () => { refreshApp(await setHealthProCollectiveMember(selectedApp.id, !selectedApp.isCollectiveMember)); showToast(!selectedApp.isCollectiveMember ? "Membre confirmé" : "Membre retiré"); })}
                className="accent-primary"
                disabled={actionLoading}
              />
              <span className="text-sm font-medium text-text-primary">Membre confirmé (paiement reçu)</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
};
