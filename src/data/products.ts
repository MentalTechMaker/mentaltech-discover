import type { Product } from '../types';

export const products: Product[] = [
  {
    id: "qare",
    name: "Qare",
    type: "Téléconsultation",
    tagline: "Parle à un psy en ligne, rapidement",
    description: "Téléconsultation avec psychiatres et psychologues, 7j/7 de 6h à minuit. Remboursable par l'Assurance Maladie.",
    url: "https://www.qare.fr",
    logo: "👨‍⚕️",
    tags: ["téléconsultation", "urgent", "professionnel"],
    audience: ["adult", "teen", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "work", "other"],
    preferenceMatch: ["talk-now"],
    pricing: {
      model: "per-session",
      details: "Remboursable par l'Assurance Maladie"
    },
  },
  {
    id: "petitbambou",
    name: "Petit BamBou",
    type: "Méditation",
    tagline: "Apprends à méditer, à ton rythme",
    description: "Application de méditation guidée avec des centaines de programmes pour réduire le stress et améliorer le sommeil.",
    url: "https://www.petitbambou.com",
    logo: "🧘",
    tags: ["méditation", "autonomie", "bien-être"],
    audience: ["adult", "teen", "senior"],
    problemsSolved: ["stress-anxiety", "sleep"],
    preferenceMatch: ["autonomous"],
    pricing: {
      model: "freemium",
      details: "Version gratuite + abonnement premium"
    },
  },
  {
    id: "hypnovr",
    name: "HypnoVR",
    type: "Réalité virtuelle",
    tagline: "Gestion de la douleur et de l'anxiété par VR",
    description: "Thérapies immersives en réalité virtuelle pour gérer la douleur, l'anxiété et les phobies.",
    url: "https://www.hypnovr.io",
    logo: "🥽",
    tags: ["VR", "anxiété", "phobies", "innovation"],
    audience: ["adult", "teen", "senior"],
    problemsSolved: ["stress-anxiety", "trauma"],
    preferenceMatch: ["autonomous", "program"],
    pricing: {
      model: "enterprise",
      details: "Destiné aux établissements de santé"
    },
  },
  {
    id: "kwit",
    name: "Kwit",
    type: "Sevrage tabagique",
    tagline: "Arrêtez de fumer et restez non-fumeur pour de bon",
    description: "Application mobile combinant TCC et gamification pour arrêter de fumer. Validée par l'OMS depuis 2023, avec 68% de réussite à 3 mois.",
    url: "https://kwit.app",
    logo: "🚭",
    tags: ["addiction", "coaching", "gamification", "TCC"],
    audience: ["adult", "teen"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["autonomous", "learn", "program"],
    pricing: {
      model: "freemium",
      amount: "60€/an",
      details: "3 jours d'essai gratuit"
    },
    forCompany: true,
    lastUpdated: "2025-11-12"
  },
  {
    id: "sobero",
    name: "Sobero",
    type: "Gestion de l'alcool",
    tagline: "Reprenez le pouvoir sur votre consommation d'alcool",
    description: "Application mobile pour développer une relation plus saine avec l'alcool. Approche Sober Curious, bienveillante et sans jugement. Plus de 60 000 utilisateurs.",
    url: "https://sobero.app",
    logo: "💙",
    tags: ["addiction", "TCC", "autonomie", "gamification"],
    audience: ["adult", "teen"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["autonomous", "learn", "program"],
    pricing: {
      model: "subscription",
      amount: "60€/an",
      details: "7 jours d'essai gratuits"
    },
    forCompany: true,
    lastUpdated: "2025-11-12"
  },
  {
    id: "mokacare",
    name: "moka.care",
    type: "Bien-être en entreprise",
    tagline: "Prends soin de toi au travail",
    description: "Plateforme de santé mentale pour accompagner les salariés avec psychologues, thérapeutes et coachs.",
    url: "https://www.moka.care",
    logo: "☕",
    tags: ["entreprise", "prévention", "accompagnement"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety"],
    preferenceMatch: ["talk-now", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis pour entreprises"
    },
  },
  {
    id: "resileyes",
    name: "ResilEyes",
    type: "Thérapie trauma",
    tagline: "Surmonte tes traumatismes",
    description: "Accompagnement thérapeutique digital spécialisé dans le traitement des traumatismes et du stress post-traumatique.",
    url: "https://www.resileyes.com",
    logo: "👁️",
    tags: ["trauma", "TSPT", "thérapie"],
    audience: ["adult", "teen"],
    problemsSolved: ["trauma"],
    preferenceMatch: ["program", "understand"],
    pricing: {
      model: "custom",
      details: "Prix non communiqué"
    },
  },
  {
    id: "tricky",
    name: "Tricky",
    type: "Prévention ludique",
    tagline: "Apprends en jouant",
    description: "Escape games et expériences immersives pour sensibiliser à la santé mentale et prévenir le burn-out.",
    url: "https://www.tricky.fr",
    logo: "🎮",
    tags: ["prévention", "ludique", "éducation"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety"],
    preferenceMatch: ["understand"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis pour entreprises"
    },
  },

  // MEMBRES ADHÉRENTS
  {
    id: "edra",
    name: "EDRA",
    type: "Télésurveillance psychiatrique",
    tagline: "Suivi personnalisé des troubles de l'humeur",
    description: "Dispositif médical de télésurveillance en psychiatrie pour patients adultes avec troubles psychiatriques sous traitement médicamenteux.",
    url: "https://www.edra.care/",
    logo: "📊",
    tags: ["télésurveillance", "psychiatrie", "médical", "troubles de l'humeur"],
    audience: ["adult"],
    problemsSolved: ["sadness", "other"],
    preferenceMatch: ["program", "talk-now"],
    pricing: {
      model: "enterprise",
      details: "Dispositif médical professionnel"
    },
  },
  {
    id: "eoscare",
    name: "Eos",
    type: "Clinique digitale addictologie",
    tagline: "Solution de santé numérique pour consolider l'abstinence",
    description: "Première clinique digitale dédiée à l'addictologie. Dispositif médical numérique pour l'alcoolodépendance et le sevrage tabagique.",
    url: "https://www.eos-care.com",
    logo: "🍷",
    tags: ["addiction", "téléconsultation", "dispositif médical", "TCC"],
    audience: ["adult"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["talk-now", "autonomous", "learn", "program"],
    pricing: {
      model: "freemium",
      details: "Consultations remboursables Sécurité Sociale, abonnement mensuel pour programme"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "feelapp",
    name: "Feel",
    type: "Application TCC",
    tagline: "Application qui aide à soigner la dépression en 3 à 6 mois",
    description: "Application basée sur la TCC pour soigner la dépression. Exercices pour modifier les comportements et maîtriser les pensées négatives. Dispositif médical.",
    url: "https://feelapp.care/",
    logo: "💜",
    tags: ["TCC", "dépression", "autonomie", "gamification"],
    audience: ["adult", "senior", "parent"],
    problemsSolved: ["sadness"],
    preferenceMatch: ["autonomous", "learn", "program"],
    pricing: {
      model: "freemium",
      amount: "29,99€ pour 6 mois",
      details: "15 jours d'essai, psychoéducation gratuite"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "holicare",
    name: "Holicare",
    type: "Plateforme entreprise",
    tagline: "La santé mentale au travail est une science",
    description: "Cultivez durablement la santé mentale au travail grâce à une expertise scientifique et une approche humaine. Détection précoce, plateforme dédiée, parcours de soins.",
    url: "https://www.holicare.com/",
    logo: "🫂",
    tags: ["entreprise", "téléconsultation", "formation", "prévention"],
    audience: ["adult", "teen", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now", "learn", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Abonnement"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "ifeel",
    name: "ifeel",
    type: "Plateforme entreprise",
    tagline: "Solution incontournable en santé mentale pour les entreprises",
    description: "Solution de référence pour relever le défi de la santé mentale au travail. Accompagnement pour réduire l'absentéisme et instaurer un climat positif.",
    url: "https://ifeelonline.com/fr/",
    logo: "🧠",
    tags: ["entreprise", "téléconsultation", "bien-être", "formation"],
    audience: ["adult", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work"],
    preferenceMatch: ["talk-now", "autonomous", "learn", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "insleeplab",
    name: "inSleep'Academy et inSleep'Care",
    type: "Plateforme entreprise",
    tagline: "Bien dormir s'apprend, mal dormir se soigne",
    description: "Spécialiste de la prévention des risques liés à la fatigue et à la somnolence en entreprise. Formation, diagnostic et contrôle des troubles du sommeil.",
    url: "https://www.insleeplab.fr",
    logo: "😴",
    tags: ["sommeil", "entreprise", "téléconsultation", "formation"],
    audience: ["adult"],
    problemsSolved: ["sleep"],
    preferenceMatch: ["talk-now", "autonomous", "learn", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Abonnement, à la séance, ou sur devis"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "letstolk",
    name: "Let's Tolk",
    type: "Téléconsultation",
    tagline: "Les psychologues en ligne",
    description: "Cabinet digital où des psys passionnés prennent soin de ton mental. Burn-out, anxiété, dépression, addictions… En visio, 7j/7, en moins de 24h.",
    url: "https://www.letstolk.com/",
    logo: "🫶",
    tags: ["téléconsultation", "professionnel", "urgent", "accessible"],
    audience: ["adult", "teen", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work"],
    preferenceMatch: ["talk-now"],
    pricing: {
      model: "per-session",
      amount: "à partir de 28€",
      details: "Remboursement par la mutuelle selon contrat"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "lyynk",
    name: "Lyynk",
    type: "App santé mentale jeunes",
    tagline: "L'app santé mentale des 10-25 ans",
    description: "Application pour la santé mentale des jeunes (10-25 ans) avec calendrier émotionnel, journal, kit d'urgence et forum pour parents.",
    url: "https://www.lyynk.com",
    logo: "🔗",
    tags: ["jeunes", "adolescents", "prévention", "émotions"],
    audience: ["teen", "child", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "other"],
    preferenceMatch: ["autonomous", "understand"],
    pricing: {
      model: "free",
      details: "Application gratuite"
    },
  },
  {
    id: "neuredia",
    name: "Neuredia",
    type: "Gestion administrative neuroatypie",
    tagline: "Simplifie les démarches administratives",
    description: "Plateforme de gestion administrative pour les aidants d'enfants neurodivergents: génération automatique de formulaires, gestion documentaire.",
    url: "https://www.neuredia.fr",
    logo: "🧩",
    tags: ["neuroatypie", "administratif", "aidants", "MDPH"],
    audience: ["parent", "adult"],
    problemsSolved: ["other"],
    preferenceMatch: ["understand"],
    pricing: {
      model: "freemium",
      details: "Version gratuite avec fonctionnalités essentielles + premium"
    },
  },
  {
    id: "pleinia",
    name: "Pleinia",
    type: "Plateforme entreprise",
    tagline: "Donner aux salariés les clés pour agir sur leur santé mentale",
    description: "Approche globale pour adapter les comportements de vie et développer les soft skills. Contenus digitaux, bilans, parcours coachés et défis collectifs.",
    url: "https://www.pleinia.com",
    logo: "💪",
    tags: ["entreprise", "coaching", "bien-être", "prévention"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "work", "sleep"],
    preferenceMatch: ["talk-now", "autonomous", "learn", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "suricog",
    name: "Suricog",
    type: "Medtech eye-tracking",
    tagline: "Diagnostic par oculométrie",
    description: "Technologie d'eye-tracking médical pour quantifier les troubles cérébraux en pratique clinique.",
    url: "https://www.suricog.fr",
    logo: "👀",
    tags: ["medtech", "diagnostic", "neurologie", "professionnel"],
    audience: ["adult"],
    problemsSolved: ["other"],
    preferenceMatch: ["understand"],
    pricing: {
      model: "enterprise",
      details: "Dispositif médical professionnel"
    },
  },
  {
    id: "tuki",
    name: "Tuki",
    type: "Entraide entre pairs",
    tagline: "Groupes de parole entre pairs",
    description: "Application francophone de soutien par les pairs avec groupes de parole modérés pour divers troubles et défis de vie.",
    url: "https://www.wearetuki.com/",
    logo: "🤝",
    tags: ["entraide", "pairs", "communauté", "groupes de parole"],
    audience: ["adult", "teen"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "addiction", "other"],
    preferenceMatch: ["talk-now", "understand"],
    pricing: {
      model: "freemium",
      details: "Accès gratuit avec contenu premium"
    },
  },
  {
    id: "wetalk",
    name: "We talk",
    type: "Téléconsultation",
    tagline: "Partenaire pour le bien-être mental de vos collaborateurs",
    description: "Solution complète, efficace et personnalisée, accessible au plus grand nombre avec analyse d'impact.",
    url: "https://www.wetalk.life",
    logo: "🫶",
    tags: ["téléconsultation", "entreprise", "urgent", "accessible"],
    audience: ["adult", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now", "autonomous", "learn", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      amount: "à partir de 4€",
      details: "Essai gratuit bilan émotionnel"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "lislup",
    name: "Lisl Up",
    type: "Plateforme santé mentale 24/7",
    tagline: "Santé mentale accessible 24/7",
    description: "Plateforme tout-en-un avec évaluation, cours, coaching, chat d'urgence et baromètre annuel pour entreprises.",
    url: "https://www.lislup.com",
    logo: "📱",
    tags: ["plateforme", "coaching", "urgence", "entreprise"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "work", "sleep", "other"],
    preferenceMatch: ["talk-now", "autonomous", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      details: "Abonnement selon taille entreprise (<250 ou >250 employés)"
    },
  },
  {
    id: "mindday",
    name: "mindDay",
    type: "TCC en application",
    tagline: "Thérapie TCC accessible à tous",
    description: "Application mobile de thérapie basée sur les TCC avec programmes vidéo de 14-30 jours, méditations et auto-hypnoses.",
    url: "https://www.mindday.com",
    logo: "🧠",
    tags: ["TCC", "thérapie", "méditation", "autonomie"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "work", "sleep"],
    preferenceMatch: ["autonomous", "program"],
    pricing: {
      model: "subscription",
      amount: "Abonnement",
      details: "Essai gratuit 7 jours puis abonnement"
    },
  },
  {
    id: "koalou",
    name: "Koalou",
    type: "Psychothérapie enfants",
    tagline: "Psychothérapie digitale pour enfants",
    description: "Première psychothérapie digitale française pour enfants de 3 à 10 ans avec programmes spécialisés (stress, anxiété, TDAH, phobies).",
    url: "https://www.koalou.com",
    logo: "🐨",
    tags: ["enfants", "thérapie", "émotions", "professionnel"],
    audience: ["child", "parent"],
    problemsSolved: ["stress-anxiety", "other"],
    preferenceMatch: ["program"],
    pricing: {
      model: "custom",
      details: "Démo sur demande - destiné aux professionnels et parents"
    },
  },
  {
    id: "lumm",
    name: "Lumm",
    type: "Bien-être mental entreprise",
    tagline: "Simplifions la santé mentale au travail",
    description: "Plateforme pour le bien-être mental en entreprise avec parcours personnalisés, ressources autonomes et thérapeutes à distance.",
    url: "https://www.lumm.io",
    logo: "💡",
    tags: ["entreprise", "prévention", "thérapie", "coaching"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety"],
    preferenceMatch: ["talk-now", "autonomous", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis pour entreprises"
    },
  }
];

/**
 * Retourne tous les produits actifs
 * Note: Seuls les produits en exploitation sont inclus dans la base
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Vérifie si un produit nécessite une mise à jour
 * @param product - Le produit à vérifier
 * @returns true si le produit n'a pas de date de mise à jour
 */
export function needsUpdate(product: Product): boolean {
  return !product.lastUpdated;
}
