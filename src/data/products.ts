import type { Product } from '../types';

export const products: Product[] = [
  {
    id: "insleep",
    name: "inSleep",
    type: "Téléconsultation",
    tagline: "Bien dormir, cela s'apprend, Mal dormir cela se soigne",
    description: "Spécialiste de la prévention des risques liés à la fatigue et à la somnolence en entreprise. Propose une évaluation complète, des formations sur site ou en ligne, ainsi qu'un diagnostic et un contrôle professionnel des troubles du sommeil pour améliorer la santé et la performance des collaborateurs.",
    url: "https://www.insleeplab.fr",
    logo: "/logos/insleeplab.png",
    tags: ["professionnel", "téléconsultation", "prévention", "éducation", "entreprise", "formation", "bien-être"],
    audience: ["adult"],
    problemsSolved: ["sleep"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Abonnement, à la séance, sur devis (entreprises). Remboursable par la Sécurité Sociale"
    },
    lastUpdated: "2025-11-04"
  },
  {
    id: "ifeel",
    name: "ifeel",
    type: "Plateforme entreprise",
    tagline: "La solution incontournable en santé mentale pour les entreprises.",
    description: "Solution de référence en santé mentale au travail qui accompagne les entreprises et leurs collaborateurs. Aide à réduire l'absentéisme et instaure un climat de travail positif et durable grâce à une approche alliant innovation, expertise clinique et partenariats stratégiques.",
    url: "https://ifeelonline.com/fr/",
    logo: "/logos/ifeel.png",
    tags: ["professionnel", "téléconsultation", "prévention", "bien-être", "éducation", "entreprise", "formation", "accompagnement", "urgent"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis (entreprises). Certifications: HIPAA, ISO 27001, GDPR"
    },
    lastUpdated: "2025-11-04"
  },
  {
    id: "wetalk",
    name: "We talk",
    type: "Téléconsultation",
    tagline: "Partenaire pour le bien être mental de vos collaborateurs",
    description: "Plateforme complète de téléconsultation psychologique pour les entreprises et les particuliers. Offre un accompagnement efficace et personnalisé avec analyse d'impact, accessible 24/7 pour soutenir la santé mentale des collaborateurs face au burn-out, anxiété, dépression et troubles du sommeil.",
    url: "https://www.wetalk.life",
    logo: "/logos/wetalk.png",
    tags: ["professionnel", "téléconsultation", "prévention", "bien-être", "éducation", "entreprise", "formation", "accompagnement", "urgent"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      amount: "à partir de 4€",
      details: "Sur mesure. Essai gratuit bilan émotionnel. Abonnement, à la séance, sur devis (entreprises)"
    },
    lastUpdated: "2025-11-04"
  },
  {
    id: "pleinia",
    name: "Pleinia",
    type: "Plateforme entreprise",
    tagline: "Donner aux salariés les clés pour agir sur leur santé mentale",
    description: "Plateforme qui donne aux salariés les clés pour agir sur leur santé mentale grâce à une approche globale. Propose des contenus digitaux, bilans complets, parcours accompagnés par des coachs, défis collectifs et ateliers interactifs pour développer les comportements et soft skills favorables au bien-être.",
    url: "https://www.pleinia.com",
    logo: "/logos/pleinia.png",
    tags: ["prévention", "bien-être", "entreprise", "formation", "accompagnement"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "work", "sleep"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis (entreprises)"
    },
    lastUpdated: "2025-11-05"
  },
  {
    id: "kwit",
    name: "Kwit",
    type: "Application",
    tagline: "Arrêtez de fumer et restez non fumer pour de bon",
    description: "Application mobile de sevrage tabagique validée par l'OMS qui combine TCC et gamification. Accompagne 5 millions d'utilisateurs de manière bienveillante avec suivi de progression, gestion des envies, groupes de soutien et contenu éducatif. Affiche un taux de réussite de 68% à 3 mois.",
    url: "https://kwit.app",
    logo: "/logos/kwit.png",
    tags: ["addiction", "tabac", "sevrage", "autonomie", "éducation", "prévention", "bien-être"],
    audience: ["adult", "young"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: false,
    pricing: {
      model: "freemium",
      amount: "60€/an",
      details: "3 jours d'essai gratuit. Validée par l'OMS"
    },
    lastUpdated: "2025-11-05"
  },
  {
    id: "sobero",
    name: "Sobero",
    type: "Application",
    tagline: "Reprenez le pouvoir sur votre consommation d'alcool, en toute conscience et bienveillance.",
    description: "Application mobile qui aide à développer une relation plus saine avec l'alcool, basée sur les TCC et le mouvement Sober Curious. Propose un accompagnement anonyme et bienveillant avec suivi de consommation, exercices de journaling et contenu éducatif. Plus de 60 000 utilisateurs en France.",
    url: "https://sobero.app",
    logo: "/logos/sobero.png",
    tags: ["addiction", "alcool", "sevrage", "autonomie", "éducation", "prévention", "bien-être"],
    audience: ["adult", "young"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: false,
    pricing: {
      model: "subscription",
      amount: "60€/an",
      details: "7 jours d'essai gratuits"
    },
    lastUpdated: "2025-11-05"
  },
  {
    id: "letstolk",
    name: "Let's Tolk",
    type: "Téléconsultation",
    tagline: "Les psychologues en ligne",
    description: "Cabinet digital de psychologues en ligne disponibles 7j/7 en moins de 24h. Accompagnement humain, professionnel et attentif en visio pour burn-out, anxiété, dépression, troubles du sommeil et addictions. Psychologues enregistrés à l'ARS avec possibilité de remboursement mutuelle.",
    url: "https://www.letstolk.com/",
    logo: "/logos/letstolk.svg",
    tags: ["professionnel", "téléconsultation", "prévention", "urgent"],
    audience: ["adult", "young", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now"],
    forCompany: false,
    pricing: {
      model: "per-session",
      amount: "à partir de 28€",
      details: "Remboursement par la mutuelle selon contrat. Psychologues enregistrés à l'ARS"
    },
    lastUpdated: "2025-11-05"
  },
  {
    id: "eos",
    name: "Eos",
    type: "Téléconsultation",
    tagline: "Une solution de santé numérique pour consolider l'abstinence en alcool et tabac",
    description: "Première clinique digitale dédiée à l'addictologie en France avec dispositif médical numérique certifié. Propose téléconsultations, application mobile et programme thérapeutique complet pour l'alcool et le tabac. Remboursable par la Sécurité Sociale avec agrément STC.",
    url: "https://www.eos-care.com",
    logo: "/logos/eos.png",
    tags: ["professionnel", "téléconsultation", "addiction", "alcool", "tabac", "sevrage", "éducation", "autonomie"],
    audience: ["adult"],
    problemsSolved: ["addiction"],
    preferenceMatch: ["talk-now", "autonomous", "understand", "program"],
    forCompany: false,
    pricing: {
      model: "freemium",
      details: "Consultations au tarif opposable. Remboursement Sécurité Sociale, Tiers Payant. Abonnement mensuel pour programme thérapeutique. Agrément STC jalon 3"
    },
    lastUpdated: "2025-11-07"
  },
  {
    id: "holicare",
    name: "Holicare",
    type: "Plateforme entreprise",
    tagline: "La santé mentale au travail est une science.",
    description: "Plateforme de santé mentale au travail basée sur une expertise scientifique et une approche humaine. Combine détection précoce avec l'Holitest, formations certifiées Qualiopi et parcours de soins pluridisciplinaires de 3 à 9 mois. 90% de réduction des symptômes anxio-dépressifs démontrée.",
    url: "https://www.holicare.com/",
    logo: "/logos/holicare.svg",
    tags: ["professionnel", "téléconsultation", "prévention", "bien-être", "entreprise", "formation", "accompagnement", "urgent"],
    audience: ["adult", "young", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "addiction", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now", "understand", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      details: "Certifié Qualiopi. Approche holistique validée scientifiquement avec 90% de réduction des symptômes anxio-dépressifs"
    },
    lastUpdated: "2025-11-10"
  },
  {
    id: "feel",
    name: "Feel",
    type: "Application",
    tagline: "Feel est une application qui aide à soigner la dépression en 3 à 6 mois.",
    description: "Application qui aide à soigner la dépression en 3 à 6 mois basée sur la thérapie cognitivo-comportementale. Accompagne les utilisateurs pour modifier leurs comportements et maîtriser leurs pensées négatives avec des exercices pratiques, outils TCC et contenu de psychoéducation. Disponible 24/7.",
    url: "https://feelapp.care/",
    logo: "/logos/feel.png",
    tags: ["autonomie", "éducation", "prévention", "bien-être", "urgent"],
    audience: ["adult", "senior", "parent"],
    problemsSolved: ["sadness"],
    preferenceMatch: ["autonomous", "understand", "program"],
    forCompany: false,
    pricing: {
      model: "freemium",
      amount: "29,99€ pour 6 mois",
      details: "15 jours d'essai. Psychoéducation gratuite. Pré-étude clinique avec résultats encourageants"
    },
    lastUpdated: "2025-11-12"
  },
  {
    id: "neuredia",
    name: "Neuredia",
    type: "Gestion administrative",
    tagline: "La gestion administrative des neuro-atypiques",
    description: "Première plateforme qui centralise et simplifie la gestion administrative des familles d'enfants neuroatypiques. Offre un parcours guidé et sur mesure pour garantir l'accès à tous les droits et coordonner le parcours de soin. Moteur IA propriétaire pour recycler les données entre démarches.",
    url: "https://neuredia.fr",
    logo: "/logos/neuredia.png",
    tags: ["autonomie"],
    audience: ["child", "young", "parent"],
    problemsSolved: ["stress-anxiety"],
    preferenceMatch: ["autonomous", "program"],
    forCompany: false,
    pricing: {
      model: "freemium",
      amount: "150€ année 1 puis 9,99€/mois",
      details: "Accès freemium aux fonctionnalités de base"
    },
    lastUpdated: "2025-11-15"
  },
  {
    id: "hypnovr",
    name: "HypnoVR",
    type: "Réalité virtuelle",
    tagline: "Améliorer son parcours de soin grâce à son cerveau !",
    description: "Thérapies digitales certifiées en réalité virtuelle pour la santé mentale. Propose des séances d'hypnose immersives pour gérer le stress, l'anxiété, les troubles du sommeil et la douleur. Plus de 600 hôpitaux et cliniques équipés avec 35+ études cliniques validant l'efficacité.",
    url: "https://hypnovr.io/",
    logo: "/logos/hypnovr.png",
    tags: ["bien-être", "entreprise"],
    audience: ["adult", "young", "child", "senior"],
    problemsSolved: ["stress-anxiety", "work", "sleep"],
    preferenceMatch: ["autonomous", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      details: "Abonnement sans engagement, possibilité d'essai gratuit pour établissements de santé. Dispositif médical certifié, plus de 35 études cliniques"
    },
    lastUpdated: "2025-11-17"
  },
  {
    id: "lyynk",
    name: "Lyynk",
    type: "Application",
    tagline: "Améliorer la santé mentale des jeunes",
    description: "Application gratuite pour les jeunes offrant une safe place et des outils pour gérer leur santé mentale. Propose également un accès pour les adultes de confiance afin de renforcer le lien intergénérationnel. Contient des exercices de bien-être, méditation et suivi émotionnel.",
    url: "https://www.lyynk.com",
    logo: "/logos/lyynk.png",
    tags: ["autonomie", "prévention", "bien-être", "enfants"],
    audience: ["young", "parent"],
    problemsSolved: ["stress-anxiety", "sadness"],
    preferenceMatch: ["autonomous", "understand"],
    forCompany: false,
    pricing: {
      model: "freemium",
      amount: "7,99€/mois pour parents",
      details: "Application gratuite pour les jeunes. 30 jours d'essai pour les parents"
    },
    lastUpdated: "2025-11-18"
  },
  {
    id: "qare",
    name: "Qare",
    type: "Téléconsultation",
    tagline: "Téléconsultation médicale en ligne 7j/7",
    description: "Service de téléconsultation avec psychiatres et psychologues disponibles 7 jours sur 7, de 6h à minuit. Consultations remboursables par l'Assurance Maladie pour un accès rapide et facile aux professionnels de santé mentale.",
    url: "https://www.qare.fr",
    logo: "/logos/qare.png",
    tags: ["professionnel", "téléconsultation", "urgent", "accessible"],
    audience: ["adult", "young", "senior", "parent"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "work", "sleep"],
    preferenceMatch: ["talk-now"],
    forCompany: false,
    pricing: {
      model: "per-session",
      details: "Remboursable par l'Assurance Maladie"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "petitbambou",
    name: "Petit BamBou",
    type: "Application",
    tagline: "Application de méditation guidée pour réduire le stress",
    description: "Application mobile de méditation guidée proposant des centaines de programmes audio pour réduire le stress, améliorer le sommeil et développer la pleine conscience. Approche accessible pour tous les niveaux avec sessions de 3 à 20 minutes.",
    url: "https://www.petitbambou.com",
    logo: "/logos/petitbambou.png",
    tags: ["méditation", "autonomie", "bien-être", "prévention", "éducation"],
    audience: ["adult", "young", "senior"],
    problemsSolved: ["stress-anxiety", "sleep"],
    preferenceMatch: ["autonomous", "understand", "program"],
    forCompany: false,
    pricing: {
      model: "freemium",
      details: "Version gratuite avec programmes de base + abonnement premium pour contenus avancés"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "mokacare",
    name: "moka.care",
    type: "Plateforme entreprise",
    tagline: "Plateforme de santé mentale pour accompagner les salariés",
    description: "Solution complète de santé mentale en entreprise proposant un accompagnement par psychologues, thérapeutes et coachs. Présente dans 320+ entreprises et 20 pays, offre un support en 25 langues pour prendre soin du bien-être mental des collaborateurs.",
    url: "https://www.moka.care",
    logo: "/logos/mokacare.png",
    tags: ["professionnel", "entreprise", "téléconsultation", "prévention", "accompagnement", "bien-être"],
    audience: ["adult"],
    problemsSolved: ["work", "stress-anxiety", "sadness"],
    preferenceMatch: ["talk-now", "program", "understand"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Sur devis pour entreprises"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "edra",
    name: "EDRA",
    type: "Télésurveillance",
    tagline: "Télésurveillance psychiatrique des troubles de l'humeur",
    description: "Dispositif médical certifié de télésurveillance en psychiatrie pour le suivi personnalisé des patients adultes avec troubles psychiatriques sous traitement médicamenteux. Solution professionnelle destinée aux établissements de santé.",
    url: "https://www.edra.care",
    logo: "/logos/edra.png",
    tags: ["professionnel", "téléconsultation", "psychiatrie", "médical", "accompagnement"],
    audience: ["adult"],
    problemsSolved: ["sadness", "stress-anxiety"],
    preferenceMatch: ["talk-now", "program"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Dispositif médical professionnel pour établissements de santé. Marquage CE 0459"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "suricog",
    name: "Suricog",
    type: "Medtech",
    tagline: "Diagnostic médical par oculométrie eye-tracking",
    description: "Technologie innovante d'eye-tracking médical pour quantifier et diagnostiquer les troubles cérébraux en pratique clinique. Dispositif professionnel destiné aux neurologues et praticiens pour l'évaluation objective des fonctions cognitives.",
    url: "https://www.suricog.fr",
    logo: "/logos/suricog.png",
    tags: ["professionnel", "médical", "diagnostic", "neurologie", "innovation"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety"],
    preferenceMatch: ["understand"],
    forCompany: true,
    pricing: {
      model: "enterprise",
      details: "Dispositif médical professionnel pour établissements de santé"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "tuki",
    name: "Tuki",
    type: "Application",
    tagline: "Application d'entraide entre pairs en ligne et anonyme",
    description: "Application francophone de soutien par les pairs proposant des groupes de parole modérés pour divers troubles psychologiques et défis de vie. Espace sécurisé et anonyme pour échanger avec des personnes vivant des situations similaires.",
    url: "https://www.wearetuki.com",
    logo: "/logos/tuki.png",
    tags: ["entraide", "communauté", "prévention", "bien-être", "autonomie"],
    audience: ["adult", "young"],
    problemsSolved: ["stress-anxiety", "sadness", "trauma", "addiction"],
    preferenceMatch: ["talk-now", "understand", "autonomous"],
    forCompany: false,
    pricing: {
      model: "freemium",
      details: "Accès gratuit aux groupes de base avec contenu premium optionnel"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "lislup",
    name: "Lisl Up",
    type: "Plateforme entreprise",
    tagline: "Plateforme santé mentale accessible 24/7 pour entreprises",
    description: "Solution tout-en-un pour entreprises proposant évaluation psychologique, cours de bien-être, coaching personnalisé, chat d'urgence 24/7 et baromètre annuel. Accompagnement complet adapté selon la taille de l'entreprise (<250 ou >250 employés).",
    url: "https://www.lislup.com",
    logo: "/logos/lislup.png",
    tags: ["professionnel", "entreprise", "téléconsultation", "coaching", "urgent", "bien-être", "accompagnement"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "work", "sleep"],
    preferenceMatch: ["talk-now", "autonomous", "program"],
    forCompany: true,
    pricing: {
      model: "subscription",
      details: "Abonnement modulé selon taille entreprise (<250 ou >250 employés)"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "mindday",
    name: "mindDay",
    type: "Application",
    tagline: "Application de thérapie TCC accessible à tous",
    description: "Application mobile de thérapie cognitive et comportementale proposant des programmes vidéo structurés de 14 à 30 jours, complétés par des méditations guidées et sessions d'auto-hypnose. Approche scientifique pour gérer stress, anxiété et améliorer le bien-être.",
    url: "https://www.mindday.com",
    logo: "/logos/mindday.png",
    tags: ["autonomie", "éducation", "prévention", "bien-être", "méditation"],
    audience: ["adult"],
    problemsSolved: ["stress-anxiety", "sadness", "work", "sleep"],
    preferenceMatch: ["autonomous", "program", "understand"],
    forCompany: false,
    pricing: {
      model: "subscription",
      details: "Essai gratuit 7 jours puis abonnement mensuel ou annuel"
    },
    lastUpdated: "2025-11-20"
  },
  {
    id: "koalou",
    name: "Koalou",
    type: "Application",
    tagline: "Première psychothérapie digitale française pour enfants",
    description: "Solution de psychothérapie digitale spécialisée pour enfants de 3 à 10 ans avec programmes adaptés pour gérer le stress, l'anxiété, les troubles de l'attention (TDAH), les phobies et autres difficultés émotionnelles. Destiné aux professionnels de santé et parents.",
    url: "https://www.koalou.com",
    logo: "/logos/koalou.png",
    tags: ["professionnel", "enfants", "accompagnement", "éducation", "prévention"],
    audience: ["child", "parent"],
    problemsSolved: ["stress-anxiety"],
    preferenceMatch: ["program", "understand"],
    forCompany: false,
    pricing: {
      model: "custom",
      details: "Démo sur demande - destiné aux professionnels de santé et parents"
    },
    lastUpdated: "2025-11-20"
  },
];

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
