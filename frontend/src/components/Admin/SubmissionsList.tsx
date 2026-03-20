import React from "react";
import { PublicSubmissionsAdmin } from "./PublicSubmissionsAdmin";
import { useAppStore } from "../../store/useAppStore";
import type { PublicSubmission } from "../../types";

export const SubmissionsList: React.FC = () => {
  const setView = useAppStore((s) => s.setView);

  const handleCreateProduct = (_sub: PublicSubmission) => {
    setView("admin");
  };

  return <PublicSubmissionsAdmin onCreateProduct={handleCreateProduct} />;
};
