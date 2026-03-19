import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { SubmissionForm } from "../Publisher/SubmissionForm";

export const PublicSubmissionForm: React.FC = () => {
  const { setView } = useAppStore();
  return <SubmissionForm publicMode onClose={() => setView("join-collective")} />;
};
