import React, { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { SubmissionForm } from "../Publisher/SubmissionForm";
import { setPageMeta, setCanonical } from "../../utils/meta";

export const PublicSubmissionForm: React.FC = () => {
  const { setView } = useAppStore();
  useEffect(() => {
    setPageMeta(
      "Référencer votre solution en santé mentale",
      "Proposez votre solution de santé mentale numérique sur MentalTech Discover. Analyse gratuite sur 5 piliers de qualité.",
    );
    setCanonical("/soumettre-solution");
  }, []);
  return (
    <SubmissionForm publicMode onClose={() => setView("join-collective")} />
  );
};
