import React from "react";
import type { Filters } from "./ProductCatalog";
import { analytics } from "../../lib/analytics";

interface FilterSectionProps {
  filters: Filters;
  filterOptions: {
    types: string[];
    audiences: string[];
    problems: string[];
    pricingModels: string[];
  };
  onFilterChange: (key: keyof Filters, value: string | string[]) => void;
}

const audienceLabels: Record<string, string> = {
  adult: "Adultes",
  young: "Adolescents",
  child: "Enfants",
  parent: "Parents",
  senior: "Seniors",
};

const problemLabels: Record<string, string> = {
  "stress-anxiety": "Stress & Anxiété",
  sadness: "Tristesse & Dépression",
  addiction: "Addictions",
  trauma: "Traumatismes",
  work: "Travail & Burn-out",
  sleep: "Sommeil",
  other: "Autres",
};

const pricingLabels: Record<string, string> = {
  free: "Gratuit",
  freemium: "Freemium",
  subscription: "Abonnement",
  "per-session": "Par séance",
  enterprise: "Entreprise (B2B)",
  custom: "Sur mesure",
};

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  filterOptions,
  onFilterChange,
}) => {
  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const currentArray = filters[key] as string[];
    const isRemoving = currentArray.includes(value);
    const newArray = isRemoving
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];

    if (!isRemoving) {
      analytics.filterUsed(key, value);
    }

    onFilterChange(key, newArray);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 sticky top-4 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold text-text-primary">Filtres</h2>
      </div>

      <div className="overflow-y-auto px-6 pb-6 space-y-6 flex-1">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Recherche
          </label>
          <input
            type="text"
            placeholder="Nom, description, tags..."
            value={filters.search}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange("search", value);
              if (value.length > 0) {
                analytics.filterUsed("search", value.substring(0, 20));
              }
            }}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Public cible
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.forCompany === "all"}
                onChange={() => {
                  analytics.filterUsed("forCompany", "all");
                  onFilterChange("forCompany", "all");
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">Tous</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.forCompany === "individual"}
                onChange={() => {
                  analytics.filterUsed("forCompany", "individual");
                  onFilterChange("forCompany", "individual");
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">Particuliers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.forCompany === "company"}
                onChange={() => {
                  analytics.filterUsed("forCompany", "company");
                  onFilterChange("forCompany", "company");
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">Entreprises</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Public ({filters.audience.length})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.audiences.map((audience) => (
              <label
                key={audience}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.audience.includes(audience)}
                  onChange={() => toggleArrayFilter("audience", audience)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-secondary">
                  {audienceLabels[audience] || audience}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Problèmes traités ({filters.problemsSolved.length})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.problems.map((problem) => (
              <label
                key={problem}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.problemsSolved.includes(problem)}
                  onChange={() => toggleArrayFilter("problemsSolved", problem)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-secondary">
                  {problemLabels[problem] || problem}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Type de service ({filters.type.length})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.types.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => toggleArrayFilter("type", type)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-secondary">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Tarification ({filters.pricingModel.length})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.pricingModels.map((model) => (
              <label
                key={model}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.pricingModel.includes(model)}
                  onChange={() => toggleArrayFilter("pricingModel", model)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-secondary">
                  {pricingLabels[model] || model}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
