import React, { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import { SubmissionForm } from "../Publisher/SubmissionForm";
import { setCanonical } from "../../utils/meta";

export const PublicSubmissionForm: React.FC = () => {
  const { setView } = useAppStore();
  useEffect(() => { setCanonical("/soumettre-solution"); }, []);
  return <SubmissionForm publicMode onClose={() => setView("join-collective")} />;
};
