# MentalTech Discover

**MentalTech Discover** est un outil créé par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à naviguer dans l'écosystème des solutions digitales en santé mentale.

> ⚕️ **Important** : MentalTech Discover est un outil de découverte, pas un dispositif médical certifié. En cas d'urgence, appelez le **3114** (prévention suicide) ou le **15** (SAMU).

## 🎯 À propos

MentalTech Discover référence **25 solutions** actives des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- **Questionnaire personnalisé** - 3-5 minutes pour des recommandations sur-mesure
- **Catalogue complet** - Explorez toutes les solutions avec des filtres avancés
- **Algorithme de scoring** - Matching intelligent basé sur 5 dimensions
- **100% gratuit et anonyme** - Version V1 entièrement gratuite
- **Open Source** - Code transparent et auditable

## ✨ Fonctionnalités V1

### 🧭 Recommandations personnalisées

Un questionnaire rapide analyse vos besoins et recommande 2-3 solutions parmi :

- **Public cible** : adultes, adolescents, enfants, parents, seniors, entreprises
- **Problématiques** : stress, anxiété, dépression, addictions, burn-out, sommeil, traumatismes
- **Préférences** : accompagnement autonome, thérapie immédiate, programmes structurés, support communautaire

### 📚 Catalogue interactif

Explorez toutes les solutions avec des filtres puissants :

- **Recherche textuelle** : Nom, description, tags
- **Type de service** : Téléconsultation, méditation, VR, TCC, coaching, psychiatrie, etc.
- **Public** : Particuliers, Entreprises, ou les deux
- **Audience** : Adultes, adolescents, enfants, parents, seniors
- **Problèmes traités** : 7 catégories de problématiques
- **Tarification** : Gratuit, Freemium, Abonnement, Par séance, B2B, Sur mesure

### 🛡️ Sécurité et Crédibilité

- **Disclaimers médicaux** : Présents sur Landing et Results avec numéros d'urgence
- **Page Notre Démarche** : 4 critères de référencement explicites
- **FAQ complète** : 22 questions organisées en 7 catégories
- **Mentions légales enrichies** : Hébergement, propriété intellectuelle, responsabilités
- **Signalement facile** : Boutons "Signaler un problème" sur chaque solution et dans le footer

### 📊 Analytics respectueux

- **Plausible Analytics** : Privacy-first, sans cookies
- **Métriques anonymes** : Quiz, filtres, clics solutions, navigation
- **Compatible RGPD** : Aucune donnée personnelle collectée
- **Open source** : Code d'analytics visible et auditable

### 🎨 Interface moderne

- Design épuré avec emojis universels
- Responsive (mobile, tablet, desktop)
- Badges colorés par catégorie
- Accessibilité optimisée (ARIA labels, navigation clavier)
- Animations fluides et professionnelles

## 🏗️ Stack technique

- **Frontend:** React 19 + TypeScript
- **State Management:** Zustand 5
- **Styling:** Tailwind CSS 4
- **Build:** Vite 7
- **Analytics:** Plausible (privacy-first)
- **Qualité:** ESLint + TypeScript strict mode

## 🚀 Installation

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

## 📦 Informations par solution

Chaque solution comprend :

- **Nom et logo** : Identité visuelle
- **Tagline** : Proposition de valeur courte
- **Description** : Présentation détaillée
- **Type de service** : Catégorisation précise
- **Public cible** : Audiences concernées
- **Problèmes traités** : Problématiques adressées
- **Tarification** : Modèle économique
- **Lien officiel** : Accès direct à la solution
- **Statut entreprise** : Membre actif du Collectif
- **Score de match** : Pertinence calculée (Results uniquement)

## 💡 Cas d'usage

### Pour les particuliers

- Découvrir des solutions adaptées sans expertise préalable
- Comparer les options disponibles selon leurs besoins
- Filtrer selon budget, audience et problématiques
- Accéder aux coordonnées d'urgence si nécessaire

### Pour les professionnels de santé

- Référencer des solutions à leurs patients
- Vue d'ensemble de l'écosystème français
- Comprendre les modèles de tarification

### Pour les entreprises

- Trouver des solutions B2B pour leurs collaborateurs
- Comparer les offres entreprise
- Identifier les solutions adaptées à leur taille

## 🎨 Design

### Emojis comme identité visuelle

Choix d'utiliser des emojis pour :

- ✅ Universalité et simplicité
- ✅ Cohérence visuelle sans design system complexe
- ✅ Accessibilité (pas de dépendance aux images)
- ✅ Pas de problèmes de droits d'auteur
- ✅ Chargement instantané (pas de requêtes HTTP)

### Palette de couleurs

- **Primaire:** Bleu (#4A90E2) - Confiance, sérénité, santé
- **Secondaire:** Bleu foncé (#357ABD) - Profondeur, fiabilité
- **Succès:** Vert (#10B981) - Bien-être, croissance
- **Danger:** Rouge (#EF4444) - Urgences, attention
- **Accents:** Violet, Orange, Rose - Diversité des solutions

## 🔒 Confidentialité et Sécurité

### V1 - Privacy-First

- ✅ **Anonyme** - Aucune donnée personnelle collectée ou stockée
- ✅ **Analytics minimal** - Plausible sans cookies, respectueux RGPD
- ✅ **Pas de compte** - Navigation 100% anonyme
- ✅ **Open source** - Code transparent sur GitHub
- ✅ **Pas de tracking tiers** - Aucun pixel, script ou SDK externe

### Disclaimers et Responsabilité

- **Avertissement médical** : Présent sur toutes les pages sensibles
- **Numéros d'urgence** : 3114, 15, 112 affichés de manière proéminente
- **Pas un dispositif médical** : Clairement mentionné
- **Limitations** : Transparence sur ce que l'outil fait et ne fait pas

## ⚡ Performance

- **Build optimisé** : 331 KB total (90 KB gzippé)
- **Target** : < 350 KB maintenu
- **Time to Interactive** : < 2s sur 4G
- **Lighthouse Score** : 95+ attendu
- **Responsive** : Mobile-first approach

## 🤝 Contribution

Ce projet a été créé par **MentalTechMaker** pour le Collectif MentalTech.

### Ajouter une solution

Pour ajouter une solution au catalogue :

1. Vérifier que l'entreprise est membre actif du Collectif MentalTech
2. S'assurer que la solution répond aux 4 critères de référencement :
   - ✅ Membre actif du Collectif MentalTech
   - ✅ Solution digitale opérationnelle
   - ✅ Données publiquement accessibles
   - ✅ Respect des valeurs collectives
3. Fork le repository
4. Ajouter la solution dans `src/data/products.ts`
5. Créer une Pull Request avec description complète

### Proposer des améliorations

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Description claire'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Créer une Pull Request avec contexte et motivation

## 📄 Licence

**MIT License** - Ce projet est open source et peut être :

- ✅ Utilisé commercialement
- ✅ Modifié et distribué
- ✅ Utilisé en privé
- ✅ Sous-licencié

Voir le fichier LICENSE pour plus de détails.

Développé pour le **Collectif MentalTech** - Premier écosystème français de la santé mentale digitale.

## 🙏 Remerciements

- **Collectif MentalTech** et tous ses 25+ membres fondateurs
- Toutes les **entreprises innovantes** en santé mentale digitale
- La **communauté open source** React/TypeScript/Tailwind
- Les **utilisateurs early adopters** qui font confiance à l'outil

## 👤 Créateur

**MentalTechMaker** (Arnaud Bressot) - Membre du Collectif MentalTech

- Website : [mentaltechmaker.fr](https://mentaltechmaker.fr)
- LinkedIn : [Arnaud Bressot](https://www.linkedin.com/in/arnaudbressot)
- Email : arnaud@mentaltechmaker.fr

## 📞 Contact Collectif

**Collectif MentalTech** - Premier écosystème français de santé mentale digitale

- Website : [mentaltech.fr](https://mentaltech.fr)
- LinkedIn : [Collectif MentalTech](https://www.linkedin.com/company/mentaltech)

## 🗺️ Roadmap

### ✅ V1 - Lancement (Novembre 2025)

- [x] Questionnaire personnalisé pour particuliers et entreprises
- [x] Catalogue interactif avec 8 filtres
- [x] 25 solutions référencées du Collectif
- [x] Disclaimers médicaux et numéros d'urgence
- [x] Page "Notre Démarche" avec critères transparents
- [x] FAQ complète (22 questions)
- [x] Signalement de problèmes
- [x] Analytics privacy-first (Plausible)
- [x] Open source (MIT License)
- [x] Build < 350 KB

### 🔮 V2 - Freemium pour Prescripteurs (Q1 2026)

**Gratuit pour tous les utilisateurs finaux - Payant pour professionnels (~29€/mois)**

#### Scoring et Évaluation

- [ ] **Score de confiance** : 4 dimensions (notoriété, maturité, validation, sérieux)
- [ ] **Score d'efficacité** : Preuves scientifiques et retours utilisateurs
- [ ] **Score global** : Visualisation intuitive par solution

#### Fonctionnalités Professionnels

- [ ] **Fiches détaillées** : Business model, équipe, historique
- [ ] **Exports PDF** : Recommandations personnalisées pour patients
- [ ] **Géolocalisation** : Solutions avec présence physique (EMDR, TMS, etc.)
- [ ] **API privée** : Intégration dans outils métier
- [ ] **Support prioritaire** : Assistance dédiée

#### Nouvelles fonctionnalités gratuites

- [ ] Favoris et comparaison
- [ ] Partage de recommandations
- [ ] Notifications de nouvelles solutions
- [ ] Filtres avancés (remboursement, langues, etc.)

### 🌟 V3 - Écosystème complet (Q3 2025)

- [ ] Multi-langue (EN, ES, DE)
- [ ] Intégration avec parcours de soins
- [ ] Marketplace avec mise en relation
- [ ] Avis utilisateurs vérifiés
- [ ] Blog et ressources éducatives
- [ ] Guides thématiques par problématique

### 🔧 Améliorations techniques continues

- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Progressive Web App (PWA)
- [ ] Performance budget enforcement

---

**Version actuelle** : V1.0.0
**Dernière mise à jour** : Novembre 2025
**Status** : ✅ Production Ready
