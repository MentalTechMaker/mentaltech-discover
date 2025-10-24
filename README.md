# MentalTech Discover 💙

> Découvrez les solutions digitales en santé mentale adaptées à vos besoins

**MentalTech Discover** est un outil créé par **[MentalTechMaker](https://mentaltechmaker.com)** pour le **Collectif MentalTech** qui aide les utilisateurs à naviguer dans l'écosystème des solutions digitales en santé mentale.

## 🎯 À propos

MentalTech Discover référence **24 solutions** des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- 🔍 **Questionnaire personnalisé** - 2 minutes pour des recommandations sur-mesure
- 📚 **Catalogue complet** - Explorez toutes les solutions avec des filtres avancés
- 🎯 **Algorithme de scoring** - Matching intelligent basé sur vos réponses
- 💙 **100% gratuit et anonyme** - Aucune donnée collectée

## ✨ Fonctionnalités

### 🧭 Recommandations personnalisées

Un questionnaire rapide analyse vos besoins et recommande 2-3 solutions parmi :

- **Public cible** : adultes, adolescents, enfants, parents, entreprises
- **Problématiques** : stress, anxiété, dépression, addictions, burn-out, sommeil, trauma
- **Préférences** : accompagnement autonome, thérapie immédiate, programmes structurés

### 📱 Catalogue interactif

Explorez toutes les solutions avec 8 filtres :

- Recherche textuelle
- Type de service (téléconsultation, méditation, VR, TCC, etc.)
- Audience ciblée
- Problèmes traités
- Modèle de tarification (gratuit, freemium, abonnement, B2B)
- Statut de l'entreprise
- Public (particuliers vs entreprises)

### 🎨 Interface moderne

- Design épuré avec emojis
- Vue grille et vue liste
- Responsive (mobile, tablet, desktop)
- Badges colorés par catégorie
- Accessibilité optimisée

## 🛠️ Stack technique

- **Frontend:** React 19 + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS 4
- **Build:** Vite 7
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
```

## 📂 Structure du projet

```
mentaltech-discover/
├── src/
│   ├── components/
│   │   ├── Landing.tsx              # Page d'accueil
│   │   ├── Quiz/                    # Questionnaire personnalisé
│   │   ├── Results/                 # Résultats & recommandations
│   │   ├── ProductCatalog/          # Catalogue avec filtres
│   │   └── Layout/                  # Header, Footer
│   ├── data/
│   │   ├── products-extended.ts     # Base des 24 solutions
│   │   ├── questions.ts             # Questions du quiz
│   │   └── recommendationEngine.ts  # Algorithme de scoring
│   ├── types/
│   │   └── index.ts                 # Types TypeScript
│   └── store/
│       └── useAppStore.ts           # Store Zustand
├── public/
└── docs/                            # Documentation
```

## 📊 Solutions référencées

### 24 membres du Collectif MentalTech

**Membres fondateurs (7):**

- 👨‍⚕️ **Qare** - Téléconsultation
- 🧘 **Petit BamBou** - Méditation
- 🥽 **HypnoVR** - Réalité virtuelle
- 🚭 **Kwit** - Sevrage tabagique
- ☕ **moka.care** - Bien-être entreprise
- 👁️ **ResilEyes** - Thérapie trauma
- 🎮 **Tricky** - Prévention ludique

**Membres adhérents (17):**
📊 EDRA - 🍷 EOS Care - 🌈 Feel - 🌿 Holicare - 💚 iFeel - 😴 InSleepLab - 💬 LetsTolk - 🔗 Lyynk - 🧩 Neuredia - 🌟 Pleinia - 👀 Suricog - 🤝 Tuki - 🗣️ WeTalk - 📱 Lisl Up - 🧠 mindDay - 🐨 Koalou - 💡 Lumm

### Informations par solution

Chaque solution comprend :

- Type de service
- Description détaillée
- Public cible
- Problèmes traités
- Modèle de tarification
- Lien vers le site officiel
- Statut de l'entreprise

## 🎯 Cas d'usage

### Pour les particuliers

- Découvrir des solutions adaptées sans expertise
- Comparer les options disponibles
- Filtrer selon budget et préférences

### Pour les professionnels de santé

- Référencer des solutions à leurs patients
- Vue d'ensemble de l'écosystème

### Pour les entreprises

- Trouver des solutions B2B pour collaborateurs
- Comparer les offres entreprise

## 🎨 Design

### Emojis comme identité visuelle

Choix d'utiliser des emojis pour :

- ✅ Universalité et simplicité
- ✅ Cohérence visuelle
- ✅ Accessibilité
- ✅ Pas de problèmes de droits
- ✅ Chargement instantané

### Palette de couleurs

- **Primaire:** Bleu (#4A90E2) - Confiance, sérénité
- **Secondaire:** Vert (#10B981) - Bien-être, croissance
- **Accents:** Violet, Orange, Rose - Diversité

## 🔐 Confidentialité

- ✅ **100% anonyme** - Aucune donnée personnelle collectée
- ✅ **Pas de tracking** - Aucun analytics
- ✅ **Pas de cookies** - Navigation privée
- ✅ **Open source** - Code transparent

## 📈 Performance

- Build optimisé : < 300KB total
- Time to Interactive : < 2s
- Lighthouse Score : 95+
- Responsive : Mobile-first

## 🏗️ Architecture

### Composants React modulaires

- Séparation claire des responsabilités
- Composants réutilisables
- Props typées avec TypeScript
- Hooks personnalisés

### State management

- Store Zustand centralisé
- State minimal et optimisé
- Actions typées

### Performance

- Optimisations React (useMemo, useCallback)
- Lazy loading implicite
- Filtrage temps réel optimisé

## 🤝 Contribution

Ce projet a été créé par **MentalTechMaker** pour le Collectif MentalTech.

Pour ajouter une solution ou proposer des améliorations :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/nouvelle-solution`)
3. Commit les changements (`git commit -m 'Ajout de [Solution]'`)
4. Push vers la branche (`git push origin feature/nouvelle-solution`)
5. Créer une Pull Request

## 📄 Licence

Développé pour le **Collectif MentalTech** - Écosystème français de la santé mentale digitale.

Les données sur les solutions proviennent de sources publiques et sont mises à jour régulièrement.

## 🙏 Remerciements

- **Collectif MentalTech** et tous ses membres
- Toutes les **entreprises innovantes** en santé mentale
- La **communauté open source** React/TypeScript

## 👨‍💻 Créateur

**MentalTechMaker** - Membre du Collectif MentalTech

- 🌐 Website: [mentaltechmaker.com](https://mentaltechmaker.com)
- 💼 LinkedIn: [MentalTechMaker](https://www.linkedin.com/in/mentaltechmaker)

## 📞 Contact Collectif

- **Website**: [mentaltech.fr](https://mentaltech.fr)
- **Email**: arnaud@mentaltechmaker.fr
- **LinkedIn**: [Collectif MentalTech](https://www.linkedin.com/company/mentaltech)

## 🔮 Roadmap

### Prochaines fonctionnalités

- [ ] Export PDF des recommandations
- [ ] Système de favoris
- [ ] Comparaison côte à côte
- [ ] Multi-langue (EN, ES)
- [ ] API publique

### Améliorations techniques

- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring

### Contenu

- [ ] Plus de solutions référencées
- [ ] Avis d'utilisateurs
- [ ] Blog / Ressources
- [ ] Guides thématiques

---

**Version:** 1.0.0
**Dernière mise à jour:** Octobre 2025
**Statut:** ✅ Production Ready

Made with 💙 by MentalTechMaker for the Collectif MentalTech
