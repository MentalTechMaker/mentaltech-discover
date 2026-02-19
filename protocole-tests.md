# Protocole de Tests Manuels — MentalTech Discover V2.4

**Date** : _______________
**Testeur** : _______________
**Environnement** : [ ] Local (docker compose) [ ] Production (discover.mentaltech.fr)
**Navigateur** : _______________
**Mobile testé** : [ ] Oui [ ] Non — Appareil : _______________

---

## Prérequis

1. `docker compose up --build` (ou accès à la production)
2. Base de données initialisée avec les 22 produits (seed)
3. Migrations 006 et 007 exécutées
4. Compte admin créé (`docker compose exec backend python -m scripts.create_admin`)
5. ~~Configuration SMTP fonctionnelle~~ **En local : les emails sont écrits dans `./dev-emails/` (ouvrir dans le navigateur)**

**Légende** : `[ ]` = à tester, `[OK]` = passé, `[KO]` = échoué (noter le bug)

> **💡 Emails en dev :** Quand SMTP n'est pas configuré, chaque email est sauvegardé sous `./dev-emails/*.html`. Ouvrir ce fichier dans le navigateur pour récupérer les liens de vérification, reset de mot de passe, etc.

---

## 1. Page d'accueil et Navigation

### 1.1 Chargement initial

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 1 | Ouvrir `http://localhost:3033` | La page d'accueil s'affiche avec le header, le hero, les CTA | [ ] |
| 2 | Vérifier que les 22 produits se chargent | Pas d'erreur dans la console, les produits apparaissent dans le catalogue | [ ] |
| 3 | Vérifier l'URL | Hash = `#landing` | [ ] |

### 1.2 Navigation header

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 4 | Cliquer sur "Notre démarche" | Page About s'affiche, URL = `#about` | [ ] |
| 5 | Cliquer sur "FAQ" | Page FAQ s'affiche, URL = `#faq` | [ ] |
| 6 | Cliquer sur "Catalogue" | Page catalogue s'affiche, URL = `#catalog` | [ ] |
| 7 | Cliquer sur le logo MentalTech | Retour à l'accueil, URL = `#landing` | [ ] |
| 8 | Utiliser le bouton retour du navigateur | Retour à la page précédente | [ ] |

### 1.3 Footer

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 9 | Cliquer sur "Politique de confidentialité" (footer) | Page privacy s'affiche | [ ] |
| 10 | Cliquer sur "Mentions légales" (footer) | Page legal s'affiche | [ ] |
| 11 | Cliquer sur "Méthodologie" (footer) | Page methodology s'affiche | [ ] |

### 1.4 Deep links

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 12 | Ouvrir directement `http://localhost:3033/#catalog` | Le catalogue s'affiche directement | [ ] |
| 13 | Ouvrir directement `http://localhost:3033/#faq` | La FAQ s'affiche directement | [ ] |
| 14 | Ouvrir directement `http://localhost:3033/#blabla` | Redirigé vers l'accueil (URL invalide) | [ ] |

---

## 2. Questionnaire (Quiz)

### Précondition : Non connecté

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 15 | Cliquer sur "Trouver ma solution" (accueil) | Le quiz démarre, première question affichée | [ ] |
| 16 | Sélectionner "Particulier" | Passe aux questions individuelles | [ ] |
| 17 | Répondre à toutes les questions (5) | Chaque réponse avance à la question suivante | [ ] |
| 18 | Cliquer "Précédent" sur la question 3 | Retour à la question 2 avec la réponse conservée | [ ] |
| 19 | Terminer le quiz | Page résultats avec des solutions triées par pertinence | [ ] |
| 20 | Vérifier les scores de recommandation | Chaque solution a un pourcentage de match cohérent | [ ] |
| 21 | Relancer le quiz en mode "Entreprise" | Questions différentes (taille, besoins) | [ ] |
| 22 | Terminer le quiz entreprise | Résultats avec solutions B2B | [ ] |

---

## 3. Catalogue

### 3.1 Affichage et recherche

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 23 | Ouvrir le catalogue | Les 22 produits s'affichent en grille | [ ] |
| 24 | Taper "Qare" dans la recherche | Filtrage en temps réel, seul Qare apparaît | [ ] |
| 25 | Effacer la recherche | Tous les produits réapparaissent | [ ] |

### 3.2 Filtres

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 26 | Filtrer par type "Téléconsultation" | Seules les solutions de téléconsultation apparaissent | [ ] |
| 27 | Filtrer par audience "Adolescents" | Seules les solutions pour adolescents | [ ] |
| 28 | Filtrer par tarification "Freemium" | Seules les solutions freemium (aucun produit n'est "Gratuit" dans le catalogue) | [ ] |
| 29 | Filtrer par label "A" | Seules les solutions label A | [ ] |
| 30 | Combiner 2 filtres | L'intersection fonctionne | [ ] |
| 31 | Réinitialiser les filtres | Tous les produits réapparaissent | [ ] |
| 32 | Trier par "Meilleur label" | Les solutions sont ordonnées par score décroissant | [ ] |

### 3.3 Fiches produit

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 33 | Cliquer sur une solution dans le catalogue | La fiche produit s'ouvre, URL = `#product/{id}` | [ ] |
| 34 | Vérifier : nom, description, tagline, type, logo | Toutes les infos affichées correctement | [ ] |
| 35 | Vérifier les scores (barres de progression) | 5 barres (sécurité, efficacité, accessibilité, UX, support) | [ ] |
| 36 | Vérifier le label (badge A-E) | Badge coloré cohérent avec le score total | [ ] |
| 37 | Vérifier la tarification | Modèle + montant affichés | [ ] |
| 38 | Cliquer sur "Visiter le site" | Lien externe s'ouvre dans un nouvel onglet | [ ] |
| 39 | Vérifier le badge "Membre du Collectif" | Affiché si `isMentaltechMember = true` | [ ] |
| 40 | Bouton retour | Retour au catalogue | [ ] |

---

## 4. Authentification

### 4.1 Inscription utilisateur

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 41 | Mon compte > Inscription | Page d'inscription s'affiche | [ ] |
| 42 | Remplir nom, email, mot de passe | Formulaire accepte les données | [ ] |
| 43 | Mot de passe trop court (< 8 car.) | Message d'erreur, inscription bloquée | [ ] |
| 44 | Email invalide (ex: "pas-un-email") | Message d'erreur lisible (ex: "value is not a valid email address"), **pas** `[object Object]` | [ ] |
| 45 | Soumettre avec des données valides | Inscription réussie, redirection vers l'accueil, connecté | [ ] |
| 46 | Vérifier l'email de vérification | Un fichier `.html` apparaît dans `./dev-emails/` — l'ouvrir dans le navigateur | [ ] |
| 47 | Cliquer sur le lien de vérification (dans le fichier) | Page "Email vérifié avec succès" | [ ] |
| 48 | Réessayer de s'inscrire avec le même email | Erreur "Un compte avec cet email existe déjà" | [ ] |

### 4.2 Connexion / Déconnexion

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 49 | Mon compte > Connexion | Page de connexion s'affiche | [ ] |
| 50 | Email + mot de passe corrects | Connecté, nom affiché dans le header | [ ] |
| 51 | Mauvais mot de passe | Message d'erreur "Identifiants incorrects" | [ ] |
| 52 | Email inexistant | Message d'erreur (même message, anti-énumération) | [ ] |
| 53 | Menu Mon compte > Déconnexion | Déconnecté, retour à l'accueil | [ ] |

### 4.3 Profil

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 54 | Mon compte > Mon profil (connecté) | Page profil avec nom, email, rôle | [ ] |
| 55 | Changer le mot de passe (ancien correct + nouveau) | Succès, message de confirmation | [ ] |
| 56 | Changer le mot de passe (ancien incorrect) | Erreur "Mot de passe actuel incorrect" | [ ] |
| 57 | Se déconnecter et reconnecter avec le nouveau MDP | Connexion réussie | [ ] |

### 4.4 Mot de passe oublié

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 58 | Page connexion > "Mot de passe oublié" | Formulaire de reset s'affiche | [ ] |
| 59 | Entrer un email existant | Message "Si ce compte existe, un email a été envoyé" + fichier dans `./dev-emails/` | [ ] |
| 60 | Entrer un email inexistant | Même message (anti-énumération), pas de fichier créé | [ ] |
| 61 | Ouvrir le fichier dev-emails, cliquer sur le lien de reset | Page de réinitialisation avec champ nouveau MDP | [ ] |
| 62 | Entrer un nouveau mot de passe | Succès, possibilité de se connecter avec le nouveau MDP | [ ] |
| 63 | Réutiliser le même lien de reset | Erreur "Lien expiré ou invalide" | [ ] |

### 4.5 Persistance de session

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 64 | Se connecter, fermer l'onglet, le rouvrir | Toujours connecté (refresh token) | [ ] |
| 65 | Se connecter, attendre 31 min (ou modifier le token) | Le token se rafraîchit automatiquement, pas de déconnexion | [ ] |

---

## 5. Inscription Prescripteur

### Précondition : Non connecté

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 66 | Mon compte > Inscription > lien "Inscription Prescripteur →" en bas de page | Formulaire d'inscription prescripteur s'affiche | [ ] |
| 67 | Remplir : nom, email, MDP, profession, organisation, RPPS | Formulaire accepte les données | [ ] |
| 68 | Soumettre | Inscription réussie, connecté comme prescripteur | [ ] |
| 69 | Vérifier le profil | Affiche profession, organisation, RPPS/ADELI | [ ] |
| 70 | Vérifier le statut prescripteur dans le profil | Badge orange **"En attente de validation"** visible (distinct du statut email) | [ ] |

---

## 6. Administration

### Précondition : Connecté comme admin

### 6.1 CRUD Produits

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 71 | Mon compte > Administration | Panel admin s'affiche avec 3 onglets : **Produits / Prescripteurs / Veille** | [ ] |
| 72 | Onglet Produits > Créer un nouveau produit | Formulaire s'ouvre | [ ] |
| 73 | Dans le formulaire, cliquer "Choisir un fichier" (champ Logo) | Sélecteur de fichier s'ouvre (PNG, JPG, SVG, WebP acceptés) | [ ] |
| 74 | Uploader un logo | Aperçu du logo apparaît sous le champ, chemin `/uploads/logos/xxx` renseigné automatiquement | [ ] |
| 75 | Remplir tous les champs et créer | Produit créé avec logo, apparaît dans la liste | [ ] |
| 76 | Modifier un produit existant | Modifications sauvegardées | [ ] |
| 77 | Ajouter des scores qualité (5 critères + justifications) | Scores affichés avec preview en temps réel | [ ] |
| 78 | Vérifier la fiche produit (côté utilisateur) | Scores + label + justifications (visibles si prescripteur/admin) | [ ] |
| 79 | Supprimer le produit de test | Produit supprimé, n'apparaît plus dans le catalogue | [ ] |

### 6.2 Validation des prescripteurs

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 80 | Onglet "Prescripteurs" dans le panel admin | Liste des prescripteurs avec statut (En attente / Vérifié) | [ ] |
| 81 | Cocher "Afficher uniquement En attente" | Seuls les prescripteurs non vérifiés apparaissent | [ ] |
| 82 | Cliquer "Valider" sur un prescripteur | Statut passe à badge vert "Vérifié" | [ ] |
| 83 | Cliquer "Révoquer" sur un prescripteur vérifié | Statut repasse à "En attente" | [ ] |
| 84 | Se connecter avec le prescripteur validé | Accès aux fonctionnalités prescripteur (menu header) | [ ] |

### 6.3 Mises à jour produits (Veille)

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 85 | Onglet "Veille / Mises à jour" dans le panel admin | Formulaire de création de mise à jour | [ ] |
| 86 | Sélectionner un produit, type "price_change", remplir titre | Formulaire accepte les données | [ ] |
| 87 | Soumettre | Message "Mise à jour créée avec succès !", formulaire réinitialisé | [ ] |
| 88 | Créer des mises à jour de types variés (score_change, new_feature, study, general) | Chaque type accepté | [ ] |

---

## 7. Espace Prescripteur

### Précondition : Connecté comme prescripteur vérifié

### 7.1 Header et navigation

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 89 | Cliquer sur "Mon compte" dans le header | Menu déroulant avec : Mon profil, Tableau de bord, Nouvelle prescription, Veille solutions, Comparateur | [ ] |
| 90 | Vérifier que ces options n'apparaissent PAS pour un utilisateur standard | Menu standard : Mon profil, Déconnexion uniquement | [ ] |

### 7.2 Tableau de bord

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 91 | Mon compte > Tableau de bord | Dashboard s'affiche avec les 4 stats (total, ce mois, consultées, favoris) | [ ] |
| 92 | Vérifier l'onglet "Mes prescriptions" | Liste (vide si nouveau prescripteur) avec bouton "Nouvelle prescription" | [ ] |
| 93 | Vérifier l'onglet "Mes favoris" | Grille de favoris (vide si aucun) | [ ] |
| 94 | Vérifier l'onglet "Communauté" | Statistiques anonymisées des prescriptions | [ ] |

### 7.3 Nouvelle prescription

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 95 | Mon compte > Nouvelle prescription | Formulaire en 3 étapes, étape 1 : sélection produits | [ ] |
| 96 | Chercher un produit par nom | Filtrage en temps réel dans la liste | [ ] |
| 97 | Sélectionner 1 produit | Produit sélectionné (chip affiché en haut), bouton "Suivant" actif | [ ] |
| 98 | Sélectionner 5 produits | 5 chips affichés, les autres produits sont désactivés (limite) | [ ] |
| 99 | Essayer de sélectionner un 6ème | Impossible (max 5) | [ ] |
| 100 | Désélectionner un produit | Chip retiré, produit re-sélectionnable | [ ] |
| 101 | Cliquer "Suivant" | Étape 2 : infos patient (nom, email, message — tous optionnels) | [ ] |
| 102 | Remplir le nom du patient et un message | Champs acceptés | [ ] |
| 103 | Cliquer "Suivant" | Étape 3 : confirmation avec résumé des produits et infos patient | [ ] |
| 104 | Cliquer "Créer la prescription" | Succès : lien généré affiché dans un champ | [ ] |
| 105 | Cliquer "Copier le lien" | Lien copié dans le presse-papiers, texte du bouton change ("Copié !") | [ ] |
| 106 | Cliquer "Retour au tableau de bord" | Retour au dashboard, la prescription apparaît dans la liste | [ ] |

### 7.4 Gestion des prescriptions

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 107 | Sur le dashboard, vérifier le statut de la prescription | Badge jaune "En attente" (pas encore consultée) | [ ] |
| 108 | Cliquer "Copier le lien" sur une prescription | Lien copié | [ ] |
| 109 | Ouvrir le lien en navigation privée (voir test 7.7) | La prescription est consultée | [ ] |
| 110 | Revenir au dashboard, rafraîchir | Le statut passe à vert "Consultée" | [ ] |
| 111 | Supprimer une prescription (bouton supprimer) | Confirmation demandée, puis prescription supprimée de la liste | [ ] |
| 112 | Vérifier les statistiques (barre du haut) | Les chiffres sont cohérents (total, ce mois, consultées) | [ ] |

### 7.5 Favoris

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 113 | Aller dans le catalogue, ouvrir une fiche produit | Fiche produit s'affiche | [ ] |
| 114 | Ajouter le produit en favori (si bouton disponible) ou via l'API | Favori ajouté | [ ] |
| 115 | Aller sur le dashboard > onglet "Mes favoris" | Le produit apparaît dans la grille | [ ] |
| 116 | Cliquer "Voir fiche" sur un favori | La fiche produit s'ouvre | [ ] |
| 117 | Cliquer "Retirer" sur un favori | Le produit disparaît de la liste des favoris | [ ] |

### 7.6 Veille solutions

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 118 | Mon compte > Veille solutions | Page de veille avec les mises à jour produits | [ ] |
| 119 | Vérifier que les mises à jour créées par l'admin (tests #86-88) apparaissent | Mises à jour listées avec icône, titre, description, date | [ ] |
| 120 | Basculer sur "Mes favoris uniquement" | Seules les mises à jour des produits favoris apparaissent | [ ] |
| 121 | Basculer sur "Toutes les mises à jour" | Toutes les mises à jour réapparaissent | [ ] |
| 122 | Vérifier les dates relatives | "il y a X minutes/heures" affiché correctement en français | [ ] |

### 7.7 Vue prescription patient (page publique)

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 123 | Ouvrir le lien de prescription dans un navigateur non connecté | Page publique s'affiche avec le titre "Prescription MentalTech" | [ ] |
| 124 | Vérifier les infos du prescripteur | Nom, profession, organisation affichés | [ ] |
| 125 | Vérifier le message personnalisé | Le message saisi à l'étape 102 est affiché | [ ] |
| 126 | Vérifier les produits recommandés | Les produits sélectionnés sont affichés en cartes (nom, type, tagline, label, tarif) | [ ] |
| 127 | Cliquer "Découvrir" sur un produit | Le lien externe de la solution s'ouvre dans un nouvel onglet | [ ] |
| 128 | Vérifier le disclaimer d'urgence | Numéros 3114 et 15 affichés en bas de page | [ ] |
| 129 | Ouvrir un lien de prescription **expirée** (> 30 jours) | Bannière "Cette prescription a expiré" affichée | [ ] |
| 130 | Ouvrir un lien de prescription **invalide** (`#prescription/token-bidon`) | Message d'erreur "Prescription introuvable" | [ ] |

### 7.8 Comparateur

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 131 | Mon compte > Comparateur | Page comparateur, étape 1 : sélection de produits | [ ] |
| 132 | Chercher un produit par nom | Filtrage en temps réel | [ ] |
| 133 | Sélectionner 1 seul produit | Bouton "Comparer" désactivé (min 2) | [ ] |
| 134 | Sélectionner 2 produits | Bouton "Comparer" actif | [ ] |
| 135 | Sélectionner 4 produits | 4 sélectionnés, les autres désactivés (max 4) | [ ] |
| 136 | Cliquer "Comparer" | Étape 2 : tableau comparatif côte-à-côte | [ ] |
| 137 | Vérifier les scores (5 barres par produit) | Barres de progression affichées pour chaque critère | [ ] |
| 138 | Vérifier la tarification | Modèle + montant par produit | [ ] |
| 139 | Vérifier l'audience et les problèmes traités | Tags affichés pour chaque produit | [ ] |
| 140 | Cliquer "Nouvelle comparaison" | Retour à l'étape 1, sélection réinitialisée | [ ] |

---

## 8. Sécurité et Permissions

### 8.1 Protection des routes

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 141 | Non connecté : ouvrir `#admin` | Accès refusé ou redirection | [ ] |
| 142 | Non connecté : ouvrir `#profile` | Accès refusé ou redirection | [ ] |
| 143 | Non connecté : ouvrir `#prescriber-dashboard` | Accès refusé ou redirection | [ ] |
| 144 | Connecté comme user standard : ouvrir `#admin` | Accès refusé | [ ] |
| 145 | Connecté comme user standard : ouvrir `#prescriber-dashboard` | Accès refusé ou message "Vous n'êtes pas prescripteur" | [ ] |
| 146 | Connecté comme prescripteur : ouvrir `#admin` | Accès refusé | [ ] |

### 8.2 Protection API

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 147 | Appeler `POST /api/prescriptions` sans token | 401 Unauthorized | [ ] |
| 148 | Appeler `POST /api/prescriptions` avec un token user (pas prescripteur) | 403 Forbidden | [ ] |
| 149 | Appeler `GET /api/admin/prescribers` avec un token prescripteur | 403 Forbidden | [ ] |
| 150 | Appeler `GET /api/prescriptions/view/{token}` sans auth | 200 OK (endpoint public) | [ ] |
| 151 | Appeler `POST /api/admin/upload-logo` sans token admin | 401 ou 403 | [ ] |

### 8.3 Liens externes

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 152 | Cliquer un lien externe (site d'une solution) | Ouvre dans un nouvel onglet avec `rel="noopener noreferrer"` | [ ] |
| 153 | Vérifier dans le code source d'une fiche produit | Tous les liens externes ont `target="_blank" rel="noopener noreferrer"` | [ ] |

---

## 9. Responsive / Mobile

### Tester sur un smartphone ou DevTools (mode responsive)

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 154 | Page d'accueil en mobile | Layout adapté, pas de scroll horizontal | [ ] |
| 155 | Header en mobile | Menu hamburger ou menu réduit fonctionnel | [ ] |
| 156 | Catalogue en mobile | Grille 1 colonne, filtres accessibles | [ ] |
| 157 | Fiche produit en mobile | Contenu lisible, barres de scoring visibles | [ ] |
| 158 | Quiz en mobile | Questions lisibles, boutons cliquables | [ ] |
| 159 | Formulaire d'inscription en mobile | Champs pleine largeur, clavier correct | [ ] |
| 160 | Dashboard prescripteur en mobile | Onglets accessibles, stats lisibles | [ ] |
| 161 | Nouvelle prescription en mobile | 3 étapes fonctionnelles, sélection de produits tactile | [ ] |
| 162 | Comparateur en mobile | Tableau scrollable horizontalement | [ ] |
| 163 | Vue prescription patient en mobile | Cartes produits empilées, lisible | [ ] |

---

## 10. Cas limites et erreurs

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 164 | Couper le backend, charger le frontend | Message d'erreur gracieux (pas de page blanche) | [ ] |
| 165 | Créer une prescription avec 0 produits | Erreur "Sélectionnez au moins 1 solution" | [ ] |
| 166 | Créer une prescription avec un product_id inexistant (via API) | Erreur 400 | [ ] |
| 167 | Comparer avec 1 seul produit (via API `?ids=un-seul`) | Erreur 400 "Sélectionnez entre 2 et 4 solutions" | [ ] |
| 168 | Comparer avec 5 produits (via API) | Erreur 400 | [ ] |
| 169 | Double-cliquer rapidement sur "Créer la prescription" | Une seule prescription créée (pas de doublon) | [ ] |
| 170 | Ajouter le même produit en favori 2 fois (via API) | Erreur 409 Conflict | [ ] |
| 171 | Uploader un logo > 2 Mo via l'admin | Erreur "Fichier trop volumineux (max 2 Mo)" | [ ] |
| 172 | Uploader un fichier non-image (ex: `.pdf`) via l'admin | Erreur "Type de fichier non supporté" | [ ] |

---

## 11. Performance

| # | Étape | Résultat attendu | Status |
|---|-------|-------------------|--------|
| 173 | Temps de chargement initial (page d'accueil) | < 3 secondes | [ ] |
| 174 | Temps de chargement du catalogue (22 produits) | < 2 secondes | [ ] |
| 175 | Temps de création d'une prescription | < 1 seconde | [ ] |
| 176 | Aucune erreur dans la console JavaScript | 0 erreurs (les warnings sont acceptables) | [ ] |

---

## Résumé

| Section | Tests | Passés | Échoués |
|---------|-------|--------|---------|
| 1. Navigation | 14 | __ | __ |
| 2. Quiz | 8 | __ | __ |
| 3. Catalogue | 18 | __ | __ |
| 4. Auth | 25 | __ | __ |
| 5. Inscription Prescripteur | 5 | __ | __ |
| 6. Administration | 18 | __ | __ |
| 7. Espace Prescripteur | 52 | __ | __ |
| 8. Sécurité | 13 | __ | __ |
| 9. Responsive | 10 | __ | __ |
| 10. Cas limites | 9 | __ | __ |
| 11. Performance | 4 | __ | __ |
| **TOTAL** | **176** | **__** | **__** |

---

## Bugs trouvés

| # Test | Description du bug | Sévérité (Bloquant/Majeur/Mineur) | Corrigé ? |
|--------|--------------------|------------------------------------|-----------|
| | | | |
| | | | |
| | | | |

---

## Décision de release

| Critère | Seuil | Résultat |
|---------|-------|----------|
| 0 bug bloquant | Obligatoire pour la release | [ ] OK [ ] KO |
| 0 bug majeur sur les fonctionnalités prescripteur | Obligatoire (c'est la V2.4) | [ ] OK [ ] KO |
| Tests sécurité 141-153 tous passés | Obligatoire | [ ] OK [ ] KO |
| > 90% des tests passés (> 158/176) | Recommandé | [ ] OK [ ] KO |

**Décision** : [ ] GO — Déployer en production [ ] NO GO — Corriger d'abord les bugs listés

**Signature** : _______________
**Date** : _______________
