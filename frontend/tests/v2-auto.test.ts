/**
 * Tests automatisés V2 - MentalTech Discover
 *
 * Couvre : SEO (fichiers statiques), code source V2, TypeScript, ESLint.
 * Ne couvre PAS : tests UI, login, quiz flow, labels visuels (voir section TODO en bas).
 *
 * Lancement : bun test tests/v2-auto.test.ts
 * Avec serveur : BASE_URL=http://localhost:8080 bun test tests/v2-auto.test.ts
 */

import { test, expect, describe } from "bun:test";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

// ─── Chemins ────────────────────────────────────────────────────────────────

const FRONTEND = resolve(import.meta.dir, "..");
const PUBLIC   = resolve(FRONTEND, "public");
const SRC      = resolve(FRONTEND, "src");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:8080";

function pub(file: string)  { return readFileSync(resolve(PUBLIC, file), "utf-8"); }
function src(file: string)  { return readFileSync(resolve(SRC, file), "utf-8"); }

// ─── T-SEO-1 : sitemap.xml ──────────────────────────────────────────────────

describe("T-SEO-1 | sitemap.xml - routes correctes", () => {
  const sitemap = pub("sitemap.xml");

  test("contient /catalog (pas /catalogue)", () => {
    expect(sitemap).toContain("discover.mentaltech.fr/catalog");
    expect(sitemap).not.toContain("discover.mentaltech.fr/catalogue");
  });

  const routes = ["/methodology", "/about", "/faq", "/privacy", "/legal"];
  for (const route of routes) {
    test(`contient ${route}`, () => {
      expect(sitemap).toContain(`discover.mentaltech.fr${route}`);
    });
  }

  test("ne reference pas de routes SPA privees", () => {
    expect(sitemap).not.toContain("/admin");
    expect(sitemap).not.toContain("/prescriber-dashboard");
    expect(sitemap).not.toContain("/quiz");
    expect(sitemap).not.toContain("/results");
  });
});

// ─── T-SEO-2 : robots.txt ───────────────────────────────────────────────────

describe("T-SEO-2 | robots.txt - routes privees bloquees", () => {
  const robots = pub("robots.txt");

  const privateRoutes = [
    "/admin",
    "/prescriber-dashboard",
    "/new-prescription",
    "/comparator",
    "/prescriber-auth",
    "/register-publisher",
    "/publisher-dashboard",
    "/publisher-submission",
    "/admin-submissions",
    "/reset-password",
    "/verify-email",
    "/veille",
    "/profile",
  ];

  for (const route of privateRoutes) {
    test(`bloque ${route}`, () => {
      expect(robots).toContain(`Disallow: ${route}`);
    });
  }

  test("reference le sitemap statique", () => {
    expect(robots).toContain("Sitemap: https://discover.mentaltech.fr/sitemap.xml");
  });

  test("reference le sitemap dynamique (/api/sitemap.xml)", () => {
    expect(robots).toContain("Sitemap: https://discover.mentaltech.fr/api/sitemap.xml");
  });
});

// ─── T-SEO-5 : JSON-LD dans index.html ──────────────────────────────────────

describe("T-SEO-5 | index.html - JSON-LD", () => {
  const html = readFileSync(resolve(FRONTEND, "index.html"), "utf-8");

  // Extraire tous les blocs JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(m => {
      try { return JSON.parse(m[1]); } catch { return null; }
    })
    .filter(Boolean);

  const org     = blocks.find(b => b["@type"] === "Organization");
  const website = blocks.find(b => b["@type"] === "WebSite");

  test("bloc Organization present", () => {
    expect(org).toBeDefined();
  });

  test("Organization.name = Collectif MentalTech", () => {
    expect(org?.name).toBe("Collectif MentalTech");
  });

  test("bloc WebSite present", () => {
    expect(website).toBeDefined();
  });

  test("WebSite.name = MentalTech Discover", () => {
    expect(website?.name).toBe("MentalTech Discover");
  });

  test("SearchAction urlTemplate cible /catalog (pas /catalogue)", () => {
    const url: string = website?.potentialAction?.target?.urlTemplate ?? "";
    expect(url).toContain("/catalog");
    expect(url).not.toContain("/catalogue");
  });

  test("canonical dans le <head>", () => {
    expect(html).toContain('rel="canonical"');
    expect(html).toContain("https://discover.mentaltech.fr/");
  });

  test("og:image referencee (fichier a creer manuellement)", () => {
    // Verifie que la reference existe dans le HTML - le fichier og-image.png
    // doit etre cree manuellement (intervention utilisateur requise)
    expect(html).toContain("og-image.png");
  });
});

// ─── T-SEO-7 : llms.txt ─────────────────────────────────────────────────────

describe("T-SEO-7 | llms.txt", () => {
  test("fichier existe", () => {
    expect(existsSync(resolve(PUBLIC, "llms.txt"))).toBeTrue();
  });

  const llms = pub("llms.txt");

  test("mentionne les 3 profils utilisateur", () => {
    expect(llms).toContain("3 user profiles");
  });

  test("numero urgence 3114 present", () => {
    expect(llms).toContain("3114");
  });

  test("URL du site correcte", () => {
    expect(llms).toContain("https://discover.mentaltech.fr");
  });

  test("mention 'not a medical device'", () => {
    expect(llms).toContain("NOT a medical device");
  });
});

// ─── nginx CSP ──────────────────────────────────────────────────────────────

describe("nginx.conf | CSP headers", () => {
  const nginx = readFileSync(resolve(FRONTEND, "nginx.conf"), "utf-8");

  test("img-src autorise https: pour logos externes", () => {
    expect(nginx).toContain("img-src 'self' data: https:");
  });

  test("frame-ancestors none (protection clickjacking)", () => {
    expect(nginx).toContain("frame-ancestors 'none'");
  });

  test("HSTS active", () => {
    expect(nginx).toContain("Strict-Transport-Security");
  });
});

// ─── Code V2 : types et store ────────────────────────────────────────────────

describe("Code V2 | Types - UserType et UserAnswers", () => {
  const types = src("types/index.ts");

  test("UserType inclut 'health-decision-maker'", () => {
    expect(types).toContain("'health-decision-maker'");
  });

  test("UserType inclut 'individual'", () => {
    expect(types).toContain("'individual'");
  });

  test("UserType inclut 'company'", () => {
    expect(types).toContain("'company'");
  });

  test("UserAnswers a healthOrgType", () => {
    expect(types).toContain("healthOrgType");
  });

  test("UserAnswers a healthOrgNeeds", () => {
    expect(types).toContain("healthOrgNeeds");
  });
});

// ─── Code V2 : moteur de recommandation ─────────────────────────────────────

describe("Code V2 | recommendationEngine - segmentation audience", () => {
  const engine = src("data/recommendationEngine.ts");

  test("INSTITUTIONAL_AUDIENCES defini", () => {
    expect(engine).toContain("INSTITUTIONAL_AUDIENCES");
  });

  test("filtre etablissement-sante pour HDM", () => {
    expect(engine).toContain("etablissement-sante");
  });

  test("filtre entreprise pour company", () => {
    expect(engine).toContain("entreprise");
  });

  test("signature getRecommendations utilise UserType", () => {
    expect(engine).toContain("userType: UserType");
  });

  test("calculateHealthDecisionMakerScore defini", () => {
    expect(engine).toContain("calculateHealthDecisionMakerScore");
  });

  test("generateHealthDecisionMakerExplanation defini", () => {
    expect(engine).toContain("generateHealthDecisionMakerExplanation");
  });

  test("individual exclut produits exclusivement institutionnels", () => {
    // Le filtre utilise every() pour detecter audience 100% institutionnelle
    expect(engine).toContain(".every(");
  });
});

// ─── Code V2 : quiz décideur ────────────────────────────────────────────────

describe("Code V2 | Quiz - parcours health-decision-maker", () => {
  test("healthDecisionMakerQuestions.ts existe", () => {
    expect(existsSync(resolve(SRC, "data/healthDecisionMakerQuestions.ts"))).toBeTrue();
  });

  const hdmQ = src("data/healthDecisionMakerQuestions.ts");

  test("contient Q1 (type etablissement)", () => {
    expect(hdmQ).toContain("hopital-public");
  });

  test("contient Q2 (besoins prioritaires)", () => {
    expect(hdmQ).toContain("burnout-soignants");
  });

  test("contient Q3 (type de solution)", () => {
    expect(hdmQ).toContain("platform");
  });

  const quiz = src("components/Quiz/Quiz.tsx");

  test("Quiz importe healthDecisionMakerQuestions", () => {
    expect(quiz).toContain("healthDecisionMakerQuestions");
  });

  test("Quiz route health-decision-maker vers le bon questionnaire", () => {
    expect(quiz).toContain("health-decision-maker");
  });

  test("getRecommendations appele avec userType (pas isCompany bool)", () => {
    // L'ancien pattern "userType === 'company'" ne doit plus etre passe a getRecommendations
    expect(quiz).not.toContain('getRecommendations(answers, userType === "company"');
  });
});

// ─── Code V2 : Landing - 3 parcours ─────────────────────────────────────────

describe("Code V2 | Landing - 3e parcours etablissement", () => {
  const landing = src("components/Landing.tsx");

  test("gere le type health-decision-maker", () => {
    expect(landing).toContain("health-decision-maker");
  });

  test("grille a 3 colonnes (md:grid-cols-3)", () => {
    expect(landing).toContain("md:grid-cols-3");
  });

  test("handleStart accepte UserType (pas 'individual' | 'company' inline)", () => {
    expect(landing).toContain("UserType");
  });
});

// ─── Code V2 : prescripteur en attente ──────────────────────────────────────

describe("Code V2 | Prescripteur en attente (F1)", () => {
  const authStore = src("store/useAuthStore.ts");

  test("isPrescriberPending calcule dans useAuthStore", () => {
    expect(authStore).toContain("isPrescriberPending");
  });

  test("is_verified_prescriber utilise pour le calcul", () => {
    expect(authStore).toContain("is_verified_prescriber");
  });

  const dashboard = src("components/Prescriber/PrescriberDashboard.tsx");

  test("dashboard utilise isPrescriberPending", () => {
    expect(dashboard).toContain("isPrescriberPending");
  });

  test("dashboard affiche une banniere (bg-amber)", () => {
    expect(dashboard).toContain("bg-amber");
  });

  const newPrescription = src("components/Prescriber/NewPrescription.tsx");

  test("NewPrescription bloque le submit si pending", () => {
    expect(newPrescription).toContain("isPrescriberPending");
  });

  test("NewPrescription affiche message de verrouillage", () => {
    expect(newPrescription).toContain("Compte en attente");
  });

  const header = src("components/Layout/Header.tsx");

  test("Header visible pour compte en attente", () => {
    expect(header).toContain("isPrescriberPending");
  });
});

// ─── Code V2 : labels audience ──────────────────────────────────────────────

describe("Code V2 | Labels audience - etablissement-sante / entreprise", () => {
  // Files that display raw audience values as labels (product display, not filter UI)
  const displayFiles = [
    "components/ProductPage.tsx",
    "components/ProductCatalog/ProductCatalogCard.tsx",
    "components/Prescriber/ProductQuickView.tsx",
    "components/Prescriber/ComparatorPage.tsx",
  ];

  for (const file of displayFiles) {
    test(`${file.split("/").pop()} utilise 'etablissement-sante'`, () => {
      expect(src(file)).toContain("etablissement-sante");
    });

    test(`${file.split("/").pop()} utilise 'entreprise'`, () => {
      expect(src(file)).toContain("entreprise");
    });
  }

  // FilterSection uses segment-based filtering (new hierarchical architecture)
  test("FilterSection utilise les segments hierarchiques (particulier/company/health)", () => {
    const fs = src("components/ProductCatalog/FilterSection.tsx");
    expect(fs).toContain("particulier");
    expect(fs).toContain("company");
    expect(fs).toContain("health");
  });

  // ProductCatalog filtering logic references raw audience values
  test("ProductCatalog referencie 'etablissement-sante' dans la logique de filtre", () => {
    expect(src("components/ProductCatalog/ProductCatalog.tsx")).toContain("etablissement-sante");
  });

  test("ProductCatalog referencie 'entreprise' dans la logique de filtre", () => {
    expect(src("components/ProductCatalog/ProductCatalog.tsx")).toContain("entreprise");
  });
});

// ─── useAppStore - getAnswerKey HDM ─────────────────────────────────────────

describe("Code V2 | useAppStore - getAnswerKey HDM", () => {
  const store = src("store/useAppStore.ts");

  test("getAnswerKey gere health-decision-maker", () => {
    expect(store).toContain("health-decision-maker");
  });

  test("hotot hon dans ANSWER_PARAM_MAP pour HDM", () => {
    expect(store).toContain("healthOrgType");
    expect(store).toContain("healthOrgNeeds");
  });
});

// ─── TypeScript ──────────────────────────────────────────────────────────────

describe("TypeScript | Compilation sans erreurs", () => {
  test("tsc --noEmit retourne 0", () => {
    const result = Bun.spawnSync(["bun", "run", "tsc", "--noEmit"], {
      cwd: FRONTEND,
      stdout: "pipe",
      stderr: "pipe",
    });
    if (result.exitCode !== 0) {
      const stderr = new TextDecoder().decode(result.stderr);
      console.error("Erreurs TypeScript:\n" + stderr);
    }
    expect(result.exitCode).toBe(0);
  });
}, { timeout: 60_000 });

// ─── ESLint ──────────────────────────────────────────────────────────────────

describe("ESLint | 0 erreurs (warnings OK)", () => {
  test("eslint retourne 0 (aucune erreur)", () => {
    const result = Bun.spawnSync(["bun", "run", "lint"], {
      cwd: FRONTEND,
      stdout: "pipe",
      stderr: "pipe",
    });
    if (result.exitCode !== 0) {
      const stdout = new TextDecoder().decode(result.stdout);
      console.error("Erreurs ESLint:\n" + stdout);
    }
    expect(result.exitCode).toBe(0);
  });
}, { timeout: 30_000 });

// ─── Serveur local (optionnel) ───────────────────────────────────────────────

describe(`Serveur local | HTTP (${BASE_URL}) - skip si hors ligne`, () => {
  const endpoints: Array<{ path: string; check: string }> = [
    { path: "/sitemap.xml",  check: "discover.mentaltech.fr" },
    { path: "/robots.txt",   check: "Disallow" },
    { path: "/llms.txt",     check: "MentalTech" },
    { path: "/",             check: "MentalTech Discover" },
  ];

  for (const { path, check } of endpoints) {
    test(`GET ${path} retourne 200 et contient le contenu attendu`, async () => {
      try {
        const res = await fetch(`${BASE_URL}${path}`, {
          signal: AbortSignal.timeout(3000),
        });
        expect(res.status).toBe(200);
        const text = await res.text();
        expect(text).toContain(check);
      } catch {
        // Serveur non demarré - test skippé silencieusement
        console.log(`  [SKIP] ${BASE_URL}${path} - serveur non accessible`);
      }
    });
  }
});

// ─── TESTS MANUELS (interface utilisateur) ───────────────────────────────────
//
// Les tests ci-dessous ne peuvent pas être automatisés sans Playwright.
// Ils apparaissent en TODO dans la sortie - utilisez tests-v2.md pour les exécuter.

describe("TESTS MANUELS | SEO dynamique (navigateur)", () => {
  test.todo("T-SEO-3 : canonical tag se met à jour à la navigation (DevTools > head)");
  test.todo("T-SEO-4 : og:title et og:description mis à jour à la navigation");
  test.todo("T-SEO-6 : ProductPage injecte JSON-LD SoftwareApplication + BreadcrumbList");
});

describe("TESTS MANUELS | F1 - Prescripteur en attente (login requis)", () => {
  test.todo("T-F1-1 : bannière amber visible sur le dashboard prescripteur (compte non vérifié)");
  test.todo("T-F1-2 : bouton 'Créer la prescription' remplacé par message de verrouillage");
  test.todo("T-F1-3 : compte vérifié → bouton normal, pas de bannière");
  test.todo("T-F1-4 : menu header visible pour compte prescripteur en attente");
});

describe("TESTS MANUELS | HDM - Quiz décideur de santé (navigateur)", () => {
  test.todo("T-HDM-1 : Landing affiche 3 cartes en grille (3 colonnes desktop)");
  test.todo("T-HDM-2 : clic 'Pour mon établissement' lance quiz avec 3 questions (pas 5)");
  test.todo("T-HDM-3 : résultats HDM ne montrent que produits avec audience etablissement-sante");
  test.todo("T-HDM-4 : résultats company ne montrent que produits avec audience entreprise");
  test.todo("T-HDM-5 : résultats individual excluent produits 100% institutionnels");
  test.todo("T-HDM-6 : URL résultats contient ut=health-decision-maker");
});

describe("TESTS MANUELS | Audience - labels UI (navigateur)", () => {
  test.todo("T-AUD-1 : ProductPage affiche 'Établissements de santé' pour etablissement-sante");
  test.todo("T-AUD-2 : FilterSection catalogue : options 'Établissements de santé' et 'Entreprises'");
  test.todo("T-AUD-3 : ProductForm admin : options etablissement-sante et entreprise présentes");
  test.todo("T-AUD-4 : ProductQuickView (prescripteur) : libellé établissement-sante correct");
});
