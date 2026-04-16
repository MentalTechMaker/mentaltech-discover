import React from "react";
import type { PriorityMap } from "../../types";
import { priorityClasses } from "../../data/labels";

/**
 * Renders priority badges for P1/P2/P3 items.
 * Falls back to displaying items from a flat array with P2 styling.
 */
export function renderPriorityBadges(
  priorities: PriorityMap | undefined,
  labels: Record<string, string>,
  options?: { fallback?: string[]; limit?: number },
): React.ReactNode[] {
  const { fallback, limit } = options ?? {};

  if (priorities) {
    const items: { key: string; priority: string }[] = [];
    for (const p of ["P1", "P2", "P3"] as const) {
      for (const key of priorities[p] ?? []) {
        items.push({ key, priority: p });
      }
    }
    const sliced = limit ? items.slice(0, limit) : items;
    return sliced.map(({ key, priority }) => (
      <span key={key} className={priorityClasses[priority]}>
        {labels[key] ?? key}
      </span>
    ));
  }

  if (fallback) {
    const sliced = limit ? fallback.slice(0, limit) : fallback;
    return sliced.map((key) => (
      <span key={key} className={priorityClasses.P2}>
        {labels[key] ?? key}
      </span>
    ));
  }

  return [];
}
