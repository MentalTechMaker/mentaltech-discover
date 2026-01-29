-- MentalTech Discover - Seed Data (22 products)
-- Encoding: UTF-8

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('insleep', 'inSleep', 'Téléconsultation',
 'Bien dormir, cela s''apprend, Mal dormir cela se soigne',
 'Spécialiste de la prévention des risques liés à la fatigue et à la somnolence en entreprise. Propose une évaluation complète, des formations sur site ou en ligne, ainsi qu''un diagnostic et un contrôle professionnel des troubles du sommeil pour améliorer la santé et la performance des collaborateurs.',
 'https://www.insleeplab.fr', '/logos/insleeplab.png',
 ARRAY['professionnel','téléconsultation','prévention','éducation','entreprise','formation','bien-être'],
 ARRAY['adult'],
 ARRAY['sleep'],
 ARRAY['talk-now','autonomous','understand','program'],
 TRUE, 'enterprise', NULL,
 'Abonnement, à la séance, sur devis (entreprises). Remboursable par la Sécurité Sociale',
 '2025-11-04');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('ifeel', 'ifeel', 'Plateforme entreprise',
 'La solution incontournable en santé mentale pour les entreprises.',
 'Solution de référence en santé mentale au travail qui accompagne les entreprises et leurs collaborateurs. Aide à réduire l''absentéisme et instaure un climat de travail positif et durable grâce à une approche alliant innovation, expertise clinique et partenariats stratégiques.',
 'https://ifeelonline.com/fr/', '/logos/ifeel.png',
 ARRAY['professionnel','téléconsultation','prévention','bien-être','éducation','entreprise','formation','accompagnement','urgent'],
 ARRAY['adult'],
 ARRAY['stress-anxiety','sadness','addiction','trauma','work'],
 ARRAY['talk-now','autonomous','understand','program'],
 TRUE, 'enterprise', NULL,
 'Sur devis (entreprises). Certifications: HIPAA, ISO 27001, GDPR',
 '2025-11-04');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('wetalk', 'We talk', 'Téléconsultation',
 'Partenaire pour le bien être mental de vos collaborateurs',
 'Plateforme complète de téléconsultation psychologique pour les entreprises et les particuliers. Offre un accompagnement efficace et personnalisé avec analyse d''impact, accessible 24/7 pour soutenir la santé mentale des collaborateurs face au burn-out, anxiété, dépression et troubles du sommeil.',
 'https://www.wetalk.life', '/logos/wetalk.png',
 ARRAY['professionnel','téléconsultation','prévention','bien-être','éducation','entreprise','formation','accompagnement','urgent'],
 ARRAY['adult'],
 ARRAY['stress-anxiety','sadness','trauma','work','sleep'],
 ARRAY['talk-now','autonomous','understand','program'],
 TRUE, 'subscription', 'à partir de 4€',
 'Sur mesure. Essai gratuit bilan émotionnel. Abonnement, à la séance, sur devis (entreprises)',
 '2025-11-04');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('pleinia', 'Pleinia', 'Plateforme entreprise',
 'Donner aux salariés les clés pour agir sur leur santé mentale',
 'Plateforme qui donne aux salariés les clés pour agir sur leur santé mentale grâce à une approche globale. Propose des contenus digitaux, bilans complets, parcours accompagnés par des coachs, défis collectifs et ateliers interactifs pour développer les comportements et soft skills favorables au bien-être.',
 'https://www.pleinia.com', '/logos/pleinia.png',
 ARRAY['prévention','bien-être','entreprise','formation','accompagnement'],
 ARRAY['adult'],
 ARRAY['stress-anxiety','work','sleep'],
 ARRAY['talk-now','autonomous','understand','program'],
 TRUE, 'enterprise', NULL,
 'Sur devis (entreprises)',
 '2025-11-05');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('kwit', 'Kwit', 'Application',
 'Arrêtez de fumer et restez non fumer pour de bon',
 'Application mobile de sevrage tabagique validée par l''OMS qui combine TCC et gamification. Accompagne 5 millions d''utilisateurs de manière bienveillante avec suivi de progression, gestion des envies, groupes de soutien et contenu éducatif. Affiche un taux de réussite de 68% à 3 mois.',
 'https://kwit.app', '/logos/kwit.png',
 ARRAY['addiction','tabac','sevrage','autonomie','éducation','prévention','bien-être'],
 ARRAY['adult','young'],
 ARRAY['addiction'],
 ARRAY['talk-now','autonomous','understand','program'],
 FALSE, 'freemium', '60€/an',
 '3 jours d''essai gratuit. Validée par l''OMS',
 '2025-11-05');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('sobero', 'Sobero', 'Application',
 'Reprenez le pouvoir sur votre consommation d''alcool, en toute conscience et bienveillance.',
 'Application mobile qui aide à développer une relation plus saine avec l''alcool, basée sur les TCC et le mouvement Sober Curious. Propose un accompagnement anonyme et bienveillant avec suivi de consommation, exercices de journaling et contenu éducatif. Plus de 60 000 utilisateurs en France.',
 'https://sobero.app', '/logos/sobero.png',
 ARRAY['addiction','alcool','sevrage','autonomie','éducation','prévention','bien-être'],
 ARRAY['adult','young'],
 ARRAY['addiction'],
 ARRAY['talk-now','autonomous','understand','program'],
 FALSE, 'subscription', '60€/an',
 '7 jours d''essai gratuits',
 '2025-11-05');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('letstolk', 'Let''s Tolk', 'Téléconsultation',
 'Les psychologues en ligne',
 'Cabinet digital de psychologues en ligne disponibles 7j/7 en moins de 24h. Accompagnement humain, professionnel et attentif en visio pour burn-out, anxiété, dépression, troubles du sommeil et addictions. Psychologues enregistrés à l''ARS avec possibilité de remboursement mutuelle.',
 'https://www.letstolk.com/', '/logos/letstolk.svg',
 ARRAY['professionnel','téléconsultation','prévention','urgent'],
 ARRAY['adult','young','senior','parent'],
 ARRAY['stress-anxiety','sadness','addiction','trauma','work','sleep'],
 ARRAY['talk-now'],
 FALSE, 'per-session', 'à partir de 28€',
 'Remboursement par la mutuelle selon contrat. Psychologues enregistrés à l''ARS',
 '2025-11-05');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('eos', 'Eos', 'Téléconsultation',
 'Une solution de santé numérique pour consolider l''abstinence en alcool et tabac',
 'Première clinique digitale dédiée à l''addictologie en France avec dispositif médical numérique certifié. Propose téléconsultations, application mobile et programme thérapeutique complet pour l''alcool et le tabac. Remboursable par la Sécurité Sociale avec agrément STC.',
 'https://www.eos-care.com', '/logos/eos.png',
 ARRAY['professionnel','téléconsultation','addiction','alcool','tabac','sevrage','éducation','autonomie'],
 ARRAY['adult'],
 ARRAY['addiction'],
 ARRAY['talk-now','autonomous','understand','program'],
 FALSE, 'freemium', NULL,
 'Consultations au tarif opposable. Remboursement Sécurité Sociale, Tiers Payant. Abonnement mensuel pour programme thérapeutique. Agrément STC jalon 3',
 '2025-11-07');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('holicare', 'Holicare', 'Plateforme entreprise',
 'La santé mentale au travail est une science.',
 'Plateforme de santé mentale au travail basée sur une expertise scientifique et une approche humaine. Combine détection précoce avec l''Holitest, formations certifiées Qualiopi et parcours de soins pluridisciplinaires de 3 à 9 mois. 90% de réduction des symptômes anxio-dépressifs démontrée.',
 'https://www.holicare.com/', '/logos/holicare.svg',
 ARRAY['professionnel','téléconsultation','prévention','bien-être','entreprise','formation','accompagnement','urgent'],
 ARRAY['adult','young','senior','parent'],
 ARRAY['stress-anxiety','sadness','addiction','trauma','work','sleep'],
 ARRAY['talk-now','understand','program'],
 TRUE, 'subscription', NULL,
 'Certifié Qualiopi. Approche holistique validée scientifiquement avec 90% de réduction des symptômes anxio-dépressifs',
 '2025-11-10');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('feel', 'Feel', 'Application',
 'Feel est une application qui aide à soigner la dépression en 3 à 6 mois.',
 'Application qui aide à soigner la dépression en 3 à 6 mois basée sur la thérapie cognitivo-comportementale. Accompagne les utilisateurs pour modifier leurs comportements et maîtriser leurs pensées négatives avec des exercices pratiques, outils TCC et contenu de psychoéducation. Disponible 24/7.',
 'https://feelapp.care/', '/logos/feel.png',
 ARRAY['autonomie','éducation','prévention','bien-être','urgent'],
 ARRAY['adult','senior','parent'],
 ARRAY['sadness'],
 ARRAY['autonomous','understand','program'],
 FALSE, 'freemium', '29,99€ pour 6 mois',
 '15 jours d''essai. Psychoéducation gratuite. Pré-étude clinique avec résultats encourageants',
 '2025-11-12');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('neuredia', 'Neuredia', 'Gestion administrative',
 'La gestion administrative des neuro-atypiques',
 'Première plateforme qui centralise et simplifie la gestion administrative des familles d''enfants neuroatypiques. Offre un parcours guidé et sur mesure pour garantir l''accès à tous les droits et coordonner le parcours de soin. Moteur IA propriétaire pour recycler les données entre démarches.',
 'https://neuredia.fr', '/logos/neuredia.png',
 ARRAY['autonomie'],
 ARRAY['child','young','parent'],
 ARRAY['stress-anxiety'],
 ARRAY['autonomous','program'],
 FALSE, 'freemium', '150€ année 1 puis 9,99€/mois',
 'Accès freemium aux fonctionnalités de base',
 '2025-11-15');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('hypnovr', 'HypnoVR', 'Réalité virtuelle',
 'Améliorer son parcours de soin grâce à son cerveau !',
 'Thérapies digitales certifiées en réalité virtuelle pour la santé mentale. Propose des séances d''hypnose immersives pour gérer le stress, l''anxiété, les troubles du sommeil et la douleur. Plus de 600 hôpitaux et cliniques équipés avec 35+ études cliniques validant l''efficacité.',
 'https://hypnovr.io/', '/logos/hypnovr.png',
 ARRAY['bien-être','entreprise'],
 ARRAY['adult','young','child','senior'],
 ARRAY['stress-anxiety','work','sleep'],
 ARRAY['autonomous','program'],
 TRUE, 'subscription', NULL,
 'Abonnement sans engagement, possibilité d''essai gratuit pour établissements de santé. Dispositif médical certifié, plus de 35 études cliniques',
 '2025-11-17');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('lyynk', 'Lyynk', 'Application',
 'Améliorer la santé mentale des jeunes',
 'Application gratuite pour les jeunes offrant une safe place et des outils pour gérer leur santé mentale. Propose également un accès pour les adultes de confiance afin de renforcer le lien intergénérationnel. Contient des exercices de bien-être, méditation et suivi émotionnel.',
 'https://www.lyynk.com', '/logos/lyynk.png',
 ARRAY['autonomie','prévention','bien-être','enfants'],
 ARRAY['young','parent'],
 ARRAY['stress-anxiety','sadness'],
 ARRAY['autonomous','understand'],
 FALSE, 'freemium', '7,99€/mois pour parents',
 'Application gratuite pour les jeunes. 30 jours d''essai pour les parents',
 '2025-11-18');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('qare', 'Qare', 'Téléconsultation',
 'Téléconsultation médicale en ligne 7j/7',
 'Service de téléconsultation avec psychiatres et psychologues disponibles 7 jours sur 7, de 6h à minuit. Consultations remboursables par l''Assurance Maladie pour un accès rapide et facile aux professionnels de santé mentale.',
 'https://www.qare.fr', '/logos/qare.png',
 ARRAY['professionnel','téléconsultation','urgent','accessible'],
 ARRAY['adult','young','senior','parent'],
 ARRAY['stress-anxiety','sadness','trauma','work','sleep'],
 ARRAY['talk-now'],
 FALSE, 'per-session', NULL,
 'Remboursable par l''Assurance Maladie',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('petitbambou', 'Petit BamBou', 'Application',
 'Application de méditation guidée pour réduire le stress',
 'Application mobile de méditation guidée proposant des centaines de programmes audio pour réduire le stress, améliorer le sommeil et développer la pleine conscience. Approche accessible pour tous les niveaux avec sessions de 3 à 20 minutes.',
 'https://www.petitbambou.com', '/logos/petitbambou.png',
 ARRAY['méditation','autonomie','bien-être','prévention','éducation'],
 ARRAY['adult','young','senior'],
 ARRAY['stress-anxiety','sleep'],
 ARRAY['autonomous','understand','program'],
 FALSE, 'freemium', NULL,
 'Version gratuite avec programmes de base + abonnement premium pour contenus avancés',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('mokacare', 'moka.care', 'Plateforme entreprise',
 'Plateforme de santé mentale pour accompagner les salariés',
 'Solution complète de santé mentale en entreprise proposant un accompagnement par psychologues, thérapeutes et coachs. Présente dans 320+ entreprises et 20 pays, offre un support en 25 langues pour prendre soin du bien-être mental des collaborateurs.',
 'https://www.moka.care', '/logos/mokacare.png',
 ARRAY['professionnel','entreprise','téléconsultation','prévention','accompagnement','bien-être'],
 ARRAY['adult'],
 ARRAY['work','stress-anxiety','sadness'],
 ARRAY['talk-now','program','understand'],
 TRUE, 'enterprise', NULL,
 'Sur devis pour entreprises',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('edra', 'EDRA', 'Télésurveillance',
 'Télésurveillance psychiatrique des troubles de l''humeur',
 'Dispositif médical certifié de télésurveillance en psychiatrie pour le suivi personnalisé des patients adultes avec troubles psychiatriques sous traitement médicamenteux. Solution professionnelle destinée aux établissements de santé.',
 'https://www.edra.care', '/logos/edra.png',
 ARRAY['professionnel','téléconsultation','psychiatrie','médical','accompagnement'],
 ARRAY['adult'],
 ARRAY['sadness','stress-anxiety'],
 ARRAY['talk-now','program'],
 TRUE, 'enterprise', NULL,
 'Dispositif médical professionnel pour établissements de santé. Marquage CE 0459',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('suricog', 'Suricog', 'Medtech',
 'Diagnostic médical par oculométrie eye-tracking',
 'Technologie innovante d''eye-tracking médical pour quantifier et diagnostiquer les troubles cérébraux en pratique clinique. Dispositif professionnel destiné aux neurologues et praticiens pour l''évaluation objective des fonctions cognitives.',
 'https://www.suricog.fr', '/logos/suricog.png',
 ARRAY['professionnel','médical','diagnostic','neurologie','innovation'],
 ARRAY['adult'],
 ARRAY['stress-anxiety'],
 ARRAY['understand'],
 TRUE, 'enterprise', NULL,
 'Dispositif médical professionnel pour établissements de santé',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('tuki', 'Tuki', 'Application',
 'Application d''entraide entre pairs en ligne et anonyme',
 'Application francophone de soutien par les pairs proposant des groupes de parole modérés pour divers troubles psychologiques et défis de vie. Espace sécurisé et anonyme pour échanger avec des personnes vivant des situations similaires.',
 'https://www.wearetuki.com', '/logos/tuki.png',
 ARRAY['entraide','communauté','prévention','bien-être','autonomie'],
 ARRAY['adult','young'],
 ARRAY['stress-anxiety','sadness','trauma','addiction'],
 ARRAY['talk-now','understand','autonomous'],
 FALSE, 'freemium', NULL,
 'Accès gratuit aux groupes de base avec contenu premium optionnel',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('lislup', 'Lisl Up', 'Plateforme entreprise',
 'Plateforme santé mentale accessible 24/7 pour entreprises',
 'Solution tout-en-un pour entreprises proposant évaluation psychologique, cours de bien-être, coaching personnalisé, chat d''urgence 24/7 et baromètre annuel. Accompagnement complet adapté selon la taille de l''entreprise (<250 ou >250 employés).',
 'https://www.lislup.com', '/logos/lislup.png',
 ARRAY['professionnel','entreprise','téléconsultation','coaching','urgent','bien-être','accompagnement'],
 ARRAY['adult'],
 ARRAY['stress-anxiety','sadness','work','sleep'],
 ARRAY['talk-now','autonomous','program'],
 TRUE, 'subscription', NULL,
 'Abonnement modulé selon taille entreprise (<250 ou >250 employés)',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('mindday', 'mindDay', 'Application',
 'Application de thérapie TCC accessible à tous',
 'Application mobile de thérapie cognitive et comportementale proposant des programmes vidéo structurés de 14 à 30 jours, complétés par des méditations guidées et sessions d''auto-hypnose. Approche scientifique pour gérer stress, anxiété et améliorer le bien-être.',
 'https://www.mindday.com', '/logos/mindday.png',
 ARRAY['autonomie','éducation','prévention','bien-être','méditation'],
 ARRAY['adult'],
 ARRAY['stress-anxiety','sadness','work','sleep'],
 ARRAY['autonomous','program','understand'],
 FALSE, 'subscription', NULL,
 'Essai gratuit 7 jours puis abonnement mensuel ou annuel',
 '2025-11-20');

INSERT INTO products (id, name, type, tagline, description, url, logo, tags, audience, problems_solved, preference_match, for_company, pricing_model, pricing_amount, pricing_details, last_updated) VALUES
('koalou', 'Koalou', 'Application',
 'Première psychothérapie digitale française pour enfants',
 'Solution de psychothérapie digitale spécialisée pour enfants de 3 à 10 ans avec programmes adaptés pour gérer le stress, l''anxiété, les troubles de l''attention (TDAH), les phobies et autres difficultés émotionnelles. Destiné aux professionnels de santé et parents.',
 'https://www.koalou.com', '/logos/koalou.png',
 ARRAY['professionnel','enfants','accompagnement','éducation','prévention'],
 ARRAY['child','parent'],
 ARRAY['stress-anxiety'],
 ARRAY['program','understand'],
 FALSE, 'custom', NULL,
 'Démo sur demande - destiné aux professionnels de santé et parents',
 '2025-11-20');
