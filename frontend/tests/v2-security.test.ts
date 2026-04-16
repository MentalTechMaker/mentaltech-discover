/**
 * Tests securite et coherence - MentalTech Discover
 *
 * Valide : URLs dynamiques, pas de em-dash, robots.txt, prescription flow,
 *          templates email, imports coherents, pas de secrets en dur.
 *
 * Lancement : bun test tests/v2-security.test.ts
 */

import { test, expect, describe } from "bun:test";
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, join } from "path";

const FRONTEND = resolve(import.meta.dir, "..");
const ROOT = resolve(FRONTEND, "..");
const SRC = resolve(FRONTEND, "src");
const PUBLIC = resolve(FRONTEND, "public");
const BACKEND = resolve(ROOT, "backend/app");
const TEMPLATES = resolve(BACKEND, "templates");

function readFile(path: string): string {
  return readFileSync(path, "utf-8");
}

function allFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        results.push(full);
      }
    }
  };
  walk(dir);
  return results;
}

// ─── T-SEC-1 : Pas d'URL en dur dans le code source ────────────────────────

describe("T-SEC-1 | Pas d'URL discover.mentaltech.fr en dur dans le code", () => {
  const srcFiles = allFiles(SRC, ".tsx").concat(allFiles(SRC, ".ts"));

  for (const file of srcFiles) {
    const relative = file.replace(SRC + "/", "");
    test(`${relative} - pas d'URL en dur`, () => {
      const content = readFile(file);
      // Le fallback dans meta.ts est acceptable
      if (relative === "utils/meta.ts") {
        const lines = content.split("\n");
        const hardcoded = lines.filter(l => l.includes("discover.mentaltech.fr") && !l.includes("||"));
        expect(hardcoded).toHaveLength(0);
      } else {
        expect(content).not.toContain("discover.mentaltech.fr");
      }
    });
  }
});

describe("T-SEC-1b | Pas d'URL en dur dans le backend Python", () => {
  const pyFiles = allFiles(BACKEND, ".py");

  for (const file of pyFiles) {
    const relative = file.replace(BACKEND + "/", "");
    test(`${relative} - pas d'URL en dur`, () => {
      const content = readFile(file);
      expect(content).not.toContain("discover.mentaltech.fr");
    });
  }
});

describe("T-SEC-1c | Templates email utilisent {{ frontend_url }}", () => {
  const templates = readdirSync(TEMPLATES).filter(f => f.endsWith(".html"));

  for (const tmpl of templates) {
    test(`${tmpl} - pas d'URL en dur`, () => {
      const content = readFile(join(TEMPLATES, tmpl));
      expect(content).not.toContain("discover.mentaltech.fr");
    });
  }
});

// ─── T-SEC-2 : Pas de em-dash ──────────────────────────────────────────────

describe("T-SEC-2 | Pas de em-dash dans le code source", () => {
  const allSrc = allFiles(SRC, ".tsx").concat(allFiles(SRC, ".ts"));

  for (const file of allSrc) {
    const relative = file.replace(SRC + "/", "");
    test(`${relative} - pas de em-dash literal`, () => {
      const content = readFile(file);
      expect(content).not.toContain("\u2014"); // em-dash unicode
    });

    test(`${relative} - pas de &mdash; HTML entity`, () => {
      const content = readFile(file);
      expect(content).not.toContain("&mdash;");
    });
  }
});

// ─── T-SEC-3 : robots.txt bloque /prescription ─────────────────────────────

describe("T-SEC-3 | robots.txt securite prescriptions", () => {
  const robots = readFile(resolve(PUBLIC, "robots.txt"));

  test("bloque /prescription", () => {
    expect(robots).toContain("Disallow: /prescription");
  });

  test("bloque /admin", () => {
    expect(robots).toContain("Disallow: /admin");
  });
});

// ─── T-SEC-4 : Prescription - separation GET/POST ──────────────────────────

describe("T-SEC-4 | Prescription backend - separation view/confirm", () => {
  const prescriptions = readFile(resolve(BACKEND, "routers/prescriptions.py"));

  test("GET /view/{token} ne marque pas comme consulte", () => {
    // Le GET endpoint ne doit pas contenir viewed_at = now
    const getEndpoint = prescriptions.split("@router.post")[0];
    const viewSection = getEndpoint.split('@router.get("/view/{token}"')[1];
    if (viewSection) {
      expect(viewSection).not.toContain("viewed_at = now");
      expect(viewSection).not.toContain("send_prescription_viewed_email");
    }
  });

  test("POST /view/{token}/confirm existe", () => {
    expect(prescriptions).toContain('@router.post("/view/{token}/confirm"');
  });

  test("POST /confirm a un rate limit", () => {
    // @limiter.limit est sur la ligne juste apres @router.post
    const idx = prescriptions.indexOf('@router.post("/view/{token}/confirm"');
    expect(idx).toBeGreaterThan(-1);
    // Le rate limit doit etre dans les 5 lignes autour du decorateur
    const vicinity = prescriptions.substring(Math.max(0, idx - 200), idx + 200);
    expect(vicinity).toContain("limiter.limit");
  });

  test("POST /confirm log l'IP", () => {
    const confirmSection = prescriptions.split('@router.post("/view/{token}/confirm"')[1]?.split("@router")[0];
    expect(confirmSection).toContain("request.client.host");
  });

  test("erreurs uniformes 404 (pas de 410)", () => {
    // Les endpoints publics ne doivent pas utiliser 410 GONE
    const publicSection = prescriptions.split("# ─── Public endpoints")[1];
    if (publicSection) {
      expect(publicSection).not.toContain("HTTP_410_GONE");
    }
  });
});

// ─── T-SEC-5 : Revoke utilise le bon template ──────────────────────────────

describe("T-SEC-5 | Revoke prescription - bon template email", () => {
  const prescriptions = readFile(resolve(BACKEND, "routers/prescriptions.py"));

  test("revoke n'envoie PAS prescription_viewed_email", () => {
    const revokeSection = prescriptions.split("revoke_prescription_by_patient")[1];
    expect(revokeSection).not.toContain("send_prescription_viewed_email");
  });

  test("revoke envoie prescription_revoked_email", () => {
    const revokeSection = prescriptions.split("revoke_prescription_by_patient")[1];
    expect(revokeSection).toContain("send_prescription_revoked_email");
  });

  test("template prescription_revoked.html existe", () => {
    expect(existsSync(join(TEMPLATES, "prescription_revoked.html"))).toBe(true);
  });
});

// ─── T-SEC-6 : Pas de dead code / imports inutilises ───────────────────────

describe("T-SEC-6 | Prescription backend - imports propres", () => {
  const prescriptions = readFile(resolve(BACKEND, "routers/prescriptions.py"));

  test("pas d'import get_optional_user", () => {
    expect(prescriptions).not.toContain("get_optional_user");
  });

  test("pas de parametre preview dans GET /view", () => {
    const getSection = prescriptions.split('@router.get("/view/{token}"')[1]?.split("@router")[0];
    if (getSection) {
      expect(getSection).not.toContain("preview");
    }
  });
});

// ─── T-SEC-7 : Frontend prescription - delai anti-bot ──────────────────────

describe("T-SEC-7 | Frontend prescription - delai 5s anti-bot", () => {
  const viewPage = readFile(resolve(SRC, "components/Prescriber/PrescriptionViewPage.tsx"));

  test("import confirmPrescriptionView", () => {
    expect(viewPage).toContain("confirmPrescriptionView");
  });

  test("setTimeout avec delai", () => {
    expect(viewPage).toContain("setTimeout");
    expect(viewPage).toContain("5000");
  });

  test("cleanup clearTimeout", () => {
    expect(viewPage).toContain("clearTimeout");
  });

  test("preview skip le confirm", () => {
    expect(viewPage).toContain("isPreview");
    expect(viewPage).toContain("if (!isPreview)");
  });
});

// ─── T-SEC-8 : API frontend coherente avec backend ─────────────────────────

describe("T-SEC-8 | API frontend - coherence routes", () => {
  const api = readFile(resolve(SRC, "api/prescriber.ts"));

  test("viewPrescription n'envoie pas de param preview", () => {
    const viewFn = api.split("export async function viewPrescription")[1]?.split("export")[0];
    if (viewFn) {
      expect(viewFn).not.toContain("preview");
    }
  });

  test("confirmPrescriptionView utilise POST", () => {
    expect(api).toContain("confirmPrescriptionView");
    const confirmFn = api.split("confirmPrescriptionView")[1]?.split("export")[0];
    if (confirmFn) {
      expect(confirmFn).toContain("method: 'POST'");
    }
  });

  test("route confirm matche le backend", () => {
    expect(api).toContain("/prescriptions/view/${token}/confirm");
  });
});

// ─── T-SEC-9 : Landing stats - pas de faux chiffre ─────────────────────────

describe("T-SEC-9 | Landing - stats solutions evaluees", () => {
  const landing = readFile(resolve(SRC, "components/Landing.tsx"));

  test("pas de fallback '50+' en dur", () => {
    expect(landing).not.toContain('"50+"');
  });

  test("utilise products.length pour < 10", () => {
    expect(landing).toContain("products.length");
  });

  test("arrondi a la dizaine pour >= 10", () => {
    expect(landing).toContain("productCount >= 10");
  });
});

// ─── T-SEC-10 : Apercu pre-creation (pas d'appel API) ──────────────────────

describe("T-SEC-10 | NewPrescription - apercu pre-creation", () => {
  const newPrescription = readFile(resolve(SRC, "components/Prescriber/NewPrescription.tsx"));

  test("bouton Apercu existe", () => {
    expect(newPrescription).toContain("Apercu");
  });

  test("utilise window.open (nouvel onglet)", () => {
    expect(newPrescription).toContain("window.open");
  });

  test("pas d'appel API dans handlePreview", () => {
    const previewFn = newPrescription.split("handlePreview")[1]?.split("return (")[0];
    if (previewFn) {
      expect(previewFn).not.toContain("apiFetch");
      expect(previewFn).not.toContain("viewPrescription");
      expect(previewFn).not.toContain("confirmPrescription");
    }
  });

  test("pas d'import sanitizeUrl inutilise", () => {
    expect(newPrescription).not.toContain("sanitizeUrl");
  });
});

// ─── T-SEC-11 : Pas de secrets dans le code source ─────────────────────────

describe("T-SEC-11 | Pas de secrets dans le code source", () => {
  const allSrc = allFiles(SRC, ".tsx").concat(allFiles(SRC, ".ts"));

  for (const file of allSrc) {
    const relative = file.replace(SRC + "/", "");
    test(`${relative} - pas de token/secret/password en dur`, () => {
      const content = readFile(file);
      // Pas de patterns de secrets courants
      expect(content).not.toMatch(/(?:api[_-]?key|secret[_-]?key|password)\s*[:=]\s*["'][^"']{8,}/i);
    });
  }
});

// ─── T-SEC-12 : Variable d'env unique ───────────────────────────────────────

describe("T-SEC-12 | Variable d'env FRONTEND_URL unique", () => {
  const envFile = readFile(resolve(ROOT, ".env"));
  const envExample = readFile(resolve(ROOT, ".env.example"));

  test(".env n'a pas de VITE_SITE_URL duplique", () => {
    expect(envFile).not.toContain("VITE_SITE_URL");
  });

  test(".env.example n'a pas de VITE_SITE_URL duplique", () => {
    expect(envExample).not.toContain("VITE_SITE_URL");
  });

  test("vite.config.ts derive VITE_SITE_URL de FRONTEND_URL", () => {
    const viteConfig = readFile(resolve(FRONTEND, "vite.config.ts"));
    expect(viteConfig).toContain("FRONTEND_URL");
    expect(viteConfig).toContain("VITE_SITE_URL");
  });
});

// ─── T-SEC-13 : Email service - globals Jinja2 ─────────────────────────────

describe("T-SEC-13 | Email service - frontend_url en global Jinja2", () => {
  const emailService = readFile(resolve(BACKEND, "services/email.py"));

  test("jinja_env.globals contient frontend_url", () => {
    expect(emailService).toContain('jinja_env.globals["frontend_url"]');
  });

  test("utilise settings.FRONTEND_URL", () => {
    expect(emailService).toContain("settings.FRONTEND_URL");
  });
});
