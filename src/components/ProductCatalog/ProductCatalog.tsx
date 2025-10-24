import React, { useState, useMemo } from "react";
import { getAllProducts } from "../../data/products-extended";
import { ProductCatalogCard } from "./ProductCatalogCard";
import { FilterSection } from "./FilterSection";

export interface Filters {
  search: string;
  type: string[];
  audience: string[];
  problemsSolved: string[];
  pricingModel: string[];
  forCompany: string;
  companyStatus: string[];
}

export const ProductCatalog: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: [],
    audience: [],
    problemsSolved: [],
    pricingModel: [],
    forCompany: "all",
    companyStatus: ["active", "liquidation", "closed"],
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allProducts = getAllProducts();

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const audiences = new Set<string>();
    const problems = new Set<string>();
    const pricingModels = new Set<string>();

    allProducts.forEach((product) => {
      types.add(product.type);
      product.audience.forEach((aud) => audiences.add(aud));
      product.problemsSolved.forEach((prob) => problems.add(prob));
      if (product.pricing?.model) {
        pricingModels.add(product.pricing.model);
      }
    });

    return {
      types: Array.from(types).sort(),
      audiences: Array.from(audiences).sort(),
      problems: Array.from(problems).sort(),
      pricingModels: Array.from(pricingModels).sort(),
    };
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tagline.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false;
      }

      // Audience filter
      if (filters.audience.length > 0) {
        const hasMatchingAudience = filters.audience.some((aud) =>
          product.audience.includes(aud)
        );
        if (!hasMatchingAudience) return false;
      }

      // Problems solved filter
      if (filters.problemsSolved.length > 0) {
        const hasMatchingProblem = filters.problemsSolved.some((prob) =>
          product.problemsSolved.includes(prob)
        );
        if (!hasMatchingProblem) return false;
      }

      // Pricing model filter
      if (filters.pricingModel.length > 0) {
        if (
          !product.pricing?.model ||
          !filters.pricingModel.includes(product.pricing.model)
        ) {
          return false;
        }
      }

      // For company filter
      if (filters.forCompany === "company" && !product.forCompany) {
        return false;
      }
      if (filters.forCompany === "individual" && product.forCompany) {
        return false;
      }

      // Company status filter
      if (filters.companyStatus.length > 0) {
        const status = product.companyStatus || "active";
        if (!filters.companyStatus.includes(status)) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, filters]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: [],
      audience: [],
      problemsSolved: [],
      pricingModel: [],
      forCompany: "all",
      companyStatus: ["active", "liquidation", "closed"],
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    count += filters.type.length;
    count += filters.audience.length;
    count += filters.problemsSolved.length;
    count += filters.pricingModel.length;
    if (filters.forCompany !== "all") count++;
    // Compter comme filtre actif seulement si ce n'est pas "tous"
    if (filters.companyStatus.length !== 3) count++;
    return count;
  }, [filters]);

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Catalogue des solutions
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Explorez l'écosystème complet des{" "}
            <strong>solutions digitales en santé mentale</strong> avec des filtres avancés pour trouver ce qui vous correspond.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border-2 border-primary border-opacity-20">
            <span className="font-bold text-primary text-lg">
              {filteredProducts.length}
            </span>
            <span className="text-text-secondary ml-2">
              produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border-2 border-secondary border-opacity-20">
            <span className="font-bold text-secondary text-lg">
              {allProducts.length}
            </span>
            <span className="text-text-secondary ml-2">total</span>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors font-semibold"
            >
              Réinitialiser les filtres ({activeFiltersCount})
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterSection
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* View mode toggle */}
            <div className="flex justify-end mb-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-1 flex gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-gray-100"
                  } transition-colors`}
                  aria-label="Vue en grille"
                >
                  <span className="text-xl">⊞</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-gray-100"
                  } transition-colors`}
                  aria-label="Vue en liste"
                >
                  <span className="text-xl">☰</span>
                </button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-text-secondary mb-6">
                  Essayez de modifier vos filtres pour voir plus de résultats
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCatalogCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
