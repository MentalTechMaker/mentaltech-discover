# Protocole d'Évaluation des Solutions MentalTech

Guide opérationnel pour évaluer manuellement chaque solution référencée sur MentalTech Discover et attribuer un score de qualité (label A-E).

---

## Vue d'ensemble

Chaque solution est notée sur **5 critères**, chacun noté de **0 à 20 points**, pour un **total sur 100**.

| Score total | Label | Signification |
|-------------|-------|---------------|
| 80 - 100 | **A** | Validé MentalTech |
| 60 - 79 | **B** | Recommandé |
| 40 - 59 | **C** | Évalué |
| 20 - 39 | **D** | À améliorer |
| 0 - 19 | **E** | Déconseillé |

---

## Indépendance de l'évaluation

### Principe

MentalTech Discover référence des solutions dont certaines sont membres du Collectif MentalTech. Pour garantir la crédibilité des évaluations, les règles suivantes s'appliquent :

### Règles d'indépendance

1. **Aucun lien financier** — L'évaluateur ne doit avoir aucun lien financier (investissement, contrat, rémunération) avec la solution évaluée
2. **Déclaration systématique** — Chaque évaluation mentionne si la solution est membre du Collectif MentalTech
3. **Barème identique** — Le même barème détaillé (voir ci-dessous) est appliqué à toutes les solutions, membres ou non du Collectif
4. **Justification obligatoire** — Chaque note doit être accompagnée d'éléments factuels vérifiables (URLs, captures d'écran, dates)
5. **Évaluation publiée** — Les scores et justifications sont publics pour les prescripteurs, permettant la vérification par les pairs

### Gestion des conflits d'intérêt

| Situation | Action |
|-----------|--------|
| L'évaluateur n'a aucun lien avec la solution | Évaluation standard |
| L'évaluateur connaît personnellement un fondateur | Déclaration dans la justification, évaluation possible |
| L'évaluateur a un lien financier avec la solution | **Évaluateur récusé** — un autre évaluateur doit être désigné |
| La solution est membre du Collectif MentalTech | Mention "Membre du Collectif" sur la fiche, barème identique |

### Vers l'évaluation externe (objectif 2026)

À terme, les évaluations des solutions membres du Collectif devraient être réalisées ou co-réalisées par un tiers indépendant :
- Prescripteur ambassadeur vérifié
- Chercheur en e-santé
- Organisme d'évaluation externe

Cela renforce la crédibilité sans changer le protocole lui-même.

---

## Pipeline de vérification

### Phase 0 — Préparation

1. Ouvrir la fiche du produit dans le panel admin
2. Préparer un document de notes temporaire (ou remplir directement dans le formulaire)
3. Avoir sous la main :
   - Le site web de la solution
   - Les CGU / politique de confidentialité
   - Les stores d'apps (si applicable)
   - Le LinkedIn de l'entreprise (taille de l'équipe, actualités)

---

### Phase 1 — Sécurité & Confidentialité (0-20)

**Objectif** : Évaluer la protection des données personnelles et de santé.

#### 1.1 RGPD — Politique de confidentialité (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune politique de confidentialité trouvée | — |
| 1 | Page existante mais incomplète (pas de base légale, droits non mentionnés) | URL de la page |
| 2 | Politique conforme a minima (base légale + droits des utilisateurs) | Points couverts |
| 3 | Politique complète (base légale, droits, durée de conservation, sous-traitants) | Points couverts |
| 4 | Exemplaire : DPO nommé, registre des traitements accessible, AIPD documentée | Nom du DPO, liens |

#### 1.2 Hébergement — Localisation des données (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune information sur l'hébergement | — |
| 1 | Hébergement hors UE ou non précisé | Mention trouvée (ou absence) |
| 2 | Hébergement en UE, sans certification santé | Hébergeur + pays |
| 3 | Hébergement en France, hébergeur connu | Hébergeur + localisation |
| 4 | Hébergement HDS certifié (Hébergeur de Données de Santé) | Nom de l'hébergeur HDS, numéro de certification si disponible |

#### 1.3 Chiffrement — HTTPS et stockage (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Pas de HTTPS | Test du cadenas navigateur |
| 1 | HTTPS actif mais certificat faible ou expiré | Type de certificat |
| 2 | HTTPS valide (Let's Encrypt ou équivalent) | Certificat OK |
| 3 | HTTPS + mention de chiffrement des données au repos | Citation de la page mentionnant le chiffrement |
| 4 | HTTPS + chiffrement au repos documenté (AES-256 ou équivalent) + chiffrement en transit | Technologies citées |

#### 1.4 Consentement — Gestion des cookies (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Trackers tiers détectés, aucun bandeau cookies | Outils : extension uBlock Origin ou Ghostery |
| 1 | Bandeau cookies présent mais sans option de refus | Capture d'écran du bandeau |
| 2 | Bandeau avec accepter/refuser, mais trackers chargés avant consentement | Test avec les outils réseau du navigateur |
| 3 | Bandeau conforme : refus possible, trackers bloqués sans consentement | Test navigateur |
| 4 | Aucun tracker tiers, ou consentement granulaire exemplaire (choix par catégorie) | Liste des trackers (aucun ou opt-in strict) |

#### 1.5 Suppression — Droit à l'effacement (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune mention de suppression de compte ou données | — |
| 1 | Suppression possible uniquement sur demande email, non documentée | Mention trouvée |
| 2 | Procédure de suppression documentée (FAQ ou CGU) | URL de la documentation |
| 3 | Suppression en self-service dans les paramètres du compte | Capture d'écran ou test |
| 4 | Suppression en 1 clic + confirmation de suppression des données + délai annoncé | Test effectué, délai observé |

**Justification à rédiger** : Pour chaque sous-critère, citer l'élément factuel vérifié (URL, capture, test effectué).

---

### Phase 2 — Efficacité & Preuves cliniques (0-20)

**Objectif** : Évaluer la base scientifique et les résultats démontrés.

> **Note** : Cette phase utilise des sous-critères sur 5 points (4 × 5 = 20).

#### 2.1 Base scientifique — Fondements théoriques (0-5)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune approche thérapeutique identifiable | — |
| 1 | Approche "bien-être" sans fondement scientifique explicite | Type d'approche revendiquée |
| 2 | Approche reconnue mentionnée (ex: méditation, relaxation) sans détail méthodologique | Méthode citée sur le site |
| 3 | Approche thérapeutique validée (TCC, ACT, EMDR, pleine conscience) clairement décrite | Méthode + description du programme |
| 4 | Approche validée + méthodologie détaillée (protocole thérapeutique structuré) | Description du protocole |
| 5 | Approche validée + protocole + supervision par un comité scientifique identifié | Noms des membres du comité |

#### 2.2 Études cliniques — Publications (0-5)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune étude clinique mentionnée ou trouvée | Recherche PubMed + Google Scholar + site |
| 1 | Études internes non publiées (livre blanc, données marketing) | Source citée |
| 2 | 1 étude publiée dans une revue (pas forcément à comité de lecture) | Référence complète |
| 3 | 1+ études publiées dans des revues à comité de lecture | DOI / liens PubMed |
| 4 | Essai contrôlé randomisé (RCT) publié | DOI du RCT |
| 5 | Plusieurs RCT + méta-analyse ou revue systématique | DOI des publications |

#### 2.3 Supervision — Professionnels impliqués (0-5)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucun professionnel de santé identifié | Page "Équipe" ou "À propos" |
| 1 | Mention vague ("conçu avec des professionnels") sans noms | Citation exacte |
| 2 | 1 professionnel de santé nommé (psychologue, médecin) | Nom + titre |
| 3 | Équipe clinique identifiée (2+ professionnels nommés avec titres) | Noms + spécialités |
| 4 | Comité scientifique ou médical formel avec membres identifiés | Composition du comité |
| 5 | Comité scientifique + publications des membres + affiliation hospitalière/universitaire | Affiliations vérifiables |

#### 2.4 Résultats — Données d'usage (0-5)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucun résultat ni témoignage | — |
| 1 | Témoignages non vérifiables sur le site (marketing) | Nombre de témoignages |
| 2 | Métriques d'usage publiées (nombre d'utilisateurs, téléchargements) | Chiffres cités |
| 3 | Résultats mesurables publiés (taux de satisfaction, NPS) avec taille d'échantillon | Chiffres + n= |
| 4 | Résultats cliniques publiés (amélioration symptômes, échelles validées) | Échelles utilisées (PHQ-9, GAD-7...) |
| 5 | Résultats cliniques + suivi longitudinal + données ouvertes | Méthodologie de mesure |

**Justification à rédiger** : Citer chaque étude (DOI), chaque professionnel (nom + titre), chaque résultat (chiffre + source).

---

### Phase 3 — Accessibilité & Inclusion (0-20)

**Objectif** : Évaluer l'accessibilité financière, technique et sociale.

#### 3.1 Prix — Transparence et accessibilité (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Prix non affiché, opaque | Navigation sur le site |
| 1 | Prix affiché mais élevé (> 30€/mois) sans offre gratuite ni essai | Page tarification |
| 2 | Prix clair avec essai gratuit ou premier mois offert | Durée de l'essai, conditions |
| 3 | Modèle freemium fonctionnel (version gratuite réellement utilisable) | Fonctionnalités de la version gratuite |
| 4 | Gratuit ou tarif solidaire disponible (CMU, étudiants, chômeurs) | Conditions du tarif solidaire |

#### 3.2 Plateformes — Disponibilité multi-supports (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Solution inaccessible ou en maintenance | Test d'accès |
| 1 | Disponible sur 1 seule plateforme (ex: iOS uniquement) | Plateformes listées |
| 2 | Disponible sur 2 plateformes (ex: Web + iOS) | Stores + site web |
| 3 | Disponible sur 3 plateformes (Web + iOS + Android) | Vérifier chaque store |
| 4 | 3 plateformes + application native performante (pas juste un wrapper web) | Test rapide de l'app |

#### 3.3 Langue — Disponibilité en français (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Interface uniquement en anglais | Langue de l'interface |
| 1 | Interface partiellement traduite (menus en français, contenu en anglais) | Pages testées |
| 2 | Interface en français, mais contenus thérapeutiques partiellement en anglais | Vérifier le contenu principal |
| 3 | Interface + contenus 100% en français | Navigation complète |
| 4 | 100% français + support client en français + contenus localisés (références françaises, numéros d'urgence FR) | Test du support |

#### 3.4 Handicap — Accessibilité numérique (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucun effort d'accessibilité visible, contrastes insuffisants | Inspection visuelle rapide |
| 1 | Contrastes corrects mais pas de compatibilité lecteur d'écran | Test avec l'inspecteur navigateur |
| 2 | Navigation au clavier possible + contrastes OK | Test Tab + Entrée |
| 3 | Labels ARIA, navigation clavier, contrastes WCAG AA | Test rapide avec Lighthouse ou axe DevTools |
| 4 | Conformité WCAG AA documentée + audit d'accessibilité publié ou déclaration de conformité | Lien vers la déclaration |

#### 3.5 Autonomie — Facilité de prise en main (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Impossible de commencer sans assistance professionnelle obligatoire | Parcours d'inscription |
| 1 | Inscription complexe (> 5 étapes) ou nécessitant un rendez-vous préalable | Compter les étapes |
| 2 | Inscription simple mais pas d'onboarding (l'utilisateur est livré à lui-même) | Tester le premier usage |
| 3 | Inscription rapide + tutoriel ou onboarding guidé | Décrire l'onboarding |
| 4 | Inscription en < 2 min + onboarding interactif + aide contextuelle | Temps mesuré |

**Justification à rédiger** : Lister les plateformes, le prix exact, les efforts d'inclusion observés.

---

### Phase 4 — Qualité UX (0-20)

**Objectif** : Évaluer l'expérience utilisateur globale.

#### 4.1 Design — Qualité visuelle (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Design amateur ou cassé (éléments mal alignés, images manquantes) | Capture d'écran de la page d'accueil |
| 1 | Design fonctionnel mais daté (aspect "template 2015") | Comparaison avec les standards actuels |
| 2 | Design correct, propre, sans originalité particulière | Impression générale |
| 3 | Design soigné, moderne, cohérent (palette, typographie, espacement) | Points de cohérence observés |
| 4 | Design excellent : rassurant, adapté à la santé mentale, identité visuelle forte | Éléments de design remarquables |

#### 4.2 Navigation — Clarté du parcours (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Impossible de trouver la fonctionnalité principale en < 1 min | Tester le parcours inscription → usage |
| 1 | Parcours trouvé mais confus (retours en arrière, pages sans lien) | Nombre de clics nécessaires |
| 2 | Parcours linéaire mais sans guidage (l'utilisateur doit deviner) | Étapes du parcours |
| 3 | Parcours fluide avec guidage visuel (boutons clairs, progression visible) | Éléments de guidage |
| 4 | Parcours intuitif : inscription → première valeur en < 3 clics | Nombre de clics mesuré |

#### 4.3 Performance — Rapidité et fiabilité (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Site inaccessible ou temps de chargement > 10s | Mesure avec DevTools ou PageSpeed |
| 1 | Chargement lent (5-10s) ou bugs bloquants rencontrés | Temps mesuré + bugs observés |
| 2 | Chargement correct (3-5s), pas de bug bloquant | Temps mesuré |
| 3 | Chargement rapide (< 3s), fonctionnement fluide | Temps mesuré |
| 4 | Chargement < 2s, score Lighthouse > 80, aucun bug rencontré | Score Lighthouse Performance |

#### 4.4 Contenu — Qualité rédactionnelle (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Textes incompréhensibles, fautes majeures, ton inadapté | Exemples de phrases |
| 1 | Textes compréhensibles mais fautes fréquentes ou ton trop marketing | Exemples |
| 2 | Textes corrects, peu de fautes, ton neutre | Impression générale |
| 3 | Textes clairs, bien écrits, ton adapté (empathique, professionnel) | Passages remarqués |
| 4 | Rédaction excellente : ton empathique, vocabulaire adapté, contenu informatif | Passages remarquables |

#### 4.5 Mobile — Expérience sur smartphone (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Site non utilisable sur mobile (texte tronqué, boutons inaccessibles) | Test sur mobile ou DevTools responsive |
| 1 | Site lisible sur mobile mais non optimisé (scroll horizontal, éléments trop petits) | Problèmes observés |
| 2 | Responsive basique (le contenu s'adapte mais l'UX est dégradée) | Comparaison desktop/mobile |
| 3 | Bonne expérience mobile (navigation adaptée, éléments tactiles corrects) | Éléments testés |
| 4 | Expérience mobile excellente ou app native performante | Test complet du parcours sur mobile |

**Justification à rédiger** : Décrire le parcours testé, le temps de chargement mesuré, les captures d'écran si pertinent.

---

### Phase 5 — Support & Accompagnement (0-20)

**Objectif** : Évaluer la qualité du support client et de l'accompagnement proposé.

#### 5.1 Réactivité — Temps de réponse (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucun moyen de contact trouvé | Navigation sur le site |
| 1 | Contact possible mais pas de réponse après 5 jours ouvrés | Date d'envoi + date de vérification |
| 2 | Réponse obtenue en 2-5 jours ouvrés | Date d'envoi + date de réponse |
| 3 | Réponse obtenue en < 24h ouvrées | Dates |
| 4 | Réponse en < 4h ou chat en direct avec temps d'attente < 5 min | Temps mesuré |

**Test obligatoire** : Envoyer un vrai message de test via le formulaire ou l'email de contact. Mesurer le délai.

#### 5.2 Canaux — Moyens de contact (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucun canal de contact identifié | — |
| 1 | 1 canal uniquement (formulaire de contact) | Canal identifié |
| 2 | 2 canaux (ex: email + formulaire) | Canaux listés |
| 3 | 3 canaux (ex: email + chat + téléphone) | Canaux listés + testés |
| 4 | 3+ canaux dont au moins 1 en temps réel (chat, téléphone) | Canaux listés + temps réel testé |

#### 5.3 Ressources — Documentation et aide (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune documentation, FAQ ou aide | — |
| 1 | FAQ minimale (< 5 questions) ou contenu obsolète | Nombre de questions, date de MAJ |
| 2 | FAQ correcte (5-15 questions) couvrant les bases | Sujets couverts |
| 3 | Centre d'aide complet (15+ articles) avec recherche | Nombre d'articles, qualité |
| 4 | Centre d'aide + blog éducatif + guides/tutoriels vidéo | Ressources listées |

#### 5.4 Gestion de crise — Protocole d'urgence (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune mention de numéros d'urgence ni de gestion de crise | Navigation complète |
| 1 | Numéros d'urgence mentionnés mais peu visibles (footer, CGU) | Emplacement trouvé |
| 2 | Numéros d'urgence visibles (3114, 15) dans l'interface principale | Emplacement + visibilité |
| 3 | Redirection proactive en cas de contenu à risque (détection de mots-clés) | Tester avec un message évoquant une situation de crise |
| 4 | Protocole de crise documenté + redirection proactive + formation de l'équipe support | Documentation du protocole |

#### 5.5 Communauté — Accompagnement pair (0-4)

| Note | Seuil | Éléments à vérifier |
|------|-------|---------------------|
| 0 | Aucune dimension communautaire | — |
| 1 | Présence sur les réseaux sociaux avec interactions (mais pas de communauté dédiée) | Liens vers les réseaux |
| 2 | Forum ou groupe d'entraide accessible aux utilisateurs | Lien + activité du groupe |
| 3 | Communauté active + modération visible | Fréquence des posts, modérateurs identifiés |
| 4 | Communauté encadrée par des professionnels de santé | Noms des modérateurs professionnels |

**Justification à rédiger** : Décrire le test de contact effectué (date, canal, délai), les ressources trouvées, le protocole de crise observé.

---

## Checklist par solution

```
Solution : _______________
Date d'évaluation : _______________
Évaluateur : _______________
Conflit d'intérêt : [ ] Aucun  [ ] Déclaré (préciser) : _______________
Membre du Collectif : [ ] Oui  [ ] Non

[ ] Phase 1 — Sécurité & Confidentialité    : ___/20
    Justification : ...

[ ] Phase 2 — Efficacité & Preuves cliniques : ___/20
    Justification : ...

[ ] Phase 3 — Accessibilité & Inclusion      : ___/20
    Justification : ...

[ ] Phase 4 — Qualité UX                     : ___/20
    Justification : ...

[ ] Phase 5 — Support & Accompagnement       : ___/20
    Justification : ...

TOTAL : ___/100 → Label : ___

[ ] Scores saisis dans le panel admin
[ ] Justifications saisies dans le panel admin
[ ] Vérification de l'affichage du badge sur le catalogue
```

---

## Bonnes pratiques

- **Tester en tant qu'utilisateur** : Créer un vrai compte, suivre le parcours complet
- **Documenter avec des captures d'écran** si possible (pour les justifications)
- **Être factuel** : Éviter les jugements subjectifs, citer des éléments vérifiables
- **Réévaluer régulièrement** : Prévoir une réévaluation tous les 6 mois
- **Notifier l'entreprise** : Informer la solution de son score et lui laisser la possibilité de corriger les points faibles avant publication
- **Cohérence** : Utiliser les mêmes exigences pour toutes les solutions, qu'elles soient membres du collectif ou non
