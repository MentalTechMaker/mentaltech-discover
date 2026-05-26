import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { SubmissionForm } from "../Publisher/SubmissionForm";
import { PageMeta } from "../../utils/PageMeta";

export const PublicSubmissionForm: React.FC = () => {
  const { setView } = useAppStore();
  return (
    <>
      <PageMeta
        title="Référencer votre solution en santé mentale"
        description="Proposez votre solution de santé mentale numérique sur MentalTech Discover. Analyse gratuite sur 5 piliers de qualité."
        canonical="/soumettre-solution"
      />
      <SubmissionForm publicMode onClose={() => setView("join-collective")} />
    </>
  );
};
