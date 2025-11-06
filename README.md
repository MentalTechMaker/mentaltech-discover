# MentalTech Discover

**MentalTech Discover** est un outil créé par **[MentalTechMaker](https://mentaltechmaker.fr)** pour le **Collectif MentalTech** qui aide les utilisateurs à naviguer dans l'écosystème des solutions digitales en santé mentale.

## À propos

MentalTech Discover référence **X solutions** des membres du Collectif MentalTech et aide les utilisateurs à trouver celles qui correspondent le mieux à leurs besoins via :

- **Questionnaire personnalisé** - 2 minutes pour des recommandations sur-mesure
- **Catalogue complet** - Explorez toutes les solutions avec des filtres avancés
- **Algorithme de scoring** - Matching intelligent basé sur vos réponses
- **100% gratuit et anonyme** - Aucune donnée collectée

## Fonctionnalités

### Recommandations personnalisées

Un questionnaire rapide analyse vos besoins et recommande 2-3 solutions parmi :

- **Public cible** : adultes, adolescents, enfants, parents, entreprises
- **Problématiques** : stress, anxiété, dépression, addictions, burn-out, sommeil, trauma
- **Préférences** : accompagnement autonome, thérapie immédiate, programmes structurés

### Catalogue interactif

Explorez toutes les solutions avec 8 filtres :

- Recherche textuelle
- Type de service (téléconsultation, méditation, VR, TCC, etc.)
- Audience ciblée
- Problèmes traités
- Modèle de tarification (gratuit, freemium, abonnement, B2B)
- Statut de l'entreprise
- Public (particuliers vs entreprises)

### Interface moderne

- Design épuré avec emojis
- Vue grille et vue liste
- Responsive (mobile, tablet, desktop)
- Badges colorés par catégorie
- Accessibilité optimisée

## Stack technique

- **Frontend:** React 19 + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS 4
- **Build:** Vite 7
- **Qualité:** ESLint + TypeScript strict mode

## Installation

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

### Informations par solution

Chaque solution comprend :

- Type de service
- Description détaillée
- Public cible
- Problèmes traités
- Modèle de tarification
- Lien vers le site officiel
- Statut de l'entreprise

## Cas d'usage

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

## Design

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

## Confidentialité

- ✅ **100% anonyme** - Aucune donnée personnelle collectée
- ✅ **Pas de tracking** - Aucun analytics
- ✅ **Pas de cookies** - Navigation privée
- ✅ **Open source** - Code transparent

## Performance

- Build optimisé : < 300KB total
- Time to Interactive : < 2s
- Lighthouse Score : 95+
- Responsive : Mobile-first

## Contribution

Ce projet a été créé par **MentalTechMaker** pour le Collectif MentalTech.

Pour ajouter une solution ou proposer des améliorations :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/nouvelle-solution`)
3. Commit les changements (`git commit -m 'Ajout de [Solution]'`)
4. Push vers la branche (`git push origin feature/nouvelle-solution`)
5. Créer une Pull Request

## Licence

Développé pour le **Collectif MentalTech** - Écosystème français de la santé mentale digitale.

Les données sur les solutions proviennent de sources publiques et sont mises à jour régulièrement.

## Remerciements

- **Collectif MentalTech** et tous ses membres
- Toutes les **entreprises innovantes** en santé mentale
- La **communauté open source** React/TypeScript

## Créateur

**MentalTechMaker** - Membre du Collectif MentalTech

- Website : [mentaltechmaker.fr](https://mentaltechmaker.fr)
- LinkedIn : [Arnaud Bressot](https://www.linkedin.com/in/arnaudbressot)
- Email : arnaud@mentaltechmaker.fr

## Contact Collectif

- Website : [mentaltech.fr](https://mentaltech.fr)
- LinkedIn : [Collectif MentalTech](https://www.linkedin.com/company/mentaltech)

## Roadmap

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
