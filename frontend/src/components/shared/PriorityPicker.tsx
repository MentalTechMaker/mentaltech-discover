import React from "react";
import type { PriorityMap } from "../../types";

export interface PriorityPickerOption {
  value: string;
  label: string;
}

interface PriorityPickerProps {
  options: PriorityPickerOption[];
  priorities: PriorityMap;
  onToggle: (updated: PriorityMap) => void;
  label: string;
  description?: string;
  /** Optional predicate: return false to block adding a specific value */
  canAdd?: (value: string, currentOrdered: string[]) => boolean;
}

/**
 * Sequential priority picker: 1st click = P1, 2nd = P2, 3rd = P3.
 * Re-click deselects and bumps remaining items up.
 */
export function togglePriorityItem(
  prev: PriorityMap,
  value: string,
  canAdd?: (value: string, currentOrdered: string[]) => boolean,
): PriorityMap {
  const ordered: string[] = [
    ...(prev.P1 ?? []),
    ...(prev.P2 ?? []),
    ...(prev.P3 ?? []),
  ];

  if (ordered.includes(value)) {
    const remaining = ordered.filter((v) => v !== value);
    return {
      P1: remaining.slice(0, 1),
      P2: remaining.slice(1, 2),
      P3: remaining.slice(2, 3),
    };
  }

  if (ordered.length >= 3) return prev;

  if (canAdd && !canAdd(value, ordered)) return prev;

  const next = [...ordered, value];
  return {
    P1: next.slice(0, 1),
    P2: next.slice(1, 2),
    P3: next.slice(2, 3),
  };
}

export const PriorityPicker: React.FC<PriorityPickerProps> = ({
  options,
  priorities,
  onToggle,
  label,
  description,
  canAdd,
}) => {
  const ordered = [
    ...(priorities.P1 ?? []),
    ...(priorities.P2 ?? []),
    ...(priorities.P3 ?? []),
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-text-secondary mb-3">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const idx = ordered.indexOf(opt.value);
          const isSelected = idx !== -1;
          const level =
            idx === 0 ? "P1" : idx === 1 ? "P2" : idx === 2 ? "P3" : null;
          const isFull = ordered.length >= 3 && !isSelected;
          const blocked =
            !isSelected && canAdd ? !canAdd(opt.value, ordered) : false;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={isFull || blocked}
              onClick={() =>
                onToggle(togglePriorityItem(priorities, opt.value, canAdd))
              }
              className={`relative px-3 py-1.5 min-h-[44px] rounded-full text-sm font-semibold transition-all ${
                level === "P1"
                  ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400"
                  : level === "P2"
                    ? "bg-indigo-50 text-indigo-600 ring-2 ring-indigo-300"
                    : level === "P3"
                      ? "bg-gray-100 text-gray-600 ring-2 ring-gray-300"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isSelected && (
                <span
                  className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    level === "P1"
                      ? "bg-blue-500 text-white"
                      : level === "P2"
                        ? "bg-indigo-400 text-white"
                        : "bg-gray-400 text-white"
                  }`}
                >
                  {level}
                </span>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
