import { useEffect, useCallback, useState } from "react";
import type { Filters } from "../components/ProductCatalog/ProductCatalog";

/**
 * Hook personnalisé pour synchroniser les filtres avec l'URL
 * Permet le partage d'URLs et la navigation back/forward
 */
export const useUrlFilters = (
  filters: Filters,
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger les filtres depuis l'URL au montage
  useEffect(() => {
    if (isInitialized) return;

    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type")?.split(",").filter(Boolean) || [];
    const audience = searchParams.get("audience")?.split(",").filter(Boolean) || [];
    const problemsSolved = searchParams.get("problems")?.split(",").filter(Boolean) || [];
    const pricingModel = searchParams.get("pricing")?.split(",").filter(Boolean) || [];
    const forCompany = (searchParams.get("for") as "all" | "individual" | "company") || "all";
    const companyStatus = searchParams.get("status")?.split(",").filter(Boolean) || ["active", "liquidation", "closed"];

    // Ne mettre à jour que si des paramètres URL existent
    if (searchParams.toString()) {
      setFilters({
        search,
        type,
        audience,
        problemsSolved,
        pricingModel,
        forCompany,
        companyStatus,
      });
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]); // Seulement au montage

  // Synchroniser les filtres vers l'URL à chaque changement
  const syncFiltersToUrl = useCallback(() => {
    if (!isInitialized) return; // Ne pas sync avant l'initialisation

    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.type.length > 0) params.set("type", filters.type.join(","));
    if (filters.audience.length > 0) params.set("audience", filters.audience.join(","));
    if (filters.problemsSolved.length > 0) params.set("problems", filters.problemsSolved.join(","));
    if (filters.pricingModel.length > 0) params.set("pricing", filters.pricingModel.join(","));
    if (filters.forCompany !== "all") params.set("for", filters.forCompany);

    // Ne pas ajouter status si tous sont sélectionnés (défaut)
    if (filters.companyStatus.length !== 3) {
      params.set("status", filters.companyStatus.join(","));
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, "", newUrl);
  }, [filters, isInitialized]);

  // Appeler la synchronisation quand les filtres changent
  useEffect(() => {
    syncFiltersToUrl();
  }, [syncFiltersToUrl]);

  return { syncFiltersToUrl };
};
