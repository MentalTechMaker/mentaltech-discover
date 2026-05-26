#!/usr/bin/env node
// Prebuild: fetch the visible products list from the API and write it to
// src/data/build-products.json. The SSG build reads this snapshot to:
//   - enumerate /solution/:id dynamic paths via getStaticPaths
//   - pre-populate useProductsStore at module load (so SSG'd HTML contains catalog content)
//
// If the API is unreachable, write an empty array - SSG still works, just without
// product pages pre-rendered. The site falls back to SPA behavior at runtime.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../src/data/build-products.json");

// Load the monorepo .env (project root) so the script picks up VITE_PRODUCTS_API_URL
// the same way docker-compose / vite config do. Process env wins over .env when both set.
const envPath = resolve(__dirname, "../../.env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const apiUrl =
  process.env.VITE_PRODUCTS_API_URL || "http://localhost:8000/api/products";

function ensureSnapshotExists() {
  // If the API is unreachable, keep any pre-existing snapshot (e.g. one committed
  // by a CI step before the Docker build). Only create an empty array if there is
  // no snapshot at all, so subsequent imports do not break.
  if (existsSync(outPath)) return;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, "[]");
}

async function main() {
  try {
    const res = await fetch(`${apiUrl}?limit=200`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.warn(
        `[prebuild] ${apiUrl} returned ${res.status} - keeping existing snapshot if any`,
      );
      ensureSnapshotExists();
      return;
    }
    const payload = await res.json();
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.items)
        ? payload.items
        : [];
    console.log(`[prebuild] fetched ${items.length} products from ${apiUrl}`);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, JSON.stringify(items, null, 2));
  } catch (err) {
    console.warn(
      `[prebuild] ${apiUrl} fetch failed (${err.message}) - keeping existing snapshot if any`,
    );
    ensureSnapshotExists();
  }
}

main();
