export interface ProtocolQuestion {
  id: string;
  type: 'url' | 'text' | 'checkbox' | 'select' | 'email' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  condition?: { id: string; value: boolean | string };
  helpText?: string;
  options?: { value: string; label: string }[];
}

export interface ProtocolSubCriterion {
  id: string;
  title: string;
  description: string;
  scoreMax: number;
  questions: ProtocolQuestion[];
}

export interface ProtocolPillar {
  id: string;
  title: string;
  icon: string;
  subCriteria: ProtocolSubCriterion[];
}

export const protocolPillars: ProtocolPillar[] = [
  {
    id: "1",
    title: "Sécurité",
    icon: "lock",
    subCriteria: [
      {
        id: "1.1",
        title: "Politique de confidentialité (RGPD)",
        description: "Évalue la protection des données personnelles et la conformité RGPD.",
        scoreMax: 4,
        questions: [
          { id: "privacy_url", type: "url", label: "URL de votre politique de confidentialité", required: true, placeholder: "https://votre-site.fr/confidentialite" },
          { id: "has_legal_basis", type: "checkbox", label: "Mentionne la base légale du traitement (consentement, intérêt légitime...)" },
          { id: "has_user_rights", type: "checkbox", label: "Mentionne les droits des utilisateurs (accès, rectification, suppression)" },
          { id: "has_retention", type: "checkbox", label: "Précise la durée de conservation des données" },
          { id: "has_dpo", type: "checkbox", label: "Un DPO (Délégué à la Protection des Données) est nommé" },
          { id: "dpo_name", type: "text", label: "Nom du DPO", condition: { id: "has_dpo", value: true }, placeholder: "Prénom Nom" },
        ]
      },
      {
        id: "1.2",
        title: "Hébergement des données",
        description: "Localisation et certification de l'hébergement.",
        scoreMax: 4,
        questions: [
          { id: "hosting_country", type: "text", label: "Pays d'hébergement des données", required: true, placeholder: "France" },
          { id: "hosting_provider", type: "text", label: "Nom de l'hébergeur", required: true, placeholder: "OVH, AWS Paris, etc." },
          { id: "is_hds", type: "checkbox", label: "L'hébergeur est certifié HDS (Hébergeur de Données de Santé)" },
          { id: "hds_url", type: "url", label: "URL de la certification HDS", condition: { id: "is_hds", value: true }, placeholder: "https://..." },
        ]
      },
      {
        id: "1.3",
        title: "Chiffrement",
        description: "HTTPS et chiffrement des données au repos.",
        scoreMax: 4,
        questions: [
          { id: "site_url", type: "url", label: "URL de votre site (pour vérifier HTTPS)", required: true },
          { id: "has_encryption_at_rest", type: "checkbox", label: "Les données sont chiffrées au repos" },
          { id: "encryption_tech", type: "text", label: "Technologie de chiffrement utilisée", condition: { id: "has_encryption_at_rest", value: true }, placeholder: "AES-256" },
          { id: "encryption_url", type: "url", label: "URL mentionnant le chiffrement", condition: { id: "has_encryption_at_rest", value: true } },
        ]
      },
      {
        id: "1.4",
        title: "Gestion des cookies et consentement",
        description: "Conformité du bandeau cookies et des trackers.",
        scoreMax: 4,
        questions: [
          { id: "cookie_policy", type: "select", label: "Gestion du consentement aux cookies", required: true, helpText: "Choisissez la situation qui correspond le mieux à votre solution", options: [
            { value: "no_trackers", label: "Aucun tracker / cookie non essentiel" },
            { value: "banner_with_refuse", label: "Bandeau avec option de refus" },
            { value: "banner_no_refuse", label: "Bandeau sans option de refus" },
            { value: "no_banner", label: "Pas de bandeau cookies" },
          ] },
          { id: "cookie_details", type: "text", label: "Décrivez votre bandeau cookies et les trackers utilisés", placeholder: "Ex: Bandeau Axeptio, Google Analytics avec opt-in..." },
          { id: "site_url_cookies", type: "url", label: "URL de votre site (l'admin testera les cookies)" },
        ]
      },
      {
        id: "1.5",
        title: "Droit à l'effacement",
        description: "Facilité de suppression du compte et des données.",
        scoreMax: 4,
        questions: [
          { id: "deletion_method", type: "select", label: "Comment un utilisateur peut-il supprimer son compte ?", required: true, options: [
            { value: "one_click", label: "Suppression en un clic dans l'interface" },
            { value: "self_service", label: "Suppression en libre-service (quelques étapes)" },
            { value: "documented", label: "Procédure documentée" },
            { value: "email_only", label: "Uniquement par email" },
            { value: "not_available", label: "Non disponible" },
          ] },
          { id: "deletion_url", type: "url", label: "URL de la page de suppression ou de la documentation", condition: { id: "deletion_method", value: "self_service" } },
          { id: "deletion_details", type: "text", label: "Décrivez la procédure de suppression", placeholder: "Ex: Paramètres > Compte > Supprimer mon compte. Données effacées sous 30 jours." },
        ]
      },
    ]
  },
  {
    id: "2",
    title: "Preuves",
    icon: "microscope",
    subCriteria: [
      {
        id: "2.1",
        title: "Base scientifique",
        description: "Fondements thérapeutiques et supervision scientifique.",
        scoreMax: 5,
        questions: [
          { id: "therapeutic_approach", type: "text", label: "Sur quelle(s) approche(s) thérapeutique(s) votre solution est-elle fondée ?", required: true, placeholder: "Ex: TCC, ACT, EMDR, pleine conscience..." },
          { id: "approach_url", type: "url", label: "URL de la page de votre site décrivant cette approche", required: true },
          { id: "has_scientific_committee", type: "checkbox", label: "Vous avez un comité scientifique ou médical formellement constitué" },
          { id: "committee_members", type: "text", label: "Noms et titres des membres du comité", condition: { id: "has_scientific_committee", value: true }, placeholder: "Dr. Marie Dupont, psychiatre - Pr. Jean Martin, psychologue clinicien" },
          { id: "committee_url", type: "url", label: "URL de la page présentant l'équipe ou le comité", condition: { id: "has_scientific_committee", value: true } },
        ]
      },
      {
        id: "2.2",
        title: "Études cliniques publiées",
        description: "Publications scientifiques validant l'efficacité.",
        scoreMax: 5,
        questions: [
          { id: "study_level", type: "select", label: "Niveau de preuve clinique disponible", required: true, options: [
            { value: "rct_meta", label: "Méta-analyse ou essais contrôlés randomisés multiples" },
            { value: "rct", label: "Essai contrôlé randomisé (RCT)" },
            { value: "peer_reviewed", label: "Étude publiée dans un journal à comité de lecture" },
            { value: "published", label: "Étude publiée (non revue par les pairs)" },
            { value: "internal", label: "Étude interne uniquement" },
            { value: "none", label: "Aucune étude disponible" },
          ] },
          { id: "study_references", type: "text", label: "Références des études (DOI, URLs PubMed, titres...)", placeholder: "DOI: 10.1234/... - https://pubmed.ncbi.nlm.nih.gov/..." },
        ]
      },
      {
        id: "2.3",
        title: "Supervision professionnelle",
        description: "Implication de professionnels de santé qualifiés.",
        scoreMax: 5,
        questions: [
          { id: "has_professionals", type: "checkbox", label: "Des professionnels de santé sont impliqués dans votre solution" },
          { id: "professionals_details", type: "text", label: "Noms, titres et rôles des professionnels impliqués", condition: { id: "has_professionals", value: true }, placeholder: "Dr. Sophie Bernard, psychiatre, superviseure clinique" },
          { id: "team_url", type: "url", label: "URL de la page équipe", condition: { id: "has_professionals", value: true } },
        ]
      },
      {
        id: "2.4",
        title: "Résultats mesurables",
        description: "Données d'impact et résultats cliniques documentés.",
        scoreMax: 5,
        questions: [
          { id: "results_level", type: "select", label: "Type de résultats disponibles", required: true, options: [
            { value: "longitudinal", label: "Résultats longitudinaux (suivi sur plusieurs mois)" },
            { value: "clinical_outcomes", label: "Résultats cliniques mesurés (échelles validées)" },
            { value: "satisfaction", label: "Enquête de satisfaction structurée" },
            { value: "usage_metrics", label: "Métriques d'usage uniquement" },
            { value: "testimonials", label: "Témoignages uniquement" },
            { value: "none", label: "Aucun résultat disponible" },
          ] },
          { id: "results_details", type: "text", label: "Décrivez vos résultats (chiffres, taille d'échantillon, méthode de mesure)", placeholder: "Ex: 87% de satisfaction (n=1200), réduction de 35% des symptômes d'anxiété sur PHQ-9 (n=450, 3 mois)" },
          { id: "results_url", type: "url", label: "URL ou document présentant ces résultats" },
        ]
      },
    ]
  },
  {
    id: "3",
    title: "Accessibilité",
    icon: "accessibility",
    subCriteria: [
      {
        id: "3.1",
        title: "Prix et accessibilité financière",
        description: "Transparence tarifaire et offres inclusives.",
        scoreMax: 4,
        questions: [
          { id: "pricing_url", type: "url", label: "URL de votre page tarification", required: true },
          { id: "has_free_tier", type: "checkbox", label: "Version gratuite réellement utilisable disponible" },
          { id: "has_free_trial", type: "checkbox", label: "Essai gratuit disponible" },
          { id: "free_trial_duration", type: "text", label: "Durée de l'essai gratuit", condition: { id: "has_free_trial", value: true }, placeholder: "14 jours" },
          { id: "has_solidarity_pricing", type: "checkbox", label: "Tarif solidaire disponible (CMU, étudiants, demandeurs d'emploi)" },
          { id: "solidarity_details", type: "text", label: "Conditions du tarif solidaire", condition: { id: "has_solidarity_pricing", value: true } },
        ]
      },
      {
        id: "3.2",
        title: "Plateformes disponibles",
        description: "Multi-support et accessibilité technique.",
        scoreMax: 4,
        questions: [
          { id: "has_web", type: "checkbox", label: "Disponible sur Web" },
          { id: "web_url", type: "url", label: "URL de l'application web", condition: { id: "has_web", value: true } },
          { id: "has_ios", type: "checkbox", label: "Disponible sur iOS" },
          { id: "ios_url", type: "url", label: "URL App Store", condition: { id: "has_ios", value: true } },
          { id: "has_android", type: "checkbox", label: "Disponible sur Android" },
          { id: "android_url", type: "url", label: "URL Google Play", condition: { id: "has_android", value: true } },
          { id: "is_native_app", type: "checkbox", label: "L'application mobile est native (pas un wrapper web)" },
        ]
      },
      {
        id: "3.3",
        title: "Langue française",
        description: "Disponibilité complète en français.",
        scoreMax: 4,
        questions: [
          { id: "french_level", type: "select", label: "Disponibilité en français", required: true, options: [
            { value: "full_localized", label: "Entièrement localisé (contenu + interface + support)" },
            { value: "full_content", label: "Interface et contenu principal en français" },
            { value: "full_interface", label: "Interface en français, contenu partiellement" },
            { value: "partial_interface", label: "Interface partiellement en français" },
            { value: "english_only", label: "Anglais uniquement" },
          ] },
          { id: "french_support", type: "checkbox", label: "Le support client répond en français" },
        ]
      },
      {
        id: "3.4",
        title: "Accessibilité numérique (handicap)",
        description: "Conformité WCAG et accessibilité pour tous.",
        scoreMax: 4,
        questions: [
          { id: "accessibility_level", type: "select", label: "Niveau d'accessibilité numérique", required: true, options: [
            { value: "wcag_certified", label: "Certifié WCAG AA (audit externe)" },
            { value: "wcag_aa", label: "Conforme WCAG AA (auto-évaluation)" },
            { value: "keyboard_nav", label: "Navigation au clavier fonctionnelle" },
            { value: "basic", label: "Accessibilité basique" },
            { value: "not_evaluated", label: "Non évalué" },
          ] },
          { id: "accessibility_url", type: "url", label: "URL de la déclaration d'accessibilité ou du rapport d'audit" },
        ]
      },
      {
        id: "3.5",
        title: "Autonomie et prise en main",
        description: "Facilité de démarrage sans assistance.",
        scoreMax: 4,
        questions: [
          { id: "onboarding_steps", type: "number", label: "Nombre d'étapes pour accéder à la première valeur du service", placeholder: "3" },
          { id: "onboarding_description", type: "text", label: "Décrivez le parcours d'onboarding", placeholder: "Inscription > Questionnaire initial > Accès au programme personnalisé" },
          { id: "has_guided_onboarding", type: "checkbox", label: "Un onboarding guidé (tutoriel, aide contextuelle) est proposé" },
        ]
      },
    ]
  },
  {
    id: "4",
    title: "Expérience user",
    icon: "palette",
    subCriteria: [
      {
        id: "4.1",
        title: "Design visuel",
        description: "Qualité et adaptation au contexte de santé mentale.",
        scoreMax: 4,
        questions: [
          { id: "homepage_url", type: "url", label: "URL de votre page d'accueil (l'admin évaluera visuellement)", required: true },
          { id: "design_adapted", type: "checkbox", label: "Le design a été conçu spécifiquement pour un public en situation de fragilité psychologique" },
          { id: "design_details", type: "text", label: "Décrivez les choix de design adaptés à votre audience", placeholder: "Palette apaisante, pas de notifications intrusives, ton empathique, etc." },
        ]
      },
      {
        id: "4.2",
        title: "Navigation et parcours",
        description: "Clarté du chemin vers la fonctionnalité principale.",
        scoreMax: 4,
        questions: [
          { id: "nav_clicks", type: "number", label: "Nombre de clics depuis la page d'accueil jusqu'à la fonctionnalité principale", placeholder: "2" },
          { id: "nav_path", type: "text", label: "Décrivez ce chemin", placeholder: "Page d'accueil > Bouton 'Commencer' > Questionnaire initial" },
        ]
      },
      {
        id: "4.3",
        title: "Performance",
        description: "Temps de chargement et fiabilité.",
        scoreMax: 4,
        questions: [
          { id: "main_url_perf", type: "url", label: "URL de votre page principale (l'admin mesurera avec PageSpeed)", required: true },
          { id: "has_lighthouse_score", type: "checkbox", label: "Vous avez mesuré votre score Lighthouse Performance" },
          { id: "lighthouse_score", type: "number", label: "Score Lighthouse Performance (0-100)", condition: { id: "has_lighthouse_score", value: true }, placeholder: "85" },
        ]
      },
      {
        id: "4.4",
        title: "Qualité rédactionnelle",
        description: "Ton, clarté et expertise du contenu.",
        scoreMax: 4,
        questions: [
          { id: "content_authors", type: "text", label: "Qui rédige le contenu éditorial ?", required: true, placeholder: "Équipe interne de psychologues, rédacteurs spécialisés en santé mentale" },
          { id: "content_reviewed", type: "checkbox", label: "Le contenu est relu et validé par des professionnels de santé" },
          { id: "content_reviewer", type: "text", label: "Par qui ?", condition: { id: "content_reviewed", value: true }, placeholder: "Dr. Marie Dupont, psychiatre" },
        ]
      },
      {
        id: "4.5",
        title: "Expérience mobile",
        description: "Qualité de l'expérience sur smartphone.",
        scoreMax: 4,
        questions: [
          { id: "mobile_url", type: "url", label: "URL de votre site (l'admin testera en responsive)", required: true },
          { id: "has_native_mobile", type: "checkbox", label: "Vous avez une application mobile native (pas un simple site responsive)" },
          { id: "native_ios_url", type: "url", label: "URL App Store", condition: { id: "has_native_mobile", value: true } },
          { id: "native_android_url", type: "url", label: "URL Google Play", condition: { id: "has_native_mobile", value: true } },
        ]
      },
    ]
  },
  {
    id: "5",
    title: "Support",
    icon: "handshake",
    subCriteria: [
      {
        id: "5.1",
        title: "Réactivité du support",
        description: "Temps de réponse réel (l'admin enverra un message test).",
        scoreMax: 4,
        questions: [
          { id: "contact_url", type: "url", label: "URL de votre page de contact", required: true },
          { id: "announced_response_time", type: "text", label: "Délai de réponse annoncé", placeholder: "24h ouvrées, réponse immédiate par chat" },
          { id: "support_hours", type: "text", label: "Horaires du support", placeholder: "Lundi-Vendredi 9h-18h" },
        ]
      },
      {
        id: "5.2",
        title: "Canaux de contact",
        description: "Diversité et accessibilité des moyens de contact.",
        scoreMax: 4,
        questions: [
          { id: "has_contact_form", type: "checkbox", label: "Formulaire de contact" },
          { id: "contact_form_url", type: "url", label: "URL du formulaire", condition: { id: "has_contact_form", value: true } },
          { id: "has_email", type: "checkbox", label: "Email de support" },
          { id: "support_email", type: "email", label: "Adresse email de support", condition: { id: "has_email", value: true } },
          { id: "has_live_chat", type: "checkbox", label: "Chat en direct" },
          { id: "chat_url", type: "url", label: "URL du chat", condition: { id: "has_live_chat", value: true } },
          { id: "has_phone", type: "checkbox", label: "Téléphone" },
          { id: "phone_number", type: "text", label: "Numéro de téléphone", condition: { id: "has_phone", value: true } },
        ]
      },
      {
        id: "5.3",
        title: "Ressources et documentation",
        description: "FAQ, centre d'aide, guides disponibles.",
        scoreMax: 4,
        questions: [
          { id: "help_level", type: "select", label: "Niveau de documentation disponible", required: true, options: [
            { value: "full_resources", label: "Centre d'aide complet + tutoriels + guides" },
            { value: "help_center", label: "Centre d'aide structuré" },
            { value: "good_faq", label: "FAQ détaillée" },
            { value: "minimal_faq", label: "FAQ minimale" },
            { value: "none", label: "Aucune documentation" },
          ] },
          { id: "help_url", type: "url", label: "URL de votre FAQ ou centre d'aide" },
        ]
      },
      {
        id: "5.4",
        title: "Gestion de crise",
        description: "Protocole d'urgence et affichage des numéros d'aide.",
        scoreMax: 4,
        questions: [
          { id: "crisis_numbers_display", type: "select", label: "Où les numéros d'urgence (3114, 15) sont-ils affichés ?", required: true, options: [
            { value: "proactive", label: "Affichage proactif (détection de situation de crise)" },
            { value: "interface_visible", label: "Visible en permanence dans l'interface" },
            { value: "footer", label: "Dans le pied de page" },
            { value: "cgu_only", label: "Dans les CGU uniquement" },
            { value: "nowhere", label: "Non affichés" },
          ] },
          { id: "crisis_detection", type: "checkbox", label: "L'interface détecte les messages ou signaux à risque pour rediriger vers l'aide" },
          { id: "crisis_detection_details", type: "text", label: "Décrivez le protocole de détection", condition: { id: "crisis_detection", value: true } },
          { id: "crisis_url", type: "url", label: "URL ou capture montrant l'affichage des numéros d'urgence" },
        ]
      },
      {
        id: "5.5",
        title: "Dimension communautaire",
        description: "Entraide entre pairs et modération professionnelle.",
        scoreMax: 4,
        questions: [
          { id: "community_level", type: "select", label: "Dimension communautaire proposée", required: true, options: [
            { value: "pro_moderated", label: "Communauté modérée par des professionnels" },
            { value: "active_community", label: "Communauté active avec modération" },
            { value: "forum", label: "Forum ou espace d'échange" },
            { value: "social_media", label: "Réseaux sociaux uniquement" },
            { value: "none", label: "Aucune dimension communautaire" },
          ] },
          { id: "community_url", type: "url", label: "URL de votre communauté ou forum" },
          { id: "community_moderators", type: "text", label: "Noms des modérateurs professionnels", condition: { id: "community_level", value: "pro_moderated" } },
        ]
      },
    ]
  },
];

export const allSubCriteria = protocolPillars.flatMap(p => p.subCriteria);

export function getAnswer(protocolAnswers: Record<string, Record<string, unknown>>, criterionId: string): Record<string, unknown> {
  return protocolAnswers[criterionId] ?? {};
}
