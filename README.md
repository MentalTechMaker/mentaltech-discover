# MentalTech Discover

**MentalTech Discover** est une plateforme créée par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à trouver la solution digitale en santé mentale adaptée à leurs besoins.

> ⚕️ **Important** : MentalTech Discover est un outil de découverte, pas un dispositif médical. En cas d'urgence, appelez le **3114** (prévention suicide) ou le **15** (SAMU).

---

## 🎯 À propos

MentalTech Discover référence les solutions des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- 🧭 **Questionnaire personnalisé** - Recommandations sur-mesure en 3-5 minutes
- 📚 **Catalogue complet** - Filtres avancés par type, audience, problématique, tarification
- 🎯 **Algorithme de matching P1/P2/P3** - Scoring intelligent base sur les priorites editeur
- 📄 **Fiches produit** - Page dediee par solution avec positionnement P1/P2/P3
- 💙 **Collectif MentalTech** - Badge d'appartenance au collectif
- 🔒 **Authentification** - Inscription, connexion, panel d'administration
- 🩺 **Espace Prescripteur** - Prescriptions digitales, favoris, notes cliniques, veille
- 🏢 **Espace Éditeur** - Soumission de produits par les éditeurs de solutions
- 📖 **Open Source** - Code transparent sous licence MIT

---

## ✨ Fonctionnalités

### 🧭 Recommandations personnalisées

Un questionnaire rapide analyse vos besoins selon :

- **Public** : Adultes, adolescents, enfants, parents, seniors
- **Problématiques** : Stress, anxiété, dépression, addictions, burn-out, sommeil, traumatismes
- **Préférences** : Accompagnement autonome, thérapie immédiate, programmes structurés
- **Contexte** : Solutions individuelles, entreprise ou etablissement de sante

Pendant le quiz, un **compteur en temps réel** affiche le nombre de solutions déjà détectées à mesure que l'utilisateur répond.

### 📚 Catalogue interactif

Explorez toutes les solutions avec filtres puissants :

- **Recherche textuelle** - Nom, description, tags
- **Type de service** - Téléconsultation, méditation, VR, TCC, coaching
- **Public** - Particuliers, Entreprises, ou les deux
- **Audience** - Adultes, adolescents, enfants, parents, seniors
- **Problèmes traités** - 6 catégories principales
- **Tarification** - Gratuit, Freemium, Abonnement, Par séance, B2B

### 📊 Résultats et partage

- **Filtres rapides** sur les résultats : Gratuit / Payant et Avec un humain / En autonomie
- **Lien partageable** : l'URL `/results?f=...` encode les réponses du quiz pour partager ou sauvegarder ses résultats

### 🎯 Systeme de priorites P1/P2/P3

Chaque solution definit ses priorites sur deux axes :

**Public cible** (audience) et **Problematiques adressees** (problemes), classes en 3 niveaux :

| Niveau | Signification | Points dans l'algorithme |
|--------|---------------|-------------------------|
| **P1** | Coeur de cible | 30 pts |
| **P2** | Secondaire | 18 pts |
| **P3** | Compatible | 8 pts |

- Maximum **3 items par niveau** pour forcer la specialisation
- Les priorites sont definies par l'editeur de la solution
- Un disclaimer indique que les informations sont fournies par l'editeur
- Les membres du Collectif MentalTech beneficient d'un bonus de 8 pts dans le classement

**Score de matching** : Audience (30) + Probleme (30) + Format (15) + Collectif (8) + Contexte (10) = **93 pts max**

Le protocole d'analyse complet est documente dans [`protocole.md`](protocole.md).

### 📄 Fiches produit

Chaque solution dispose d'une page dédiée accessible depuis le catalogue ou les résultats du quiz :

- Informations completes (description, public, tarification, tags)
- Positionnement P1/P2/P3 (audiences et problematiques par priorite)
- Badge "Membre du Collectif MentalTech"
- Notes cliniques (prescripteurs uniquement)
- Lien direct vers le site de la solution

### 🔐 Authentification et Administration

- **Inscription / Connexion** - JWT avec access token (30 min) + refresh token (7 jours, HttpOnly cookie)
- **Page profil** - Consultation des informations du compte et changement de mot de passe
- **Vérification email** - Email de confirmation envoyé à l'inscription avec lien sécurisé (24h)
- **Mot de passe oublié** - Réinitialisation par email avec lien temporaire (1h)
- **Panel Admin** - CRUD complet sur les produits (ajout, modification, suppression)
- **Priorites P1/P2/P3** - Gestion des priorites audience et problemes par produit
- **Visibilité produits** - Masquer/afficher un produit ou le marquer "Entreprise défunte" sans le supprimer
- **Rôles** - Utilisateur standard, prescripteur (professionnel de santé), éditeur et administrateur

### 🩺 Espace Prescripteur (Premium)

Un espace dédié aux professionnels de santé (psychologues, psychiatres, médecins) qui transforme MentalTech Discover en outil de travail quotidien :

#### Inscription prescripteur

- **Formulaire dédié** - Inscription avec profession, organisation et numéro RPPS/ADELI
- **Validation admin** - Les prescripteurs doivent être vérifiés par un administrateur
- **Rôle spécifique** - Accès aux fonctionnalités premium après validation
- **Onboarding guidé** - 3 étapes au premier login pour découvrir les fonctionnalités (catalogue → favoris → prescription)

#### Ordonnance digitale

- **Création de prescriptions** - Sélection de 1 à 5 solutions avec message personnalisé
- **Lien partageable** - Lien unique sécurisé (token 48 caractères) valide 30 jours
- **QR code** - Code QR généré automatiquement à la confirmation pour faciliter le partage en consultation
- **Page patient** - Le patient voit les solutions recommandées avec infos du prescripteur
- **Suivi** - Notification quand le patient consulte la prescription

#### Workflows prescripteur optimisés

- **Favoris en tête** - Les solutions favorites apparaissent en priorité lors de la création d'une prescription
- **Vue rapide produit** - Panneau latéral (drawer) pour consulter les détails d'un produit sans quitter la prescription en cours
- **Filtre favoris** - Bascule "Tous les produits / ⭐ Mes favoris" dans la liste de sélection

#### Tableau de bord

- **Statistiques** - Total prescriptions, ce mois-ci, consultées, favoris
- **Historique** - Liste des prescriptions avec statut (consultée, en attente, expirée)
- **Actions rapides** - Copier le lien, supprimer une prescription
- **Top produits** - Solutions les plus prescrites

#### Favoris et Notes

- **Favoris** - Marquer des solutions pour y accéder rapidement
- **Notes cliniques** - Prendre des notes personnelles sur chaque solution (upsert)

#### Veille solutions

- **Flux de mises a jour** - Changements de tarifs, nouvelles etudes, nouvelles fonctionnalites
- **Filtre favoris** - Ne voir que les mises a jour de ses solutions favorites
- **Types d'updates** - Prix, fonctionnalite, etude, general

#### Statistiques communauté

- **Données anonymisées** - Nombre de prescripteurs et prescriptions par solution
- **Top solutions** - Les 20 solutions les plus prescrites

### 🏢 Soumission de solutions (Editeurs)

Un parcours ouvert permettant a tout editeur de soumettre sa solution :

- **Formulaire public** - Soumission sans compte via le bouton "Referencer" dans le header
- **Multi-etapes** - Informations produit, tarification, priorites P1/P2/P3
- **Selecteur P1/P2/P3** - L'editeur definit ses audiences et problematiques par priorite (max 3 par niveau)
- **Disclaimer** - Les informations sont sous la responsabilite de l'editeur
- **Consentement RGPD** - Checkbox obligatoire avant soumission
- **Sauvegarde automatique** - Brouillon sauvegarde toutes les 30 secondes dans le navigateur
- **Anti-bot** - Honeypot + delai minimum de soumission
- **Confirmation email** - Lien de validation 48h avant transmission a l'admin
- **Email recapitulatif** - Recapitulatif des informations soumises envoye a la confirmation
- **Option Collectif** - Demande d'adhesion au Collectif MentalTech integree

### 🌐 Soumission Publique (sans compte)

Un parcours ouvert permettant a tout editeur de soumettre sa solution sans creer de compte :

- **Formulaire multi-etapes** - Informations produit et positionnement P1/P2/P3
- **Anti-bot** - Honeypot champ caché + délai minimum de soumission (3s)
- **Confirmation par email** - Lien de confirmation (48h) avant transmission à l'admin
- **Demande d'adhésion au Collectif** - Option pour demander à rejoindre le MentalTech Collectif lors de la soumission
- **Notifications admin** - Email reçu à chaque soumission confirmée (nom contact, produit, statut collectif)
- **Gestion admin** - Interface dédiée dans le panel admin pour examiner, approuver ou refuser les soumissions publiques

### 🤝 Candidature Professionnel de Santé

Un formulaire dédié aux professionnels de santé souhaitant rejoindre le MentalTech Collectif :

- **Formulaire de candidature** - Nom, email, profession, numéro RPPS/ADELI, établissement, motivation
- **Anti-bot** - Honeypot + délai minimum de soumission
- **Confirmation par email** - Lien de confirmation (48h) avant transmission à l'admin
- **Notification admin** - Email avec toutes les informations de candidature à la confirmation
- **Gestion admin** - Interface pour accepter ou refuser les candidatures

### 🚪 Page "Rejoindre le Collectif"

Point d'entrée unique pour intégrer l'écosystème MentalTech :

- **Deux parcours** - Éditeur de solution (soumission produit) et Professionnel de santé (candidature)
- **Accessible depuis le header** - Bouton "Référencer" dans la navigation

### 🛡️ Sécurité et Transparence

- ✅ **Disclaimers médicaux** - Avertissement compact visible sur la page d'accueil + numéros d'urgence (3114, 15, 112)
- ✅ **Critères de référencement** - Page "Notre Démarche" transparente
- ✅ **FAQ complète** - Questions fréquentes organisées
- ✅ **Signalement facile** - Boutons de signalement sur chaque solution

### 📊 Analytics privacy-first

- **Plausible Analytics** - Sans cookies, respectueux du RGPD
- **Métriques anonymes** - Navigation et interactions uniquement
- **Open source** - Code d'analytics auditable

---

## 🏗️ Stack Technique

### Frontend

- **React 19** + TypeScript
- **Zustand 5** - State management
- **Tailwind CSS 4** - Styling
- **Vite 7** - Build tool
- **qrcode.react** - Génération de QR codes
- **Plausible** - Analytics privacy-first

### Backend

- **FastAPI** (Python 3.11)
- **SQLAlchemy 2** - ORM
- **PostgreSQL 16** - Base de données
- **JWT** (python-jose) - Authentification
- **bcrypt** (passlib) - Hashage des mots de passe
- **fastapi-mail** + **Jinja2** - Envoi d'emails transactionnels (vérification, reset)

### Infrastructure

- **Docker Compose** - Orchestration 4 services (db, backend, frontend, backup)
- **Nginx** - Reverse proxy + serveur statique
- **PostgreSQL 16 Alpine** - Base de données
- **Backup automatique** - Container dedie avec cron configurable et chiffrement optionnel

### Securite Docker

- **Reseaux isoles** - `db-network` (backend + backup uniquement) et `frontend-network` (backend + frontend)
- **Backend non expose** - Port 8000 accessible uniquement via le reseau Docker interne
- **Capabilities Linux** - `cap_drop: ALL` sur tous les containers, ajout minimal (CHOWN, SETGID, SETUID pour nginx)
- **Filesystem read-only** - Frontend en lecture seule (tmpfs pour /tmp et cache nginx)
- **Anti-escalade** - `no-new-privileges: true` sur tous les containers
- **Limites de ressources** - CPU et memoire plafonnes par container

---

## 🚀 Démarrage Rapide

### Avec Docker (recommandé)

```bash
# Cloner le repository
git clone https://github.com/mentaltechmaker/mentaltech-discover.git
cd mentaltech-discover

# Copier la configuration
cp .env.example .env

# Démarrer les 4 services (db + backend + frontend + backup)
docker compose up --build

# Créer le premier administrateur
docker compose exec backend python -m scripts.create_admin
```

L'application sera disponible sur :
- **Frontend** : http://localhost:3033
- **API** : http://localhost:8000
- **API Docs** : http://localhost:8000/api/docs

### Développement local (frontend uniquement)

```bash
cd frontend
bun install
bun run dev
```

Le proxy Vite redirige `/api` vers `http://localhost:8000`.

### Développement local (backend uniquement)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 📖 Guide d'utilisation

### Pour les utilisateurs

1. **Questionnaire** - Cliquez sur "Trouver ma solution" depuis la page d'accueil, répondez aux questions en 3-5 minutes
2. **Résultats** - Consultez les solutions recommandées, triées par pertinence - utilisez les filtres Gratuit/Payant et Autonomie/Humain pour affiner
3. **Catalogue** - Cliquez sur "Explorer toutes les solutions" pour parcourir le catalogue avec les filtres (type, audience, tarification)
4. **Fiche produit** - Cliquez sur une solution pour voir le detail : positionnement, description, tarification, lien direct

### Pour les prescripteurs (professionnels de santé)

1. **Inscription** - Cliquez sur "Mon compte" > "Inscription", puis choisissez "Inscription Prescripteur"
2. **Renseignez vos informations** - Profession, organisation, numéro RPPS/ADELI
3. **Validation** - Un administrateur valide votre compte (nécessaire pour accéder aux fonctionnalités premium)
4. **Onboarding** - Dès votre premier login, un guide en 3 étapes vous présente les fonctionnalités clés
5. **Tableau de bord** - Accédez à vos stats, prescriptions, favoris et données communautaires
6. **Nouvelle prescription** - Sélectionnez 1-5 solutions (vos favoris sont en tête de liste), utilisez le panneau rapide pour consulter un produit, ajoutez un message, copiez le lien ou scannez le QR code pour l'envoyer au patient
7. **Veille** - Consultez les mises a jour des solutions (tarifs, etudes, fonctionnalites)
8. **Notes cliniques** - Prenez des notes personnelles sur chaque solution depuis la fiche produit

### Pour les editeurs (soumission publique)

1. **Acceder au formulaire** - Cliquez sur "Referencer" dans le header ou via la page "Rejoindre le Collectif"
2. **Remplir le formulaire** - Suivez les etapes : informations produit, tarification, priorites P1/P2/P3
3. **Confirmer par email** - Un lien de confirmation (48h) vous est envoyé pour valider la soumission
4. **Validation admin** - Un administrateur examine et valide (ou refuse) votre soumission

### Pour les administrateurs

1. **Panel admin** - CRUD complet sur les produits (ajout, modification, suppression, scoring)
2. **Visibilité** - Masquer/afficher un produit ou le marquer "Entreprise défunte" sans supprimer les données
3. **Gestion prescripteurs** - Valider ou refuser les inscriptions prescripteurs
4. **Gestion soumissions** - Examiner les soumissions des éditeurs, les valider ou les refuser
5. **Veille** - Créer des mises à jour produits visibles par les prescripteurs

---

## 📦 Structure du Projet

```
mentaltech-discover/
├── frontend/                # Application React
│   ├── src/
│   │   ├── api/            # Couche API (client, auth, products, prescriber, publisher)
│   │   ├── components/     # Composants React
│   │   │   ├── Admin/      # Panel admin (produits, prescripteurs, soumissions, candidatures)
│   │   │   ├── Auth/       # Pages login / register / profil / reset password
│   │   │   ├── Disclaimer/ # Avertissement médical compact (non-collapsible)
│   │   │   ├── Layout/     # Header, Footer
│   │   │   ├── Prescriber/ # Dashboard, prescriptions, veille, notes cliniques, quick view, onboarding
│   │   │   ├── Publisher/  # Formulaire de soumission
│   │   │   ├── Public/     # Soumission publique, candidature pro santé, page collectif
│   │   │   ├── ProductCatalog/
│   │   │   ├── Quiz/
│   │   │   └── Results/
│   │   ├── data/           # Questions, moteur de recommandation P1/P2/P3
│   │   ├── lib/            # Analytics
│   │   ├── store/          # Zustand (app, auth, products)
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Fonctions utilitaires (scoring, security)
│   ├── public/             # Assets statiques et logos
│   ├── Dockerfile          # Image multi-stage (node + nginx)
│   ├── nginx.conf          # Config Nginx avec proxy API
│   └── package.json
│
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/         # Modèles SQLAlchemy (User, Product, Prescription, ProductSubmission, PublicSubmission, HealthProfApplication, etc.)
│   │   ├── schemas/        # Schémas Pydantic (validation)
│   │   ├── routers/        # Endpoints API (auth, products, prescriptions, prescriber, admin, publisher, public)
│   │   ├── services/       # Logique métier (JWT, CRUD, email)
│   │   ├── templates/      # Templates HTML emails (15 templates Jinja2)
│   │   ├── config.py       # Configuration (pydantic-settings)
│   │   ├── database.py     # Connexion SQLAlchemy
│   │   ├── dependencies.py # Guards (auth, admin, prescriber, publisher)
│   │   └── main.py         # Point d'entrée FastAPI
│   ├── scripts/            # Scripts utilitaires
│   │   └── create_admin.py # Création admin initial
│   ├── tests/              # Tests pytest (27 tests)
│   ├── Dockerfile
│   └── requirements.txt
│
├── database/                # PostgreSQL
│   ├── init/
│   │   ├── 01_schema.sql   # Schema complet (users, products, prescriptions, favoris, notes, veille, soumissions, triggers)
│   │   └── 02_seed_products.sql  # Produits pre-charges avec P1/P2/P3
│   └── migrations/
│       └── 001_add_priorities.sql  # Migration P1/P2/P3 pour bases existantes
│
├── scripts/                  # Scripts d'exploitation
│   ├── backup.sh            # Backup PostgreSQL + uploads
│   ├── restore.sh           # Restauration depuis backup
│   ├── maintenance.sh       # Maintenance automatisée
│   └── docker-backup-entrypoint.sh  # Entrypoint du container backup
│
├── _docs/                    # Documentation interne (audits, runbooks, protocoles de test)
├── protocole.md              # Protocole d'analyse des solutions
├── docker-compose.yml        # Orchestration 4 services
└── .env.example              # Variables d'environnement
```

---

## 🔌 API Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/auth/register` | - | Inscription utilisateur (+ email vérification) |
| `POST` | `/api/auth/register-prescriber` | - | Inscription prescripteur (profession, RPPS) |
| `POST` | `/api/auth/register-publisher` | - | Inscription éditeur |
| `POST` | `/api/auth/login` | - | Connexion (retourne JWT) |
| `POST` | `/api/auth/refresh` | - | Renouveler l'access token |
| `GET` | `/api/auth/me` | JWT | Profil utilisateur courant |
| `PUT` | `/api/auth/change-password` | JWT | Changer le mot de passe |
| `POST` | `/api/auth/forgot-password` | - | Demander un email de réinitialisation |
| `POST` | `/api/auth/reset-password` | - | Réinitialiser le mot de passe (via token) |
| `GET` | `/api/auth/verify-email` | - | Vérifier l'adresse email (via token) |
| `POST` | `/api/auth/resend-verification` | JWT | Renvoyer l'email de vérification |
| `GET` | `/api/products` | - | Liste les produits visibles (hors défunts et masqués) |
| `GET` | `/api/products/{id}` | - | Détail d'un produit |
| `POST` | `/api/products` | Admin | Créer un produit |
| `PUT` | `/api/products/{id}` | Admin | Modifier un produit |
| `DELETE` | `/api/products/{id}` | Admin | Supprimer un produit |
| | | | |
| **Prescriptions** | | | |
| `POST` | `/api/prescriptions` | Prescriber | Créer une prescription (1-5 solutions) |
| `GET` | `/api/prescriptions` | Prescriber | Lister ses prescriptions |
| `GET` | `/api/prescriptions/stats` | Prescriber | Statistiques du tableau de bord |
| `DELETE` | `/api/prescriptions/{id}` | Prescriber | Supprimer une prescription |
| `POST` | `/api/prescriptions/{id}/renew` | Prescriber | Renouveler une prescription (+30 jours, nouveau lien) |
| `GET` | `/api/prescriptions/view/{token}` | - | Vue publique patient (marque comme consultée à la 1ère visite) |
| `DELETE` | `/api/prescriptions/revoke/{token}` | - | Suppression par le patient (RGPD droit à l'effacement) |
| | | | |
| **Espace Prescripteur** | | | |
| `GET` | `/api/prescriber/favorites` | Prescriber | Lister ses favoris |
| `POST` | `/api/prescriber/favorites` | Prescriber | Ajouter un favori |
| `DELETE` | `/api/prescriber/favorites/{product_id}` | Prescriber | Retirer un favori |
| `GET` | `/api/prescriber/notes` | Prescriber | Lister ses notes |
| `PUT` | `/api/prescriber/notes` | Prescriber | Créer ou modifier une note |
| `DELETE` | `/api/prescriber/notes/{product_id}` | Prescriber | Supprimer une note |
| `GET` | `/api/prescriber/updates` | Prescriber | Veille : mises à jour produits |
| `GET` | `/api/prescriber/community-stats` | Prescriber | Statistiques communauté anonymisées |
| | | | |
| **Espace Éditeur** | | | |
| `POST` | `/api/publisher/submissions` | Publisher | Soumettre un produit |
| `GET` | `/api/publisher/submissions` | Publisher | Lister ses soumissions |
| | | | |
| **Administration** | | | |
| `GET` | `/api/admin/products` | Admin | Tous les produits (y compris masqués et défunts) |
| `PATCH` | `/api/admin/products/{id}/visibility` | Admin | Basculer la visibilité d'un produit |
| `PATCH` | `/api/admin/products/{id}/defunct` | Admin | Marquer/démarquer une entreprise défunte |
| `GET` | `/api/admin/prescribers` | Admin | Lister les prescripteurs |
| `POST` | `/api/admin/prescribers/{id}/verify` | Admin | Valider un prescripteur |
| `POST` | `/api/admin/prescribers/{id}/reject` | Admin | Refuser un prescripteur |
| `POST` | `/api/admin/product-updates` | Admin | Créer une mise à jour produit (veille) |
| `GET` | `/api/admin/submissions` | Admin | Lister les soumissions éditeurs |
| `POST` | `/api/admin/submissions/{id}/approve` | Admin | Approuver une soumission |
| `POST` | `/api/admin/submissions/{id}/reject` | Admin | Refuser une soumission |
| `GET` | `/api/stats/public` | - | Statistiques publiques (prescripteurs actifs, prescriptions créées) |
| `GET` | `/api/health` | - | Health check |
| | | | |
| **Soumission Publique** | | | |
| `POST` | `/api/public/upload-logo` | - | Upload logo (soumission publique, sans auth) |
| `POST` | `/api/public/submissions` | - | Créer une soumission publique (anti-bot, confirmation email) |
| `GET` | `/api/public/submissions/confirm` | - | Confirmer la soumission via token email (48h) |
| `POST` | `/api/public/health-pro/apply` | - | Candidature professionnel de santé (anti-bot, confirmation email) |
| `GET` | `/api/public/health-pro/confirm` | - | Confirmer la candidature via token email (48h) |
| | | | |
| **Admin - Soumissions & Candidatures** | | | |
| `GET` | `/api/admin/public-submissions` | Admin | Lister les soumissions publiques (filtre par statut) |
| `GET` | `/api/admin/public-submissions/{id}` | Admin | Détail d'une soumission publique |
| `POST` | `/api/admin/public-submissions/{id}/approve` | Admin | Approuver une soumission publique |
| `POST` | `/api/admin/public-submissions/{id}/reject` | Admin | Refuser une soumission publique |
| `GET` | `/api/admin/health-pro-applications` | Admin | Lister les candidatures pro de santé |
| `GET` | `/api/admin/health-pro-applications/{id}` | Admin | Détail d'une candidature |
| `POST` | `/api/admin/health-pro-applications/{id}/accept` | Admin | Accepter une candidature |
| `POST` | `/api/admin/health-pro-applications/{id}/refuse` | Admin | Refuser une candidature |

Documentation interactive : http://localhost:8000/api/docs

---

## 🐳 Déploiement Docker

```bash
# Build et démarrage
docker compose up -d --build

# Vérifier les logs
docker compose logs -f

# Créer l'admin initial
docker compose exec backend python -m scripts.create_admin

# Arrêter
docker compose down

# Arrêter et supprimer les données
docker compose down -v
```

> **💡 Base de données :** Le schéma V2 complet est dans `database/init/01_schema.sql`. Il est appliqué automatiquement à la création du container. Aucune migration manuelle n'est nécessaire.

### Services

| Service | Port | Description |
|---------|------|-------------|
| `db` | 5432 (interne) | PostgreSQL 16 Alpine |
| `backend` | 8000 (interne) | API FastAPI (non expose publiquement) |
| `frontend` | 3033 | Nginx + React SPA |
| `backup` | - | Backup automatique PostgreSQL (cron) |

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `POSTGRES_DB` | `mentaltech` | Nom de la base |
| `POSTGRES_USER` | `mentaltech` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `mentaltech_secret` | Mot de passe PostgreSQL |
| `DATABASE_URL` | `postgresql://...` | URL de connexion complète |
| `SECRET_KEY` | `change-me-...` | Clé secrète JWT |
| `CORS_ORIGINS` | `http://localhost:3033,...` | Origines CORS autorisées |
| `FRONTEND_URL` | `http://localhost:3033` | URL du frontend (pour les liens dans les emails) |
| `MAIL_USERNAME` | *(vide)* | Identifiant SMTP |
| `MAIL_PASSWORD` | *(vide)* | Mot de passe SMTP (app password recommandé) |
| `MAIL_FROM` | `noreply@mentaltechmaker.fr` | Adresse expéditeur |
| `MAIL_FROM_NAME` | `MentalTech Discover` | Nom expéditeur |
| `MAIL_SERVER` | `smtp.gmail.com` | Serveur SMTP |
| `MAIL_PORT` | `587` | Port SMTP |
| `MAIL_STARTTLS` | `true` | Activer STARTTLS |
| `MAIL_SSL_TLS` | `false` | Activer SSL/TLS direct |
| `BACKUP_KEEP_DAYS` | `7` | Nombre de jours de retention des backups |
| `BACKUP_CRON` | `0 3 * * *` | Expression cron pour les backups automatiques |
| `BACKUP_ENCRYPT_KEY` | *(vide)* | Cle de chiffrement des backups (optionnel) |

---

## 📊 Informations par Solution

Chaque solution comprend :

- **Identité** : Nom, logo, tagline
- **Description** : ~200-250 caractères harmonisés
- **Catégorisation** : Type, tags, audience
- **Problèmes traités** : Stress, anxiété, addictions, etc.
- **Tarification** : Modèle économique clair
- **Contexte** : Individuel ou entreprise
- **Appartenance** : Membre du Collectif MentalTech (badge 💙)
- **Visibilité** : Produit actif, masqué ou entreprise défunte
- **Score de match** : Pourcentage de pertinence (0-93)
- **Priorites P1/P2/P3** : Audience et problematiques classees par priorite (P1 = coeur de cible, P2 = secondaire, P3 = compatible, max 3 par niveau)

---

## 🎨 Design

### Palette de couleurs

- **Primaire** : Bleu #4A90E2 - Confiance, serenite
- **Secondaire** : Bleu fonce #357ABD - Fiabilite
- **Succes** : Vert #10B981 - Bien-etre
- **Danger** : Rouge #EF4444 - Urgences
- **Accents** : Violet, Orange, Rose - Diversite

### Tokens CSS

| Element | Classes Tailwind |
|---------|-----------------|
| Container page | `min-h-[calc(100vh-280px)] px-4 py-8` + `max-w-4xl mx-auto` |
| Texte principal | `text-text-primary` |
| Texte secondaire | `text-text-secondary` |
| Cards | `bg-white rounded-2xl border border-gray-200 p-8` |
| Bouton primaire | `bg-primary text-white py-3 rounded-lg font-semibold` |
| Inputs | `border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/30` |
| Erreurs | `bg-red-50 border border-red-200 rounded-lg text-red-700` |

Style guide complet : `_docs/decisions/2026-04-10-style-guide-css.md`

### Principes

- Mobile-first responsive
- Tokens semantiques (pas de couleurs hardcodees)
- Accessibilite ARIA labels
- Animations fluides
- Performance optimisee

---

## 🔒 Confidentialité

### Privacy-First

- ✅ **Analytics sans cookies** (Plausible)
- ✅ **Pas de tracking tiers** - Aucun pixel externe
- ✅ **Mots de passe hashés** - bcrypt avec protection timing attack
- ✅ **JWT sécurisés** - Access token en mémoire (pas localStorage) + refresh HttpOnly cookie
- ✅ **Vérification email** - Tokens signés avec expiration
- ✅ **Anti-énumération** - Réponse identique que l'email existe ou non (forgot password)
- ✅ **Rate limiting** - Global (200/min) + par endpoint (register 5/min, login 10/min, etc.)
- ✅ **Security headers** - CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options
- ✅ **Open source** - Code transparent sur GitHub

### RGPD

- ✅ **Zéro donnée patient en base** - L'email patient est purgé après envoi de la prescription
- ✅ **Droit à l'effacement** - Le patient peut supprimer sa prescription en un clic
- ✅ **Suppression automatique** - Les prescriptions expirées sont supprimées sous 7 jours
- ✅ **Quiz anonyme** - Les réponses restent dans le navigateur, jamais envoyées au serveur
- ✅ **Liens privacy/legal** - Présents dans tous les emails transactionnels

### Responsabilité

- **Disclaimers** - Avertissements médicaux compacts (toujours visibles)
- **Numéros d'urgence** - 3114, 15, 112 affichés
- **Bannière de crise** - Détection de pensées sombres avec ressources immédiates
- **Limitations claires** - Outil de découverte uniquement

---

## 🤝 Contribution

### Ajouter une solution

Pour référencer une nouvelle solution :

1. ✅ Vérifier que l'entreprise est membre du Collectif MentalTech
2. ✅ S'assurer de la conformité aux critères de référencement
3. Fork le repository
4. Ajouter le produit via le panel admin ou via un INSERT SQL dans `database/init/02_seed_products.sql`
5. Créer une Pull Request avec description complète

### Proposer des améliorations

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m 'Description claire'`)
4. Push (`git push origin feature/amelioration`)
5. Créer une Pull Request

---

## 📄 Licence

**MIT License** - Projet open source

Voir [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Créateur

**MentalTechMaker** (Arnaud Bressot) - Membre du Collectif MentalTech

- Website : [mentaltechmaker.fr](https://mentaltechmaker.fr)
- LinkedIn : [Arnaud Bressot](https://www.linkedin.com/in/arnaudbressot)
- Email : arnaud@mentaltechmaker.fr

---

## 📞 Collectif MentalTech

Premier écosystème français de santé mentale digitale

- Website : [mentaltech.fr](https://mentaltech.fr)
- LinkedIn : [Collectif MentalTech](https://www.linkedin.com/company/mentaltech)

---

## 🚀 Déploiement en production

### Prérequis serveur

- Docker + Docker Compose
- Domaine pointé vers le serveur (ex: discover.mentaltech.fr)
- Reverse proxy HTTPS (Caddy, Traefik ou Nginx + Let's Encrypt)

### Étapes

```bash
# 1. Cloner et configurer
git clone https://github.com/mentaltechmaker/mentaltech-discover.git
cd mentaltech-discover
cp .env.example .env

# 2. Générer les vrais secrets
python3 -c "import secrets; print(secrets.token_urlsafe(32))"   # -> SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(24))"   # -> POSTGRES_PASSWORD

# 3. Éditer .env avec les valeurs de production
#    SECRET_KEY=<valeur générée>
#    POSTGRES_PASSWORD=<valeur générée>
#    DATABASE_URL=postgresql://mentaltech:<password>@db:5432/mentaltech
#    CORS_ORIGINS=https://discover.mentaltech.fr
#    FRONTEND_URL=https://discover.mentaltech.fr
#    MAIL_USERNAME=<email SMTP>
#    MAIL_PASSWORD=<app password SMTP>

# 4. Lancer
docker compose up -d --build

# 5. Vérifier
docker compose ps                    # 4 services healthy
curl http://localhost:3033/api/health # 200

# 6. Créer le premier admin
docker compose exec backend python -m scripts.create_admin
```

### Backup et restauration

```bash
# Backup quotidien (ajouter au cron)
./scripts/backup.sh

# Restauration
./scripts/restore.sh backups/backup_YYYYMMDD.sql.gz
```

### Tests

```bash
# Backend (27 tests)
docker compose exec backend python -m pytest

# Frontend (422 tests)
cd frontend && bun test tests/

# TypeScript
cd frontend && npx tsc --noEmit
```

---

## 🗺️ Roadmap

### ✅ V1.0 - Frontend (Novembre 2025)

- [x] Questionnaire personnalisé (particuliers + entreprises)
- [x] Catalogue avec solutions référencées
- [x] Algorithme de scoring plafonné à 100%
- [x] Randomisation des ex-aequo
- [x] Disclaimers médicaux et numéros d'urgence
- [x] Analytics privacy-first (Plausible)
- [x] Open source (MIT)

### ✅ V2.0 - Plateforme Complète (Mars 2026)

#### Architecture & Infrastructure
- [x] Architecture monorepo (frontend / backend / database)
- [x] API REST FastAPI avec documentation Swagger
- [x] Base de donnees PostgreSQL avec produits pre-charges
- [x] Docker Compose 4 services (db, backend, frontend, backup)
- [x] Proxy Nginx vers le backend

#### Authentification & Comptes
- [x] Authentification JWT (inscription, connexion, refresh)
- [x] Page profil utilisateur + changement de mot de passe
- [x] Verification d'email a l'inscription (lien par email, 24h)
- [x] Mot de passe oublie (reinitialisation par email, 1h)
- [x] Roles : utilisateur, prescripteur, editeur, administrateur

#### Scoring & Qualite
- [x] Systeme de scoring qualite interne sur 5 piliers (0-5 chacun)
- [x] Protocole d'analyse documente

#### Espace Prescripteur
- [x] Inscription prescripteur (profession, organisation, RPPS/ADELI)
- [x] Validation RPPS/ADELI (format 11 ou 9 chiffres)
- [x] Ordonnance digitale (lien securise 30 jours, 1-5 solutions, QR code)
- [x] Tableau de bord prescripteur (stats, historique, favoris, communaute)
- [x] Notes cliniques par solution
- [x] Veille solutions (mises a jour produits)
- [x] Onboarding oriente action (guide vers premiere ordonnance)
- [x] Renouvellement de prescription

#### Soumission Publique & Collectif
- [x] Soumission publique sans compte (formulaire multi-etapes)
- [x] Anti-bot (honeypot + delai minimum)
- [x] Confirmation email soumission (48h)
- [x] Demande d'adhesion au Collectif MentalTech
- [x] Candidature professionnel de sante
- [x] Page "Rejoindre le Collectif" (point d'entree unique)
- [x] Gestion admin des soumissions et candidatures
- [x] Sauvegarde automatique du formulaire (localStorage)
- [x] Barre de progression multi-etapes

#### UX & Accessibilite
- [x] Resultats partageables (URL encode les reponses)
- [x] Compteur temps reel (solutions detectees pendant le quiz)
- [x] Modal de crise (numeros d'urgence bloquant pour reponses "tres mal")
- [x] Touch targets minimum 44px (WCAG)
- [x] Emojis avec aria-hidden pour lecteurs d'ecran
- [x] Lien actif visible dans le menu mobile
- [x] Badges statut avec icones (pas couleur seule)

#### Securite
- [x] Rate limiting sur soumissions publiques (3/heure)
- [x] Validation magic bytes sur uploads (PNG, JPEG, WebP)
- [x] Rejection wildcards CORS en production
- [x] Credentials exclusivement via .env (pas de defauts en dur)
- [x] Validation scores admin (0-5 via Pydantic)
- [x] Docker hardening (reseaux isoles, cap_drop, read-only, no-new-privileges)
- [x] Backup automatise avec chiffrement optionnel

#### Contenu & Legal
- [x] Section "Pour les professionnels de sante" (page About)
- [x] FAQ alignee avec les fonctionnalites actuelles
- [x] Mentions DPIA et hebergement HDS (page Privacy)
- [x] Textes cookies alignes (Plausible Analytics sans cookies)

#### Administration
- [x] Panel d'administration (CRUD complet produits)
- [x] Visibilite produits (masquer/afficher, entreprise defunte)
- [x] Gestion prescripteurs (valider, revoquer)
- [x] Emails transactionnels (15 templates)

### V2.1 - Refonte scoring P1/P2/P3 (Avril 2026)

- [x] Systeme de priorites P1/P2/P3 sur audiences et problemes (scoring 30:18:8)
- [x] Selecteur P1/P2/P3 dans les formulaires (max 3 par niveau, validation serveur)
- [x] Retrait labels qualite de l'affichage public (scoring interne conserve en base)
- [x] Retrait de la notion d'evaluation (remplacee par "analyse/reference")
- [x] Affichage de toutes les solutions classees par match
- [x] UI notes cliniques prescripteur (dashboard + page produit)
- [x] Focus trap banniere d'urgence + role="alert" + prefers-reduced-motion
- [x] Consentement RGPD sur tous les formulaires
- [x] Touch targets 44px WCAG
- [x] Email recapitulatif editeur apres confirmation
- [x] Migration SQL pour bases existantes
- [x] ~80 corrections accents francais
- [x] Filtres admin soumissions (approuves, rejetes, non confirmes) avec masquage par defaut
- [x] Filtres admin soignants (acceptes, refuses, non confirmes) + recherche
- [x] Compteurs tabs admin montrent les demandes a traiter (chargement parallele)
- [x] Avantages collectif dans le formulaire de soumission editeur
- [x] Formulaire soignants aligne sur la DA du formulaire produit
- [x] Uniformisation DA CSS : tokens semantiques, border-radius, containers, cards (16 fichiers)

### 🔮 V3 - Expansion (prevu)

- [ ] Systeme d'abonnement (gratuit / pro / equipe)
- [ ] Integration paiement (Stripe)
- [ ] Tests unitaires (Vitest + pytest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Multi-langue (EN, ES, DE)
- [ ] Export PDF ordonnance
- [ ] Blog SEO

---

**Version actuelle** : V2.1.1
**Derniere mise a jour** : 10 avril 2026
**Status** : Production Ready
