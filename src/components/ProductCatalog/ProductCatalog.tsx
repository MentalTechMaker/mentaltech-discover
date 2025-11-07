import React, { useState, useMemo } from "react";
import { getAllProducts } from "../../data/products";
import { ProductCatalogCard } from "./ProductCatalogCard";
import { FilterSection } from "./FilterSection";

export interface Filters {
  search: string;
  type: string[];
  audience: string[];
  problemsSolved: string[];
  pricingModel: string[];
  forCompany: string;
}

export const ProductCatalog: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: [],
    audience: [],
    problemsSolved: [],
    pricingModel: [],
    forCompany: "all",
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "pricing">("name");

  const allProducts = getAllProducts();

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

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tagline.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false;
      }

      if (filters.audience.length > 0) {
        const hasMatchingAudience = filters.audience.some((aud) =>
          product.audience.includes(aud)
        );
        if (!hasMatchingAudience) return false;
      }

      if (filters.problemsSolved.length > 0) {
        const hasMatchingProblem = filters.problemsSolved.some((prob) =>
          product.problemsSolved.includes(prob)
        );
        if (!hasMatchingProblem) return false;
      }

      if (filters.pricingModel.length > 0) {
        if (
          !product.pricing?.model ||
          !filters.pricingModel.includes(product.pricing.model)
        ) {
          return false;
        }
      }

      if (filters.forCompany === "company" && !product.forCompany) {
        return false;
      }
      if (filters.forCompany === "individual" && product.forCompany) {
        return false;
      }

      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      case "pricing": {
        const pricingOrder: Record<string, number> = {
          free: 0,
          freemium: 1,
          subscription: 2,
          "per-session": 3,
          enterprise: 4,
          custom: 5,
        };
        return sorted.sort((a, b) => {
          const orderA = pricingOrder[a.pricing?.model || "custom"] ?? 99;
          const orderB = pricingOrder[b.pricing?.model || "custom"] ?? 99;
          return orderA - orderB;
        });
      }
      default:
        return sorted;
    }
  }, [allProducts, filters, sortBy]);

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
    });
  };

  return (
    <div className="min-h-[calc(100vh-280px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Catalogue des solutions
          </h1>
          <p className="text-lg text-text-secondary">
            Explorez l'écosystème complet des{" "}
            <strong>solutions digitales en santé mentale</strong> <br />
            avec des filtres avancés pour trouver ce qui vous correspond.
          </p>
        </div>

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
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <FilterSection
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-sm font-semibold text-text-secondary whitespace-nowrap"
                >
                  Trier par :
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm font-medium text-text-primary"
                >
                  <option value="name">Nom (A-Z)</option>
                  <option value="pricing">Prix (gratuit d'abord)</option>
                </select>
              </div>

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
