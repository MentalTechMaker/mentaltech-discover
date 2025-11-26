# MentalTech Discover

**MentalTech Discover** est une plateforme créée par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à trouver la solution digitale en santé mentale adaptée à leurs besoins.

> ⚕️ **Important** : MentalTech Discover est un outil de découverte, pas un dispositif médical. En cas d'urgence, appelez le **3114** (prévention suicide) ou le **15** (SAMU).

---

## 🎯 À propos

MentalTech Discover référence **13 solutions actives** des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- 🧭 **Questionnaire personnalisé** - Recommandations sur-mesure en 3-5 minutes
- 📚 **Catalogue complet** - Filtres avancés par type, audience, problématique
- 🎯 **Algorithme de scoring** - Matching intelligent plafonné à 100%
- 🔒 **100% gratuit et anonyme** - Aucune donnée personnelle collectée
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

- **Frontend** : React 19 + TypeScript
- **State Management** : Zustand 5
- **Styling** : Tailwind CSS 4
- **Build** : Vite 7
- **Analytics** : Plausible (privacy-first)
- **Qualité** : ESLint + TypeScript strict mode

---

## 🚀 Démarrage Rapide

```bash
# Cloner le repository
git clone https://github.com/mentaltech/mentaltech-discover.git
cd mentaltech-discover

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

---

## 📦 Structure du Projet

```
mentaltech-discover/
├── src/
│   ├── components/       # Composants React
│   ├── data/            # Données produits et questions
│   ├── lib/             # Analytics et utilitaires
│   ├── store/           # State management (Zustand)
│   ├── types/           # Types TypeScript
│   └── utils/           # Fonctions utilitaires
├── public/              # Assets statiques
│   └── logos/          # Logos des produits (172 KB optimisés)
├── Dockerfile          # Image Docker multi-stage
├── nginx.conf          # Configuration Nginx
└── docker-compose.yml  # Orchestration Docker
```

---

## 🐳 Déploiement Docker

```bash
# Build et démarrage
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

L'application sera disponible sur `http://localhost:8080`

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
- Performance optimisée (332 KB gzippé)

---

## 🔒 Confidentialité

### Privacy-First

- ✅ **Aucune donnée personnelle** stockée
- ✅ **Analytics sans cookies** (Plausible)
- ✅ **Pas de tracking tiers** - Aucun pixel externe
- ✅ **Navigation anonyme** - Pas de compte requis
- ✅ **Open source** - Code transparent sur GitHub

### Responsabilité

- **Disclaimers** - Avertissements médicaux
- **Numéros d'urgence** - 3114, 15, 112 affichés
- **Limitations claires** - Outil de découverte uniquement

---

## ⚡ Performance

- **Bundle size** : 332 KB JS (90 KB gzippé) + 48 KB CSS
- **Target** : < 350 KB maintenu
- **Logos optimisés** : 172 KB total (13 fichiers)
- **Time to Interactive** : < 2s sur 4G

---

## 🤝 Contribution

### Ajouter une solution

Pour référencer une nouvelle solution :

1. ✅ Vérifier que l'entreprise est membre du Collectif MentalTech
2. ✅ S'assurer de la conformité aux critères de référencement
3. Fork le repository
4. Ajouter dans `src/data/products.ts` en suivant le format
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

### ✅ V1.0 - Production Ready (Novembre 2024)

- [x] Questionnaire personnalisé (particuliers + entreprises)
- [x] Catalogue avec 22 solutions référencées
- [x] Algorithme de scoring plafonné à 100%
- [x] Randomisation des ex-aequo
- [x] Disclaimers médicaux et numéros d'urgence
- [x] Analytics privacy-first (Plausible)
- [x] Open source (MIT)
- [x] Build optimisé < 350 KB

### 🔮 V2 - Expansion (2025)

- [ ] Scoring avancé avec pondération entreprise/individuel
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)

### 🌟 V3 - Écosystème (2026)

- [ ] Multi-langue (EN, ES, DE)
- [ ] PWA avec mode offline
- [ ] API publique
- [ ] Système de favoris
- [ ] Avis utilisateurs vérifiés

---

**Version actuelle** : V1.0.0
**Dernière mise à jour** : Novembre 2025
**Status** : ✅ Production Ready
