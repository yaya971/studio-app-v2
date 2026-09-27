# 🛸 Guide d'Orchestration Automatique — Studio A V2

Ce document détaille le fonctionnement du système automatique d'orchestration intelligente du workspace **Studio A V2**.

---

## 🎯 Architecture des 7 Phases

L'orchestrateur structure chaque interaction de développement en 7 étapes coordonnées afin de garantir une qualité industrielle tout en minimisant les coûts en tokens et le temps de développement :

```mermaid
graph TD
    A[Demande / Objectif] --> B[Phase 1 : Discovery & Memory]
    B --> C[Phase 2 : Specs & Task Breakdown]
    C --> D[Phase 3 : UI/UX Pro Max]
    D --> E[Phase 4 : TDD & Implementation]
    E --> F[Phase 5 : Audit & Browser Validation]
    F --> G[Phase 6 : Perf & Token Optimization]
    G --> H[Phase 7 : Launch & Multi-Agent Sync]
```

---

## 🛠️ Matrice Complète des Skills et Outils

### 1. Discovery & Cartographie de Code
- [`skills/understand/`](file:///Users/mac0/Documents/studio-app-v2/skills/understand) : Cartographie complète du code et graphes de dépendances.
- [`skills/understand-domain/`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-domain) : Extraction de la logique métier et flux opérationnels.
- [`skills/projectmem/`](file:///Users/mac0/Documents/studio-app-v2/skills/projectmem) : Mémoire persistante du projet, réduction de 50% des tokens, mémorisation des pièges et décisions.

### 2. Spécification & Cadrage
- [`skills/spec-driven-development/`](file:///Users/mac0/Documents/studio-app-v2/skills/spec-driven-development) : Définition des contrats et critères de succès.
- [`skills/planning-and-task-breakdown/`](file:///Users/mac0/Documents/studio-app-v2/skills/planning-and-task-breakdown) : Découpage méthodique en tâches unitaires.
- [`skills/interview-me/`](file:///Users/mac0/Documents/studio-app-v2/skills/interview-me) : Clarification des zones d'ombre par questions ciblées.

### 3. UI/UX Pro Max & Design System
- [`skills/ui-ux-pro-max/`](file:///Users/mac0/Documents/studio-app-v2/skills/ui-ux-pro-max) : Standards haut de gamme, palettes HSL, micro-interactions, anti-design générique.
- [`skills/design-system/`](file:///Users/mac0/Documents/studio-app-v2/skills/design-system) : Tokens, typographie moderne et bibliothèques de composants.
- [`skills/ui-styling/`](file:///Users/mac0/Documents/studio-app-v2/skills/ui-styling) : Styling CSS moderne, Tailwind, glassmorphism.
- [`skills/brand/`](file:///Users/mac0/Documents/studio-app-v2/skills/brand), [`skills/banner-design/`](file:///Users/mac0/Documents/studio-app-v2/skills/banner-design), [`skills/slides/`](file:///Users/mac0/Documents/studio-app-v2/skills/slides) : Assets de conversion et communication.

### 4. Implémentation & TDD
- [`skills/test-driven-development/`](file:///Users/mac0/Documents/studio-app-v2/skills/test-driven-development) : Écriture des tests d'abord, garantie de non-régression.
- [`skills/incremental-implementation/`](file:///Users/mac0/Documents/studio-app-v2/skills/incremental-implementation) : Développement par petits lots vérifiables.
- [`skills/code-simplification/`](file:///Users/mac0/Documents/studio-app-v2/skills/code-simplification) : Élimination de la complexité superflue.

### 5. Audit & Validation Navigateur
- [`skills/understand-diff/`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-diff) : Analyse prédictive des impacts de changements.
- [`skills/browser-testing-with-devtools/`](file:///Users/mac0/Documents/studio-app-v2/skills/browser-testing-with-devtools) : Validation visuelle, a11y et interactions réelles.
- [`skills/debugging-and-error-recovery/`](file:///Users/mac0/Documents/studio-app-v2/skills/debugging-and-error-recovery) : Résolution méthodique de bugs et logs.

### 6. Performance, Sécurité & Tokens
- [`skills/token-monitor/`](file:///Users/mac0/Documents/studio-app-v2/skills/token-monitor) : Télémesure en temps réel des coûts et de l'usage des tokens.
- [`skills/performance-optimization/`](file:///Users/mac0/Documents/studio-app-v2/skills/performance-optimization) : Core Web Vitals, chargements et réactivité.
- [`skills/security-and-hardening/`](file:///Users/mac0/Documents/studio-app-v2/skills/security-and-hardening) : Audit des failles, dépendances et accès.

### 7. Multi-Agent & Déploiement
- [`skills/hcom-agent-messaging/`](file:///Users/mac0/Documents/studio-app-v2/skills/hcom-agent-messaging) : Communication inter-agents temps réel entre terminaux.
- [`skills/promptscript/`](file:///Users/mac0/Documents/studio-app-v2/skills/promptscript) : Compilation de la config d'agents vers 50 plateformes.
- [`skills/shipping-and-launch/`](file:///Users/mac0/Documents/studio-app-v2/skills/shipping-and-launch) : Checklists et automatisations de mise en production.

---

## ⚡ Commandes Rapides

```bash
# Vérifier l'inventaire et les phases actives
npm run status

# Obtenir la recommandation intelligente pour une tâche
npm run route "Refondre le tunnel d'inscription avec Tailwind et vérifier l'a11y"

# Exécuter les pré-vérifications qualité et mémoire
npm run precheck

# Voir les commandes des dashboards graphiques
npm run dashboard
```
