import type { Product } from '../types';

/**
 * Liste complète des produits des membres de MentalTech.fr
 * Mise à jour: 2025-10-24
 *
 * Inclut les membres fondateurs, adhérents et partenaires
 * Status des entreprises: active, liquidation, closed
 */

export const products: Product[] = [
  // MEMBRES FONDATEURS
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
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
  },
  {
    id: "kwit",
    name: "Kwit",
    type: "Sevrage tabagique",
    tagline: "Arrête de fumer avec coaching",
    description: "Application gamifiée pour t'aider à arrêter de fumer avec coaching personnalisé.",
    url: "https://kwit.app",
    logo: "🚭",
    tags: ["addiction", "coaching", "gamification"],
    audience: ["adult"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["autonomous", "program"],
    pricing: {
      model: "freemium",
      details: "Version gratuite + abonnement premium"
    },
    companyStatus: "active"
  },
  {
    id: "sobero",
    name: "Sobero",
    type: "Gestion de l'alcool",
    tagline: "Maîtrise ta consommation d'alcool",
    description: "Application basée sur les sciences comportementales pour réduire ou arrêter l'alcool. Suivi quotidien, exercices personnalisés, support communautaire et chat expert. Développée par les créateurs de Kwit.",
    url: "https://www.sobero.app",
    logo: "🍺",
    tags: ["addiction", "coaching", "autonomie", "suivi", "alcool"],
    audience: ["adult"],
    problemsSolved: ["addiction", "stress-anxiety"],
    preferenceMatch: ["autonomous", "program"],
    pricing: {
      model: "subscription",
      amount: "9,99€/mois",
      details: "Essai gratuit de 7 jours, puis 9,99€/mois sans engagement"
    },
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
  },
  {
    id: "eoscare",
    name: "EOS Care",
    type: "Plateforme addictologie",
    tagline: "Solutions innovantes pour les addictions",
    description: "Plateforme digitale combinant expertise médicale et soutien émotionnel pour le traitement des addictions, notamment alcool.",
    url: "https://www.eos-care.com",
    logo: "🍷",
    tags: ["addiction", "alcool", "accompagnement", "médical"],
    audience: ["adult"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["talk-now", "program"],
    pricing: {
      model: "enterprise",
      details: "Partenariats établissements de santé"
    },
    companyStatus: "active"
  },
  {
    id: "feelapp",
    name: "Feel",
    type: "Autothérapie TCC",
    tagline: "Surmonte la dépression avec les TCC",
    description: "Première application d'autothérapie par TCCs pour la dépression. Conçue par des psychiatres français.",
    url: "https://feelapp.care/",
    logo: "🌈",
    tags: ["dépression", "TCC", "autonomie", "thérapie"],
    audience: ["adult", "teen"],
    problemsSolved: ["sadness", "stress-anxiety"],
    preferenceMatch: ["autonomous", "program"],
    pricing: {
      model: "freemium",
      amount: "4,99€/mois",
      details: "Essai gratuit 15 jours, puis abonnement à partir de 4,99€/mois"
    },
    companyStatus: "active"
  },
  {
    id: "holicare",
    name: "Holicare",
    type: "Santé mentale en entreprise",
    tagline: "Détection, prévention, prise en charge",
    description: "Plateforme numérique complète pour la santé mentale au travail avec évaluation, programmes personnalisés et coordination de soins.",
    url: "https://www.holicare.com",
    logo: "🌿",
    tags: ["entreprise", "prévention", "détection", "accompagnement"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety", "sadness"],
    preferenceMatch: ["program", "talk-now"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Démo sur demande"
    },
    companyStatus: "active"
  },
  {
    id: "ifeel",
    name: "iFeel",
    type: "Bien-être en entreprise",
    tagline: "Bien-être mental pour vos équipes",
    description: "Service de santé mentale en ligne pour entreprises avec accès à des psychologues professionnels.",
    url: "https://ifeelonline.com",
    logo: "💚",
    tags: ["entreprise", "thérapie", "accompagnement", "bien-être"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety", "sadness"],
    preferenceMatch: ["talk-now", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis pour entreprises"
    },
    companyStatus: "active"
  },
  {
    id: "insleeplab",
    name: "InSleepLab",
    type: "Gestion du sommeil",
    tagline: "Prévention des risques liés à la fatigue",
    description: "Solution complète de prévention des risques professionnels liés à la fatigue et au manque de sommeil avec formation et dépistage.",
    url: "https://www.insleeplab.fr",
    logo: "😴",
    tags: ["sommeil", "fatigue", "prévention", "formation"],
    audience: ["adult"],
    problemsSolved: ["sleep", "work"],
    preferenceMatch: ["understand", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Formation et dépistage B2B"
    },
    companyStatus: "active"
  },
  {
    id: "letstolk",
    name: "LetsTolk",
    type: "Téléconsultation psychologique",
    tagline: "Psychologues en ligne pour hommes",
    description: "Première plateforme de téléconsultation dédiée aux hommes avec psychologues spécialisés. Messaging asynchrone disponible.",
    url: "https://www.letstolk.com",
    logo: "💬",
    tags: ["téléconsultation", "hommes", "thérapie", "spécialisé"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "work", "other"],
    preferenceMatch: ["talk-now"],
    pricing: {
      model: "per-session",
      details: "Première consultation 25€, puis à partir de 49€"
    },
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
  },
  {
    id: "pleinia",
    name: "Pleinia",
    type: "Bien-être holistique entreprise",
    tagline: "Solution holistique de santé mentale",
    description: "Plateforme combinant coaching, formations et défis gamifiés pour améliorer le bien-être mental en entreprise.",
    url: "https://www.pleinia.com",
    logo: "🌟",
    tags: ["entreprise", "coaching", "bien-être", "gamification"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety"],
    preferenceMatch: ["program", "autonomous"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis"
    },
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
  },
  {
    id: "wetalk",
    name: "WeTalk",
    type: "Plateforme communautaire",
    tagline: "Discussions sur le bien-être communautaire",
    description: "Série de talks pour faciliter l'échange scientifique et l'engagement communautaire autour de la santé mentale.",
    url: "https://we-talk.eu",
    logo: "🗣️",
    tags: ["éducation", "communauté", "recherche", "prévention"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "work"],
    preferenceMatch: ["understand"],
    pricing: {
      model: "free",
      details: "Plateforme d'échange gratuite"
    },
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "active"
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
    companyStatus: "liquidation"
  }
];

/**
 * Mapping des statuts d'entreprise
 */
export const companyStatusLabels: Record<string, string> = {
  active: "Entreprise active",
  liquidation: "En liquidation judiciaire",
  closed: "Entreprise fermée"
};

/**
 * Filtre les produits selon le statut de l'entreprise
 */
export function getActiveProducts(): Product[] {
  return products.filter(p => p.companyStatus === 'active');
}

/**
 * Filtre tous les produits incluant ceux en liquidation/fermés
 */
export function getAllProducts(): Product[] {
  return products;
}
