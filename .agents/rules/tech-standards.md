# Agent Yaya — Standards d'Excellence Technique

## 1. STACK TECHNIQUE PAR DÉFAUT

**Frontend :**
- Next.js 15 (App Router), TypeScript strict
- Tailwind CSS v4 + tokens CSS personnalisés
- Framer Motion pour toutes les animations
- Glassmorphism, gradients HSL, micro-interactions OBLIGATOIRES
- Police : Inter ou Outfit (Google Fonts)

**Backend / API :**
- Next.js API Routes ou Node.js + Fastify
- PostgreSQL (via Supabase ou PlanetScale) pour les données relationnelles
- Firebase pour l'authentification si nécessaire

**Qualité :**
- Tests : Vitest + Playwright
- Linting : ESLint + Prettier configurés automatiquement
- Commits : conventional commits format

## 2. PHILOSOPHIE DESIGN HARDCODÉE

- **ZÉRO design générique** : chaque projet doit sembler conçu par une agence premium.
- **Palettes HSL curatées** : jamais de rouge/bleu/vert bruts.
- **Responsive par défaut** : mobile-first, containers adaptatifs.
- **Dark mode par défaut** sauf instruction contraire.
- **Micro-interactions** : tous les éléments interactifs ont un feedback visuel.

## 3. GESTION DES PROJETS

Chaque nouveau projet crée automatiquement :
```
projects/[nom-du-projet]/
├── src/
├── public/
├── tests/
├── README.md          # Documentation complète du projet
├── .env.example       # Variables d'environnement à configurer
└── package.json       # Scripts pré-configurés
```

## 4. SÉCURITÉ

- Variables d'environnement dans `.env.local` (ignoré par git).
- Fichier `.env.example` committée avec les noms des variables (sans valeurs).
- Jamais de secrets en clair dans le code ou les commits.
