import React, { useEffect, useState } from "react";
import {
  viewPrescription,
  confirmPrescriptionView,
  type PrescriptionPublicResponse,
} from "../../api/prescriber";
import { useAppStore } from "../../store/useAppStore";
import { sanitizeUrl } from "../../utils/security";
import { getLabelInfo } from "../../utils/scoring";
import { SITE_URL } from "../../utils/meta";

import { pricingLabels } from "../../data/labels";

export const PrescriptionViewPage: React.FC = () => {
  const token = useAppStore((s) => s.selectedProductId);
  const [data, setData] = useState<PrescriptionPublicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Lien de prescription invalide.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const isPreview =
      new URLSearchParams(window.location.search).get("preview") === "true";

    viewPrescription(token)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Prescription introuvable ou lien invalide.");
          setLoading(false);
        }
      });

    // Confirm view after 5s delay to filter out bots
    let confirmTimer: ReturnType<typeof setTimeout> | undefined;
    if (!isPreview) {
      confirmTimer = setTimeout(() => {
        if (!cancelled) {
          confirmPrescriptionView(token).catch(() => {});
        }
      }, 5000);
    }

    return () => {
      cancelled = true;
      if (confirmTimer) clearTimeout(confirmTimer);
    };
  }, [token]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary text-lg">
            Chargement de la prescription...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#128683;</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Prescription introuvable
          </h2>
          <p className="text-text-secondary">
            {error || "Ce lien de prescription est invalide ou a expire."}
          </p>
        </div>
      </div>
    );
  }

  // ── Loaded ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ── Header Banner ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Prescription MentalTech Discover
          </h1>
          <p className="text-text-secondary text-lg">
            Recommandation de{" "}
            <span className="font-semibold text-text-primary">
              {data.prescriberName}
            </span>
          </p>
          {data.prescriberProfession && (
            <p className="text-text-secondary text-sm mt-1">
              {data.prescriberProfession}
            </p>
          )}
          {data.prescriberOrganization && (
            <p className="text-text-secondary text-sm">
              {data.prescriberOrganization}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* ── Expired Warning ─────────────────────────────────── */}
        {data.expired && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
            <p className="text-amber-800 font-semibold">
              Cette prescription a expire
            </p>
          </div>
        )}

        {/* ── Prescriber Message ──────────────────────────────── */}
        {data.message && (
          <blockquote className="border-l-4 border-blue-400 bg-blue-50 rounded-r-xl px-6 py-4 text-text-secondary italic">
            {data.message}
          </blockquote>
        )}

        {/* ── Product Cards ───────────────────────────────────── */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">
            Ressources recommandées
          </h2>

          {data.products.map((product) => {
            const label = getLabelInfo(product.scoreLabel);
            const safeUrl = sanitizeUrl(product.url);
            const pricingModel = product.pricing?.model;
            const pricingLabel = pricingModel
              ? (pricingLabels[pricingModel] ?? pricingModel)
              : null;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col sm:flex-row gap-5"
              >
                {/* Logo */}
                {product.logo && (
                  <div className="flex-shrink-0">
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-contain bg-gray-50 border border-gray-100"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-text-primary">
                      {product.name}
                    </h3>
                    <span className="text-xs font-medium text-text-secondary bg-gray-100 rounded-full px-2.5 py-0.5">
                      {product.type}
                    </span>
                  </div>

                  <p className="text-text-secondary text-sm mb-3">
                    {product.tagline}
                  </p>

                  {/* Score badge */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1"
                      style={{
                        backgroundColor: label.bgColor,
                        color: label.color,
                      }}
                    >
                      {label.grade} - {label.text}
                    </span>

                    {/* Pricing */}
                    {pricingLabel && (
                      <span className="text-xs font-medium text-text-secondary bg-gray-100 rounded-full px-2.5 py-0.5">
                        {pricingLabel}
                        {product.pricing?.amount
                          ? ` - ${product.pricing.amount}`
                          : ""}
                      </span>
                    )}
                  </div>

                  {product.pricing?.details && (
                    <p className="text-xs text-text-secondary mb-3">
                      {product.pricing.details}
                    </p>
                  )}

                  {/* CTA */}
                  <div className="flex flex-wrap gap-2">
                    {safeUrl && (
                      <a
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Decouvrir
                      </a>
                    )}
                    <a
                      href={`/product/${product.id}`}
                      className="inline-block bg-gray-100 text-text-primary text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Voir la fiche
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Footer Disclaimer ───────────────────────────────── */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-red-800 font-medium">
            Cette recommandation est fournie à titre informatif. En cas
            d'urgence, contactez le <span className="font-bold">3114</span>{" "}
            (numéro national de prévention du suicide) ou le{" "}
            <span className="font-bold">15</span> (SAMU).
          </p>
        </div>

        {/* ── Quiz CTA ────────────────────────────────────────── */}
        {!data.expired && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Vous cherchez d'autres solutions adaptées à votre situation ?
            </p>
            <p className="text-xs text-blue-600 mb-4">
              MentalTech Discover vous aide à trouver les outils digitaux les
              mieux notés selon vos besoins.
            </p>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Faire le questionnaire personnalisé →
            </a>
          </div>
        )}

        {/* ── RGPD Notice ────────────────────────────────────── */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs text-text-secondary">
            Aucune donnée personnelle n'est stockée sur nos serveurs. Cette
            prescription est accessible uniquement via ce lien et expire
            automatiquement.
          </p>
          {!data.expired && (
            <button
              onClick={async () => {
                if (
                  confirm(
                    "Supprimer cette prescription ? Cette action est irréversible.",
                  )
                ) {
                  try {
                    const { revokePrescription } =
                      await import("../../api/prescriber");
                    await revokePrescription(token || "");
                    setError("Prescription supprimée.");
                    setData(null);
                  } catch {
                    setError("Impossible de supprimer la prescription.");
                  }
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Demander la suppression de cette prescription (RGPD)
            </button>
          )}
        </div>

        {/* ── Medical Disclaimer ──────────────────────────────── */}
        <p className="text-xs text-text-secondary text-center pb-8">
          MentalTech est une plateforme d'information et d'orientation. Elle ne
          remplace en aucun cas une consultation avec un professionnel de santé
          mentale qualifié.
        </p>
      </main>
    </div>
  );
};
