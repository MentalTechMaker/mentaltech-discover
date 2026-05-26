import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navigateRef } from "./navigateRef";

export function NavigateBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    navigateRef.current = navigate;
    return () => {
      navigateRef.current = null;
    };
  }, [navigate]);
  return null;
}
