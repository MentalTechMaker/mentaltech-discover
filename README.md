# MentalTech Discover

**MentalTech Discover** est une plateforme créée par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à trouver la solution digitale en santé mentale adaptée à leurs besoins.

> ⚕️ **Important** : MentalTech Discover est un outil de découverte, pas un dispositif médical. En cas d'urgence, appelez le **3114** (prévention suicide) ou le **15** (SAMU).

---

## 🎯 À propos

MentalTech Discover référence les solutions des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- 🧭 **Questionnaire personnalisé** - Recommandations sur-mesure en 3-5 minutes
- 📚 **Catalogue complet** - Filtres avancés par type, audience, problématique, label qualité
- 🎯 **Algorithme de scoring** - Matching intelligent plafonné à 100%
- ⭐ **Labels qualité** - Notation Nutriscore (A-E) sur 5 piliers, avec justifications
- 📄 **Fiches produit** - Page dédiée par solution avec scoring détaillé
- 💙 **Collectif MentalTech** - Badge d'appartenance au collectif
- 🔒 **Authentification** - Inscription, connexion, panel d'administration
- 🩺 **Espace Prescripteur** - Prescriptions digitales, favoris, notes, veille, comparateur
- 🏢 **Espace Éditeur** - Soumission de produits par les éditeurs de solutions
- 📖 **Open Source** - Code transparent sous licence MIT

---

## ✨ Fonctionnalités

### 🧭 Recommandations personnalisées

Un questionnaire rapide analyse vos besoins selon :

- **Public** : Adultes, adolescents, enfants, parents, seniors
- **Problématiques** : Stress, anxiété, dépression, addictions, burn-out, sommeil, traumatismes
- **Préférences** : Accompagnement autonome, thérapie immédiate, programmes structurés
- **Contexte** : Solutions individuelles ou entreprise

Pendant le quiz, un **compteur en temps réel** affiche le nombre de solutions déjà détectées à mesure que l'utilisateur répond.

### 📚 Catalogue interactif

Explorez toutes les solutions avec filtres puissants :

- **Recherche textuelle** - Nom, description, tags
- **Type de service** - Téléconsultation, méditation, VR, TCC, coaching
- **Public** - Particuliers, Entreprises, ou les deux
- **Audience** - Adultes, adolescents, enfants, parents, seniors
- **Problèmes traités** - 6 catégories principales
- **Tarification** - Gratuit, Freemium, Abonnement, Par séance, B2B
- **Label qualité** - Filtrer par grade (A, B, C, D, E, Non évalué)
- **Tri par label** - Trier par meilleur score qualité

### 📊 Résultats et partage

- **Filtres rapides** sur les résultats : Gratuit / Payant et Avec un humain / En autonomie
- **Lien partageable** : l'URL `/results?f=...` encode les réponses du quiz pour partager ou sauvegarder ses résultats

### ⭐ Labels qualité (Nutriscore)

Chaque solution est évaluée sur 5 piliers, chacun noté de 0 à 5, pour un score total sur 100 :

| Score | Grade | Label |
|-------|-------|-------|
| 80-100 | **A** | Validé MentalTech |
| 60-79 | **B** | Recommandé |
| 40-59 | **C** | Évalué |
| 20-39 | **D** | À améliorer |
| 0-19 | **E** | Déconseillé |

Les 5 piliers d'évaluation :

1. **Sécurité & Confidentialité** - RGPD, hébergement HDS, chiffrement
2. **Efficacité & Preuves cliniques** - Base scientifique, études publiées
3. **Accessibilité & Inclusion** - Prix, plateformes, langue, handicap
4. **Qualité UX** - Design, navigation, performance, mobile
5. **Support & Accompagnement** - Réactivité, gestion de crise, ressources

Chaque note est accompagnée d'une **justification textuelle** (documents de recherche, témoignages, observations). Les justifications détaillées sont visibles par les administrateurs.

Le protocole d'évaluation complet est documenté dans [`protocole.md`](protocole.md).

### 📄 Fiches produit

Chaque solution dispose d'une page dédiée accessible depuis le catalogue ou les résultats du quiz :

- Informations complètes (description, public, tarification, tags)
- Score qualité avec barres de progression par critère
- Justifications détaillées (admin uniquement)
- Badge "Membre du Collectif MentalTech" (💙)
- Lien direct vers le site de la solution

### 🔐 Authentification et Administration

- **Inscription / Connexion** - JWT avec access token (30 min) + refresh token (7 jours)
- **Page profil** - Consultation des informations du compte et changement de mot de passe
- **Vérification email** - Email de confirmation envoyé à l'inscription avec lien sécurisé (24h)
- **Mot de passe oublié** - Réinitialisation par email avec lien temporaire (1h)
- **Panel Admin** - CRUD complet sur les produits (ajout, modification, suppression)
- **Scoring admin** - Saisie des 5 scores qualité + justifications par produit avec preview en temps réel
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

- **Flux de mises à jour** - Changements de tarifs, nouvelles études, évolutions de scoring
- **Filtre favoris** - Ne voir que les mises à jour de ses solutions favorites
- **Types d'updates** - Prix, score, fonctionnalité, étude, général

#### Comparateur

- **Côte-à-côte** - Comparer 2 à 4 solutions sur tous les critères
- **Scores détaillés** - Barres de progression par critère de scoring
- **Tarification** - Modèle, montant, détails côte-à-côte
- **Public et problématiques** - Audience, problèmes traités

#### Statistiques communauté

- **Données anonymisées** - Nombre de prescripteurs et prescriptions par solution
- **Top solutions** - Les 20 solutions les plus prescrites

### 🏢 Soumission de solutions (Editeurs)

Un parcours ouvert permettant a tout editeur de soumettre sa solution :

- **Formulaire public** - Soumission sans compte via le bouton "Referencer" dans le header
- **Multi-etapes** - Informations produit, tarification, protocole d'evaluation
- **Sauvegarde automatique** - Brouillon sauvegarde toutes les 30 secondes dans le navigateur
- **Barre de progression** - Etape X sur Y visible en permanence
- **Anti-bot** - Honeypot + delai minimum de soumission
- **Confirmation email** - Lien de validation 48h avant transmission a l'admin
- **Option Collectif** - Demande d'adhesion au Collectif MentalTech integree

### 🌐 Soumission Publique (sans compte)

Un parcours ouvert permettant à tout éditeur de soumettre sa solution sans créer de compte :

- **Formulaire multi-étapes** - Informations produit complètes basées sur le protocole d'évaluation
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

- **Docker Compose** - Orchestration 3 services
- **Nginx** - Reverse proxy + serveur statique
- **PostgreSQL 16 Alpine** - Base de données

---

## 🚀 Démarrage Rapide

### Avec Docker (recommandé)

```bash
# Cloner le repository
git clone https://github.com/mentaltechmaker/mentaltech-discover.git
cd mentaltech-discover

# Copier la configuration
cp .env.example .env

# Démarrer les 3 services (db + backend + frontend)
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
2. **Résultats** - Consultez les solutions recommandées, triées par pertinence — utilisez les filtres Gratuit/Payant et Autonomie/Humain pour affiner
3. **Catalogue** - Cliquez sur "Explorer toutes les solutions" pour parcourir le catalogue avec les filtres (type, audience, tarification, label qualité)
4. **Fiche produit** - Cliquez sur une solution pour voir le détail : scoring, description, tarification, lien direct

### Pour les prescripteurs (professionnels de santé)

1. **Inscription** - Cliquez sur "Mon compte" > "Inscription", puis choisissez "Inscription Prescripteur"
2. **Renseignez vos informations** - Profession, organisation, numéro RPPS/ADELI
3. **Validation** - Un administrateur valide votre compte (nécessaire pour accéder aux fonctionnalités premium)
4. **Onboarding** - Dès votre premier login, un guide en 3 étapes vous présente les fonctionnalités clés
5. **Tableau de bord** - Accédez à vos stats, prescriptions, favoris et données communautaires
6. **Nouvelle prescription** - Sélectionnez 1-5 solutions (vos favoris sont en tête de liste), utilisez le panneau rapide pour consulter un produit, ajoutez un message, copiez le lien ou scannez le QR code pour l'envoyer au patient
7. **Veille** - Consultez les mises à jour des solutions (tarifs, études, scores)
8. **Comparateur** - Comparez 2-4 solutions côte-à-côte sur tous les critères

### Pour les editeurs (soumission publique)

1. **Acceder au formulaire** - Cliquez sur "Referencer" dans le header ou via la page "Rejoindre le Collectif"
2. **Remplir le formulaire** - Suivez les etapes : informations produit, tarification, protocole d'evaluation
3. **Confirmer par email** - Un lien de confirmation (48h) vous est envoye pour valider la soumission
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
│   │   │   ├── Prescriber/ # Dashboard, prescriptions, veille, comparateur, quick view, onboarding
│   │   │   ├── Publisher/  # Formulaire de soumission
│   │   │   ├── Public/     # Soumission publique, candidature pro santé, page collectif
│   │   │   ├── ProductCatalog/
│   │   │   ├── Quiz/
│   │   │   └── Results/
│   │   ├── data/           # Questions, moteur de recommandation, questions protocole
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
│   │   ├── templates/      # Templates HTML emails (Jinja2)
│   │   ├── config.py       # Configuration (pydantic-settings)
│   │   ├── database.py     # Connexion SQLAlchemy
│   │   ├── dependencies.py # Guards (auth, admin, prescriber, publisher)
│   │   └── main.py         # Point d'entrée FastAPI
│   ├── scripts/            # Scripts utilitaires
│   │   └── create_admin.py # Création admin initial
│   ├── Dockerfile
│   └── requirements.txt
│
├── database/                # PostgreSQL
│   └── init/
│       ├── 01_schema.sql   # Schéma complet (users, products, prescriptions, favoris, notes, veille, soumissions, triggers)
│       └── 02_seed_products.sql  # Produits pré-chargés
│
├── protocole.md              # Protocole d'évaluation des solutions
├── docker-compose.yml        # Orchestration 3 services
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
| | | | |
| **Espace Prescripteur** | | | |
| `GET` | `/api/prescriber/favorites` | Prescriber | Lister ses favoris |
| `POST` | `/api/prescriber/favorites` | Prescriber | Ajouter un favori |
| `DELETE` | `/api/prescriber/favorites/{product_id}` | Prescriber | Retirer un favori |
| `GET` | `/api/prescriber/notes` | Prescriber | Lister ses notes |
| `PUT` | `/api/prescriber/notes` | Prescriber | Créer ou modifier une note |
| `DELETE` | `/api/prescriber/notes/{product_id}` | Prescriber | Supprimer une note |
| `GET` | `/api/prescriber/updates` | Prescriber | Veille : mises à jour produits |
| `GET` | `/api/prescriber/compare?ids=...` | Prescriber | Comparateur (2-4 produits) |
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
| `backend` | 8000 | API FastAPI |
| `frontend` | 3033 | Nginx + React SPA |

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
- **Score de match** : Pourcentage de pertinence (0-100%)
- **Label qualité** : Grade A-E basé sur 5 critères (0-20 chacun)
- **Justifications** : Texte libre par critère (recherche, preuves, témoignages)

---

## 🎨 Design

### Palette de couleurs

- **Primaire** : Bleu #4A90E2 - Confiance, sérénité
- **Secondaire** : Bleu foncé #357ABD - Fiabilité
- **Succès** : Vert #10B981 - Bien-être
- **Danger** : Rouge #EF4444 - Urgences
- **Accents** : Violet, Orange, Rose - Diversité

### Principes

- Mobile-first responsive
- Accessibilité ARIA labels
- Animations fluides
- Performance optimisée

---

## 🔒 Confidentialité

### Privacy-First

- ✅ **Analytics sans cookies** (Plausible)
- ✅ **Pas de tracking tiers** - Aucun pixel externe
- ✅ **Mots de passe hashés** - bcrypt
- ✅ **JWT sécurisés** - Access token courte durée + refresh
- ✅ **Vérification email** - Tokens signés avec expiration
- ✅ **Anti-énumération** - Réponse identique que l'email existe ou non (forgot password)
- ✅ **Open source** - Code transparent sur GitHub

### Responsabilité

- **Disclaimers** - Avertissements médicaux compacts (toujours visibles)
- **Numéros d'urgence** - 3114, 15, 112 affichés
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

## 🗺️ Roadmap

### ✅ V1.0 - Frontend (Novembre 2025)

- [x] Questionnaire personnalisé (particuliers + entreprises)
- [x] Catalogue avec solutions référencées
- [x] Algorithme de scoring plafonné à 100%
- [x] Randomisation des ex-aequo
- [x] Disclaimers médicaux et numéros d'urgence
- [x] Analytics privacy-first (Plausible)
- [x] Open source (MIT)

### ✅ V2.0 - Plateforme Complete (Mars 2026)

#### Architecture & Infrastructure
- [x] Architecture monorepo (frontend / backend / database)
- [x] API REST FastAPI avec documentation Swagger
- [x] Base de donnees PostgreSQL avec produits pre-charges
- [x] Docker Compose 3 services
- [x] Proxy Nginx vers le backend

#### Authentification & Comptes
- [x] Authentification JWT (inscription, connexion, refresh)
- [x] Page profil utilisateur + changement de mot de passe
- [x] Verification d'email a l'inscription (lien par email, 24h)
- [x] Mot de passe oublie (reinitialisation par email, 1h)
- [x] Roles : utilisateur, prescripteur, editeur, administrateur

#### Scoring & Labels qualite
- [x] Systeme de scoring qualite sur 5 piliers (0-20 chacun, total /100)
- [x] Labels Nutriscore (A-E) avec couleurs et badges
- [x] Justifications textuelles par critere
- [x] Protocole d'evaluation documente

#### Espace Prescripteur
- [x] Inscription prescripteur (profession, organisation, RPPS/ADELI)
- [x] Validation RPPS/ADELI (format 11 ou 9 chiffres)
- [x] Ordonnance digitale (lien securise 30 jours, 1-5 solutions, QR code)
- [x] Tableau de bord prescripteur (stats, historique, favoris, communaute)
- [x] Notes cliniques par solution
- [x] Veille solutions (mises a jour produits)
- [x] Comparateur cote-a-cote (2-4 solutions)
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

#### Contenu & Legal
- [x] Section "Pour les professionnels de sante" (page About)
- [x] FAQ alignee avec les fonctionnalites actuelles
- [x] Mentions DPIA et hebergement HDS (page Privacy)
- [x] Textes cookies alignes (Plausible Analytics sans cookies)

#### Administration
- [x] Panel d'administration (CRUD complet produits)
- [x] Scoring admin avec preview temps reel
- [x] Visibilite produits (masquer/afficher, entreprise defunte)
- [x] Gestion prescripteurs (valider, revoquer)
- [x] Emails transactionnels (12 templates)

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

**Version actuelle** : V2.0.0
**Derniere mise a jour** : Mars 2026
**Status** : Production Ready
