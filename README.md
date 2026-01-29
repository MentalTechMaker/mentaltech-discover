# MentalTech Discover

**MentalTech Discover** est une plateforme créée par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à trouver la solution digitale en santé mentale adaptée à leurs besoins.

> ⚕️ **Important** : MentalTech Discover est un outil de découverte, pas un dispositif médical. En cas d'urgence, appelez le **3114** (prévention suicide) ou le **15** (SAMU).

---

## 🎯 À propos

MentalTech Discover référence **22 solutions** des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- 🧭 **Questionnaire personnalisé** - Recommandations sur-mesure en 3-5 minutes
- 📚 **Catalogue complet** - Filtres avancés par type, audience, problématique
- 🎯 **Algorithme de scoring** - Matching intelligent plafonné à 100%
- 🔒 **Authentification** - Inscription, connexion, panel d'administration
- 📖 **Open Source** - Code transparent sous licence MIT

---

## ✨ Fonctionnalités

### 🧭 Recommandations personnalisées

Un questionnaire rapide analyse vos besoins selon :

- **Public** : Adultes, adolescents, enfants, parents, seniors
- **Problématiques** : Stress, anxiété, dépression, addictions, burn-out, sommeil, traumatismes
- **Préférences** : Accompagnement autonome, thérapie immédiate, programmes structurés
- **Contexte** : Solutions individuelles ou entreprise

### 📚 Catalogue interactif

Explorez toutes les solutions avec filtres puissants :

- **Recherche textuelle** - Nom, description, tags
- **Type de service** - Téléconsultation, méditation, VR, TCC, coaching
- **Public** - Particuliers, Entreprises, ou les deux
- **Audience** - Adultes, adolescents, enfants, parents, seniors
- **Problèmes traités** - 6 catégories principales
- **Tarification** - Gratuit, Freemium, Abonnement, Par séance, B2B

### 🔐 Authentification et Administration

- **Inscription / Connexion** - JWT avec access token (30 min) + refresh token (7 jours)
- **Page profil** - Consultation des informations du compte et changement de mot de passe
- **Vérification email** - Email de confirmation envoyé à l'inscription avec lien sécurisé (24h)
- **Mot de passe oublié** - Réinitialisation par email avec lien temporaire (1h)
- **Panel Admin** - CRUD complet sur les produits (ajout, modification, suppression)
- **Rôles** - Utilisateur standard et administrateur

### 🛡️ Sécurité et Transparence

- ✅ **Disclaimers médicaux** - Numéros d'urgence (3114, 15, 112)
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
npm install
npm run dev
```

Le proxy Vite redirige `/api` vers `http://localhost:8000`.

### Développement local (backend uniquement)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 📦 Structure du Projet

```
mentaltech-discover/
├── frontend/                # Application React
│   ├── src/
│   │   ├── api/            # Couche API (client, auth, products)
│   │   ├── components/     # Composants React
│   │   │   ├── Admin/      # Panel d'administration
│   │   │   ├── Auth/       # Pages login / register / profil / reset password
│   │   │   ├── Layout/     # Header, Footer
│   │   │   ├── ProductCatalog/
│   │   │   ├── Quiz/
│   │   │   └── Results/
│   │   ├── data/           # Questions et moteur de recommandation
│   │   ├── lib/            # Analytics
│   │   ├── store/          # Zustand (app, auth, products)
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Fonctions utilitaires
│   ├── public/             # Assets statiques et logos
│   ├── Dockerfile          # Image multi-stage (node + nginx)
│   ├── nginx.conf          # Config Nginx avec proxy API
│   └── package.json
│
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/         # Modèles SQLAlchemy (User, Product)
│   │   ├── schemas/        # Schémas Pydantic (validation)
│   │   ├── routers/        # Endpoints API (auth, products)
│   │   ├── services/       # Logique métier (JWT, CRUD, email)
│   │   ├── templates/      # Templates HTML emails (Jinja2)
│   │   ├── config.py       # Configuration (pydantic-settings)
│   │   ├── database.py     # Connexion SQLAlchemy
│   │   ├── dependencies.py # Guards (auth, admin)
│   │   └── main.py         # Point d'entrée FastAPI
│   ├── scripts/            # Scripts utilitaires
│   │   └── create_admin.py # Création admin initial
│   ├── Dockerfile
│   └── requirements.txt
│
├── database/                # PostgreSQL
│   ├── init/
│   │   ├── 01_schema.sql   # Tables users + products
│   │   └── 02_seed_products.sql  # 22 produits pré-chargés
│   └── migrations/
│       └── 001_add_email_verified.sql  # Ajout vérification email
│
├── docker-compose.yml       # Orchestration 3 services
└── .env.example             # Variables d'environnement
```

---

## 🔌 API Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/auth/register` | - | Inscription (+ envoi email vérification) |
| `POST` | `/api/auth/login` | - | Connexion (retourne JWT) |
| `POST` | `/api/auth/refresh` | - | Renouveler l'access token |
| `GET` | `/api/auth/me` | JWT | Profil utilisateur courant |
| `PUT` | `/api/auth/change-password` | JWT | Changer le mot de passe |
| `POST` | `/api/auth/forgot-password` | - | Demander un email de réinitialisation |
| `POST` | `/api/auth/reset-password` | - | Réinitialiser le mot de passe (via token) |
| `GET` | `/api/auth/verify-email` | - | Vérifier l'adresse email (via token) |
| `POST` | `/api/auth/resend-verification` | JWT | Renvoyer l'email de vérification |
| `GET` | `/api/products` | - | Liste tous les produits |
| `GET` | `/api/products/{id}` | - | Détail d'un produit |
| `POST` | `/api/products` | Admin | Créer un produit |
| `PUT` | `/api/products/{id}` | Admin | Modifier un produit |
| `DELETE` | `/api/products/{id}` | Admin | Supprimer un produit |
| `GET` | `/api/health` | - | Health check |

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

# Exécuter une migration (base existante)
docker compose exec db psql -U mentaltech -d mentaltech -f /migrations/001_add_email_verified.sql
```

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
- **Score de match** : Pourcentage de pertinence (0-100%)

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

- **Disclaimers** - Avertissements médicaux
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
- [x] Catalogue avec 22 solutions référencées
- [x] Algorithme de scoring plafonné à 100%
- [x] Randomisation des ex-aequo
- [x] Disclaimers médicaux et numéros d'urgence
- [x] Analytics privacy-first (Plausible)
- [x] Open source (MIT)

### ✅ V2.0 - Monorepo Full-Stack (Janvier 2026)

- [x] Architecture monorepo (frontend / backend / database)
- [x] API REST FastAPI avec documentation Swagger
- [x] Base de données PostgreSQL avec 22 produits pré-chargés
- [x] Authentification JWT (inscription, connexion, refresh)
- [x] Panel d'administration (CRUD produits)
- [x] Docker Compose 3 services
- [x] Proxy Nginx vers le backend

### ✅ V2.1 - Gestion de compte (Janvier 2026)

- [x] Page profil utilisateur (consultation des informations)
- [x] Changement de mot de passe (depuis le profil)
- [x] Vérification d'email à l'inscription (lien par email, 24h)
- [x] Mot de passe oublié (réinitialisation par email, 1h)
- [x] Envoi d'emails transactionnels (fastapi-mail + Jinja2)
- [x] Scripts de migration SQL

### 🔮 V3 - Expansion

- [ ] Tests unitaires (Vitest + pytest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Multi-langue (EN, ES, DE)

---

**Version actuelle** : V1.2.0
**Dernière mise à jour** : Janvier 2026
**Status** : ✅ Production Ready
