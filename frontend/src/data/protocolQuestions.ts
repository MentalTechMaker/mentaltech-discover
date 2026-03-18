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
    title: "Securite & Confidentialite",
    icon: "lock",
    subCriteria: [
      {
        id: "1.1",
        title: "Politique de confidentialite (RGPD)",
        description: "Evalue la protection des donnees personnelles et la conformite RGPD.",
        scoreMax: 4,
        questions: [
          { id: "privacy_url", type: "url", label: "URL de votre politique de confidentialite", required: true, placeholder: "https://votre-site.fr/confidentialite" },
          { id: "has_legal_basis", type: "checkbox", label: "Mentionne la base legale du traitement (consentement, interet legitime...)" },
          { id: "has_user_rights", type: "checkbox", label: "Mentionne les droits des utilisateurs (acces, rectification, suppression)" },
          { id: "has_retention", type: "checkbox", label: "Precise la duree de conservation des donnees" },
          { id: "has_dpo", type: "checkbox", label: "Un DPO (Delegue a la Protection des Donnees) est nomme" },
          { id: "dpo_name", type: "text", label: "Nom du DPO", condition: { id: "has_dpo", value: true }, placeholder: "Prenom Nom" },
        ]
      },
      {
        id: "1.2",
        title: "Hebergement des donnees",
        description: "Localisation et certification de l'hebergement.",
        scoreMax: 4,
        questions: [
          { id: "hosting_country", type: "text", label: "Pays d'hebergement des donnees", required: true, placeholder: "France" },
          { id: "hosting_provider", type: "text", label: "Nom de l'hebergeur", required: true, placeholder: "OVH, AWS Paris, etc." },
          { id: "is_hds", type: "checkbox", label: "L'hebergeur est certifie HDS (Hebergeur de Donnees de Sante)" },
          { id: "hds_url", type: "url", label: "URL de la certification HDS", condition: { id: "is_hds", value: true }, placeholder: "https://..." },
        ]
      },
      {
        id: "1.3",
        title: "Chiffrement",
        description: "HTTPS et chiffrement des donnees au repos.",
        scoreMax: 4,
        questions: [
          { id: "site_url", type: "url", label: "URL de votre site (pour verifier HTTPS)", required: true },
          { id: "has_encryption_at_rest", type: "checkbox", label: "Les donnees sont chiffrees au repos" },
          { id: "encryption_tech", type: "text", label: "Technologie de chiffrement utilisee", condition: { id: "has_encryption_at_rest", value: true }, placeholder: "AES-256" },
          { id: "encryption_url", type: "url", label: "URL mentionnant le chiffrement", condition: { id: "has_encryption_at_rest", value: true } },
        ]
      },
      {
        id: "1.4",
        title: "Gestion des cookies et consentement",
        description: "Conformite du bandeau cookies et des trackers.",
        scoreMax: 4,
        questions: [
          { id: "cookie_policy", type: "select", label: "Gestion du consentement aux cookies", required: true, helpText: "Choisissez la situation qui correspond le mieux a votre solution", options: [
            { value: "no_trackers", label: "Aucun tracker / cookie non essentiel" },
            { value: "banner_with_refuse", label: "Bandeau avec option de refus" },
            { value: "banner_no_refuse", label: "Bandeau sans option de refus" },
            { value: "no_banner", label: "Pas de bandeau cookies" },
          ] },
          { id: "cookie_details", type: "text", label: "Decrivez votre bandeau cookies et les trackers utilises", placeholder: "Ex: Bandeau Axeptio, Google Analytics avec opt-in..." },
          { id: "site_url_cookies", type: "url", label: "URL de votre site (l'admin testera les cookies)" },
        ]
      },
      {
        id: "1.5",
        title: "Droit a l'effacement",
        description: "Facilite de suppression du compte et des donnees.",
        scoreMax: 4,
        questions: [
          { id: "deletion_method", type: "select", label: "Comment un utilisateur peut-il supprimer son compte ?", required: true, options: [
            { value: "one_click", label: "Suppression en un clic dans l'interface" },
            { value: "self_service", label: "Suppression en libre-service (quelques etapes)" },
            { value: "documented", label: "Procedure documentee" },
            { value: "email_only", label: "Uniquement par email" },
            { value: "not_available", label: "Non disponible" },
          ] },
          { id: "deletion_url", type: "url", label: "URL de la page de suppression ou de la documentation", condition: { id: "deletion_method", value: "self_service" } },
          { id: "deletion_details", type: "text", label: "Decrivez la procedure de suppression", placeholder: "Ex: Parametres > Compte > Supprimer mon compte. Donnees effacees sous 30 jours." },
        ]
      },
    ]
  },
  {
    id: "2",
    title: "Efficacite & Preuves cliniques",
    icon: "microscope",
    subCriteria: [
      {
        id: "2.1",
        title: "Base scientifique",
        description: "Fondements therapeutiques et supervision scientifique.",
        scoreMax: 5,
        questions: [
          { id: "therapeutic_approach", type: "text", label: "Sur quelle(s) approche(s) therapeutique(s) votre solution est-elle fondee ?", required: true, placeholder: "Ex: TCC, ACT, EMDR, pleine conscience..." },
          { id: "approach_url", type: "url", label: "URL de la page de votre site decrivant cette approche", required: true },
          { id: "has_scientific_committee", type: "checkbox", label: "Vous avez un comite scientifique ou medical formellement constitue" },
          { id: "committee_members", type: "text", label: "Noms et titres des membres du comite", condition: { id: "has_scientific_committee", value: true }, placeholder: "Dr. Marie Dupont, psychiatre -- Pr. Jean Martin, psychologue clinicien" },
          { id: "committee_url", type: "url", label: "URL de la page presentant l'equipe ou le comite", condition: { id: "has_scientific_committee", value: true } },
        ]
      },
      {
        id: "2.2",
        title: "Etudes cliniques publiees",
        description: "Publications scientifiques validant l'efficacite.",
        scoreMax: 5,
        questions: [
          { id: "study_level", type: "select", label: "Niveau de preuve clinique disponible", required: true, options: [
            { value: "rct_meta", label: "Meta-analyse ou essais controles randomises multiples" },
            { value: "rct", label: "Essai controle randomise (RCT)" },
            { value: "peer_reviewed", label: "Etude publiee dans un journal a comite de lecture" },
            { value: "published", label: "Etude publiee (non revue par les pairs)" },
            { value: "internal", label: "Etude interne uniquement" },
            { value: "none", label: "Aucune etude disponible" },
          ] },
          { id: "study_references", type: "text", label: "References des etudes (DOI, URLs PubMed, titres...)", placeholder: "DOI: 10.1234/... -- https://pubmed.ncbi.nlm.nih.gov/..." },
        ]
      },
      {
        id: "2.3",
        title: "Supervision professionnelle",
        description: "Implication de professionnels de sante qualifies.",
        scoreMax: 5,
        questions: [
          { id: "has_professionals", type: "checkbox", label: "Des professionnels de sante sont impliques dans votre solution" },
          { id: "professionals_details", type: "text", label: "Noms, titres et roles des professionnels impliques", condition: { id: "has_professionals", value: true }, placeholder: "Dr. Sophie Bernard, psychiatre, superviseure clinique" },
          { id: "team_url", type: "url", label: "URL de la page equipe", condition: { id: "has_professionals", value: true } },
        ]
      },
      {
        id: "2.4",
        title: "Resultats mesurables",
        description: "Donnees d'impact et resultats cliniques documentes.",
        scoreMax: 5,
        questions: [
          { id: "results_level", type: "select", label: "Type de resultats disponibles", required: true, options: [
            { value: "longitudinal", label: "Resultats longitudinaux (suivi sur plusieurs mois)" },
            { value: "clinical_outcomes", label: "Resultats cliniques mesures (echelles validees)" },
            { value: "satisfaction", label: "Enquete de satisfaction structuree" },
            { value: "usage_metrics", label: "Metriques d'usage uniquement" },
            { value: "testimonials", label: "Temoignages uniquement" },
            { value: "none", label: "Aucun resultat disponible" },
          ] },
          { id: "results_details", type: "text", label: "Decrivez vos resultats (chiffres, taille d'echantillon, methode de mesure)", placeholder: "Ex: 87% de satisfaction (n=1200), reduction de 35% des symptomes d'anxiete sur PHQ-9 (n=450, 3 mois)" },
          { id: "results_url", type: "url", label: "URL ou document presentant ces resultats" },
        ]
      },
    ]
  },
  {
    id: "3",
    title: "Accessibilite & Inclusion",
    icon: "accessibility",
    subCriteria: [
      {
        id: "3.1",
        title: "Prix et accessibilite financiere",
        description: "Transparence tarifaire et offres inclusives.",
        scoreMax: 4,
        questions: [
          { id: "pricing_url", type: "url", label: "URL de votre page tarification", required: true },
          { id: "has_free_tier", type: "checkbox", label: "Version gratuite reellement utilisable disponible" },
          { id: "has_free_trial", type: "checkbox", label: "Essai gratuit disponible" },
          { id: "free_trial_duration", type: "text", label: "Duree de l'essai gratuit", condition: { id: "has_free_trial", value: true }, placeholder: "14 jours" },
          { id: "has_solidarity_pricing", type: "checkbox", label: "Tarif solidaire disponible (CMU, etudiants, demandeurs d'emploi)" },
          { id: "solidarity_details", type: "text", label: "Conditions du tarif solidaire", condition: { id: "has_solidarity_pricing", value: true } },
        ]
      },
      {
        id: "3.2",
        title: "Plateformes disponibles",
        description: "Multi-support et accessibilite technique.",
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
        title: "Langue francaise",
        description: "Disponibilite complete en francais.",
        scoreMax: 4,
        questions: [
          { id: "french_level", type: "select", label: "Disponibilite en francais", required: true, options: [
            { value: "full_localized", label: "Entierement localise (contenu + interface + support)" },
            { value: "full_content", label: "Interface et contenu principal en francais" },
            { value: "full_interface", label: "Interface en francais, contenu partiellement" },
            { value: "partial_interface", label: "Interface partiellement en francais" },
            { value: "english_only", label: "Anglais uniquement" },
          ] },
          { id: "french_support", type: "checkbox", label: "Le support client repond en francais" },
        ]
      },
      {
        id: "3.4",
        title: "Accessibilite numerique (handicap)",
        description: "Conformite WCAG et accessibilite pour tous.",
        scoreMax: 4,
        questions: [
          { id: "accessibility_level", type: "select", label: "Niveau d'accessibilite numerique", required: true, options: [
            { value: "wcag_certified", label: "Certifie WCAG AA (audit externe)" },
            { value: "wcag_aa", label: "Conforme WCAG AA (auto-evaluation)" },
            { value: "keyboard_nav", label: "Navigation au clavier fonctionnelle" },
            { value: "basic", label: "Accessibilite basique" },
            { value: "not_evaluated", label: "Non evalue" },
          ] },
          { id: "accessibility_url", type: "url", label: "URL de la declaration d'accessibilite ou du rapport d'audit" },
        ]
      },
      {
        id: "3.5",
        title: "Autonomie et prise en main",
        description: "Facilite de demarrage sans assistance.",
        scoreMax: 4,
        questions: [
          { id: "onboarding_steps", type: "number", label: "Nombre d'etapes pour acceder a la premiere valeur du service", placeholder: "3" },
          { id: "onboarding_description", type: "text", label: "Decrivez le parcours d'onboarding", placeholder: "Inscription > Questionnaire initial > Acces au programme personnalise" },
          { id: "has_guided_onboarding", type: "checkbox", label: "Un onboarding guide (tutoriel, aide contextuelle) est propose" },
        ]
      },
    ]
  },
  {
    id: "4",
    title: "Qualite UX",
    icon: "palette",
    subCriteria: [
      {
        id: "4.1",
        title: "Design visuel",
        description: "Qualite et adaptation au contexte de sante mentale.",
        scoreMax: 4,
        questions: [
          { id: "homepage_url", type: "url", label: "URL de votre page d'accueil (l'admin evaluera visuellement)", required: true },
          { id: "design_adapted", type: "checkbox", label: "Le design a ete concu specifiquement pour un public en situation de fragilite psychologique" },
          { id: "design_details", type: "text", label: "Decrivez les choix de design adaptes a votre audience", placeholder: "Palette apaisante, pas de notifications intrusives, ton empathique, etc." },
        ]
      },
      {
        id: "4.2",
        title: "Navigation et parcours",
        description: "Clarte du chemin vers la fonctionnalite principale.",
        scoreMax: 4,
        questions: [
          { id: "nav_clicks", type: "number", label: "Nombre de clics depuis la page d'accueil jusqu'a la fonctionnalite principale", placeholder: "2" },
          { id: "nav_path", type: "text", label: "Decrivez ce chemin", placeholder: "Page d'accueil > Bouton 'Commencer' > Questionnaire initial" },
        ]
      },
      {
        id: "4.3",
        title: "Performance",
        description: "Temps de chargement et fiabilite.",
        scoreMax: 4,
        questions: [
          { id: "main_url_perf", type: "url", label: "URL de votre page principale (l'admin mesurera avec PageSpeed)", required: true },
          { id: "has_lighthouse_score", type: "checkbox", label: "Vous avez mesure votre score Lighthouse Performance" },
          { id: "lighthouse_score", type: "number", label: "Score Lighthouse Performance (0-100)", condition: { id: "has_lighthouse_score", value: true }, placeholder: "85" },
        ]
      },
      {
        id: "4.4",
        title: "Qualite redactionnelle",
        description: "Ton, clarte et expertise du contenu.",
        scoreMax: 4,
        questions: [
          { id: "content_authors", type: "text", label: "Qui redige le contenu editorial ?", required: true, placeholder: "Equipe interne de psychologues, redacteurs specialises en sante mentale" },
          { id: "content_reviewed", type: "checkbox", label: "Le contenu est relu et valide par des professionnels de sante" },
          { id: "content_reviewer", type: "text", label: "Par qui ?", condition: { id: "content_reviewed", value: true }, placeholder: "Dr. Marie Dupont, psychiatre" },
        ]
      },
      {
        id: "4.5",
        title: "Experience mobile",
        description: "Qualite de l'experience sur smartphone.",
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
    title: "Support & Accompagnement",
    icon: "handshake",
    subCriteria: [
      {
        id: "5.1",
        title: "Reactivite du support",
        description: "Temps de reponse reel (l'admin enverra un message test).",
        scoreMax: 4,
        questions: [
          { id: "contact_url", type: "url", label: "URL de votre page de contact", required: true },
          { id: "announced_response_time", type: "text", label: "Delai de reponse annonce", placeholder: "24h ouvrees, reponse immediate par chat" },
          { id: "support_hours", type: "text", label: "Horaires du support", placeholder: "Lundi-Vendredi 9h-18h" },
        ]
      },
      {
        id: "5.2",
        title: "Canaux de contact",
        description: "Diversite et accessibilite des moyens de contact.",
        scoreMax: 4,
        questions: [
          { id: "has_contact_form", type: "checkbox", label: "Formulaire de contact" },
          { id: "contact_form_url", type: "url", label: "URL du formulaire", condition: { id: "has_contact_form", value: true } },
          { id: "has_email", type: "checkbox", label: "Email de support" },
          { id: "support_email", type: "email", label: "Adresse email de support", condition: { id: "has_email", value: true } },
          { id: "has_live_chat", type: "checkbox", label: "Chat en direct" },
          { id: "chat_url", type: "url", label: "URL du chat", condition: { id: "has_live_chat", value: true } },
          { id: "has_phone", type: "checkbox", label: "Telephone" },
          { id: "phone_number", type: "text", label: "Numero de telephone", condition: { id: "has_phone", value: true } },
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
            { value: "help_center", label: "Centre d'aide structure" },
            { value: "good_faq", label: "FAQ detaillee" },
            { value: "minimal_faq", label: "FAQ minimale" },
            { value: "none", label: "Aucune documentation" },
          ] },
          { id: "help_url", type: "url", label: "URL de votre FAQ ou centre d'aide" },
        ]
      },
      {
        id: "5.4",
        title: "Gestion de crise",
        description: "Protocole d'urgence et affichage des numeros d'aide.",
        scoreMax: 4,
        questions: [
          { id: "crisis_numbers_display", type: "select", label: "Ou les numeros d'urgence (3114, 15) sont-ils affiches ?", required: true, options: [
            { value: "proactive", label: "Affichage proactif (detection de situation de crise)" },
            { value: "interface_visible", label: "Visible en permanence dans l'interface" },
            { value: "footer", label: "Dans le pied de page" },
            { value: "cgu_only", label: "Dans les CGU uniquement" },
            { value: "nowhere", label: "Non affiches" },
          ] },
          { id: "crisis_detection", type: "checkbox", label: "L'interface detecte les messages ou signaux a risque pour rediriger vers l'aide" },
          { id: "crisis_detection_details", type: "text", label: "Decrivez le protocole de detection", condition: { id: "crisis_detection", value: true } },
          { id: "crisis_url", type: "url", label: "URL ou capture montrant l'affichage des numeros d'urgence" },
        ]
      },
      {
        id: "5.5",
        title: "Dimension communautaire",
        description: "Entraide entre pairs et moderation professionnelle.",
        scoreMax: 4,
        questions: [
          { id: "community_level", type: "select", label: "Dimension communautaire proposee", required: true, options: [
            { value: "pro_moderated", label: "Communaute moderee par des professionnels" },
            { value: "active_community", label: "Communaute active avec moderation" },
            { value: "forum", label: "Forum ou espace d'echange" },
            { value: "social_media", label: "Reseaux sociaux uniquement" },
            { value: "none", label: "Aucune dimension communautaire" },
          ] },
          { id: "community_url", type: "url", label: "URL de votre communaute ou forum" },
          { id: "community_moderators", type: "text", label: "Noms des moderateurs professionnels", condition: { id: "community_level", value: "pro_moderated" } },
        ]
      },
    ]
  },
];

export const allSubCriteria = protocolPillars.flatMap(p => p.subCriteria);

export function getAnswer(protocolAnswers: Record<string, Record<string, unknown>>, criterionId: string): Record<string, unknown> {
  return protocolAnswers[criterionId] ?? {};
}
