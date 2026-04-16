import React from "react";
import { StepHowItWorks } from "./steps/StepHowItWorks";
import { StepBasicInfo } from "./steps/StepBasicInfo";
import { StepSummary } from "./steps/StepSummary";
import { STEP_NAMES_ADMIN, STEP_NAMES_PUBLIC } from "./constants";
import { useSubmissionForm } from "./useSubmissionForm";

interface Props {
  onClose: () => void;
  adminMode?: boolean;
  editProduct?: import("../../types").Product;
  publicMode?: boolean;
  submissionId?: string;
}

export const SubmissionForm: React.FC<Props> = ({
  onClose,
  adminMode = false,
  editProduct,
  publicMode = false,
  submissionId,
}) => {
  const STEP_NAMES = publicMode ? STEP_NAMES_PUBLIC : STEP_NAMES_ADMIN;
  const TOTAL_STEPS = STEP_NAMES.length;
  const FORM_OFFSET = publicMode ? 1 : 0;

  const form = useSubmissionForm({
    onClose,
    adminMode,
    editProduct,
    publicMode,
    submissionId,
  });

  if (form.publicSubmitted) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Vérifiez votre boîte mail
          </h2>
          <p className="text-text-secondary mb-6">
            Un email de confirmation a été envoyé à{" "}
            <strong>{form.contactEmail}</strong>. Cliquez sur le lien pour
            finaliser votre soumission.
          </p>
          <p className="text-sm text-text-secondary">
            Le lien est valable 48 heures. Vérifiez aussi vos spams.
          </p>
          <button
            onClick={onClose}
            className="mt-6 text-primary hover:underline text-sm"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      {publicMode && (
        <input
          type="text"
          name="website_url"
          value={form.honeypot}
          onChange={(e) => form.setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {adminMode
                ? "Nouveau produit (protocole)"
                : "Référencer votre solution"}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            Retour
          </button>
        </div>

        {/* Draft resume prompt */}
        {form.showDraftPrompt && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Brouillon trouvé
              </p>
              <p className="text-xs text-blue-700">
                Vous avez un brouillon sauvegardé. Souhaitez-vous le reprendre ?
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={form.handleResumeDraft}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reprendre
              </button>
              <button
                onClick={form.handleDiscardDraft}
                className="px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                Non merci
              </button>
            </div>
          </div>
        )}

        {form.error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {form.error}
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Étape {form.step} sur {TOTAL_STEPS}
            </span>
            <span>{STEP_NAMES[form.step - 1]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(form.step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Auto-save notification */}
        {form.draftSavedNotice && (
          <div className="mb-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 animate-pulse">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Brouillon sauvegardé
          </div>
        )}

        {/* Step navigation tabs */}
        <div className="flex gap-1 mb-8">
          {STEP_NAMES.map((label, i) => {
            const n = i + 1;
            const isCompleted = n < form.step;
            return (
              <button
                key={n}
                onClick={() => {
                  if (isCompleted) form.setStep(n);
                }}
                disabled={!isCompleted && n !== form.step}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  form.step === n
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-gray-100 text-text-secondary hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                {n}. {label}
              </button>
            );
          })}
        </div>

        {/* Step: How it works (public mode only) */}
        {publicMode && form.step === 1 && <StepHowItWorks />}

        {/* Step: Basic Info */}
        {form.step === 1 + FORM_OFFSET && (
          <StepBasicInfo
            adminMode={adminMode}
            publicMode={publicMode}
            name={form.name}
            setName={form.setName}
            tagline={form.tagline}
            setTagline={form.setTagline}
            description={form.description}
            setDescription={form.setDescription}
            url={form.url}
            setUrl={form.setUrl}
            linkedin={form.linkedin}
            setLinkedin={form.setLinkedin}
            audiencePriorities={form.audiencePriorities}
            setAudiencePriorities={form.setAudiencePriorities}
            problemsPriorities={form.problemsPriorities}
            setProblemsPriorities={form.setProblemsPriorities}
            pricingModel={form.pricingModel}
            setPricingModel={form.setPricingModel}
            pricingAmount={form.pricingAmount}
            setPricingAmount={form.setPricingAmount}
            pricingDetails={form.pricingDetails}
            setPricingDetails={form.setPricingDetails}
            contactName={form.contactName}
            setContactName={form.setContactName}
            contactEmail={form.contactEmail}
            setContactEmail={form.setContactEmail}
            logoPath={form.logoPath}
            logoUploading={form.logoUploading}
            handleLogoUpload={form.handleLogoUpload}
            handlePublicLogoUpload={form.handlePublicLogoUpload}
            adminProductId={form.adminProductId}
            setAdminProductId={form.setAdminProductId}
            isMentaltechMember={form.isMentaltechMember}
            setIsMentaltechMember={form.setIsMentaltechMember}
            preferenceMatch={form.preferenceMatch}
            togglePreferenceMatch={form.togglePreferenceMatch}
          />
        )}

        {/* Step: Summary */}
        {form.step === 2 + FORM_OFFSET && (
          <StepSummary
            adminMode={adminMode}
            publicMode={publicMode}
            saving={form.saving}
            name={form.name}
            tagline={form.tagline}
            description={form.description}
            url={form.url}
            pricingModel={form.pricingModel}
            pricingAmount={form.pricingAmount}
            audiencePriorities={form.audiencePriorities}
            problemsPriorities={form.problemsPriorities}
            collectifRequested={form.collectifRequested}
            setCollectifRequested={form.setCollectifRequested}
            collectifCaRange={form.collectifCaRange}
            setCollectifCaRange={form.setCollectifCaRange}
            collectifContactEmail={form.collectifContactEmail}
            setCollectifContactEmail={form.setCollectifContactEmail}
            rgpdConsent={form.rgpdConsent}
            setRgpdConsent={form.setRgpdConsent}
            handlePublicSubmit={form.handlePublicSubmit}
            handleAdminCreateAndPublish={form.handleAdminCreateAndPublish}
            error={publicMode ? form.error : undefined}
            submissionId={submissionId}
            editProductId={editProduct?.id}
          />
        )}

        {/* Bottom navigation */}
        <div className="flex justify-between mt-6">
          {form.step > 1 ? (
            <button
              onClick={() => form.setStep(form.step - 1)}
              className="px-6 py-3 bg-gray-100 text-text-primary rounded-lg font-semibold hover:bg-gray-200"
            >
              Précédent
            </button>
          ) : (
            <div />
          )}
          {form.step < TOTAL_STEPS && (
            <div className="flex flex-col items-end gap-1">
              {form.stepError && (
                <p className="text-xs text-red-600 font-medium">
                  {form.stepError}
                </p>
              )}
              <button
                onClick={form.handleNextStep}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
