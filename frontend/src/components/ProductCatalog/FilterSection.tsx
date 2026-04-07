import React, { useState } from "react";
import type { Filters } from "./ProductCatalog";
import { analytics } from "../../lib/analytics";

interface FilterSectionProps {
  filters: Filters;
  filterOptions: {
    types: string[];
    problems: string[];
    pricingModels: string[];
  };
  onFilterChange: (key: keyof Filters, value: string | string[]) => void;
}

const PARTICULIER_AUDIENCES = [
  { value: "adult", label: "Adultes" },
  { value: "young", label: "Adolescents" },
  { value: "child", label: "Enfants" },
  { value: "parent", label: "Parents" },
  { value: "senior", label: "Seniors" },
] as const;

import { problemLabels, pricingLabels } from "../../data/labels";

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  filterOptions,
  onFilterChange,
}) => {
  const [audienceExpanded, setAudienceExpanded] = useState(false);

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

  const handleSegmentChange = (segment: Filters["segment"]) => {
    analytics.filterUsed("segment", segment);
    onFilterChange("segment", segment);
    // Changing segment clears audience sub-filters
    onFilterChange("audience", []);
  };

  const handleAudienceSubFilter = (value: string) => {
    // Selecting a sub-checkbox auto-activates Particulier segment
    if (filters.segment !== "particulier") {
      onFilterChange("segment", "particulier");
    }
    toggleArrayFilter("audience", value);
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
            {/* Tous */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.segment === "all"}
                onChange={() => handleSegmentChange("all")}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">Tous</span>
            </label>

            {/* Particulier with expandable sub-filters */}
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filters.segment === "particulier"}
                  onChange={() => handleSegmentChange("particulier")}
                  className="w-4 h-4 text-primary cursor-pointer"
                />
                <span
                  className="text-text-secondary cursor-pointer select-none"
                  onClick={() => handleSegmentChange("particulier")}
                >
                  Particulier
                </span>
                <button
                  type="button"
                  onClick={() => setAudienceExpanded((v) => !v)}
                  className="ml-auto text-text-secondary hover:text-text-primary text-xs px-1"
                  aria-label={audienceExpanded ? "Réduire" : "Développer"}
                >
                  {audienceExpanded ? "▼" : "▶"}
                </button>
              </div>

              {audienceExpanded && (
                <div className="ml-6 mt-2 space-y-1.5">
                  {PARTICULIER_AUDIENCES.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.audience.includes(value)}
                        onChange={() => handleAudienceSubFilter(value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-secondary text-sm">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Entreprise */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.segment === "company"}
                onChange={() => handleSegmentChange("company")}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">Entreprise</span>
            </label>

            {/* Établissement de santé */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={filters.segment === "health"}
                onChange={() => handleSegmentChange("health")}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-secondary">
                Établissement de santé
              </span>
            </label>
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
