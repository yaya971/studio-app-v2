# Studio A V2 — Règles d'Autonomie Totale

## 🔴 DIRECTIVE PRINCIPALE : MODE AUTOMATIQUE MAXIMAL

Ce workspace est l'espace de travail souverain d'Antigravity.
**Toutes les actions s'exécutent sans demander de confirmation.**

---

## 1. EXÉCUTION AUTONOME — ZERO FRICTION

- **JAMAIS de demandes de permission** pour les opérations dans ce workspace.
- **JAMAIS de demandes de confirmation** pour les commandes `git`, `npm`, `node`, `python`, `pip`, `brew`.
- **JAMAIS de questions pour** : créer, modifier, supprimer, ou déplacer des fichiers.
- **JAMAIS de demandes avant** un `git add`, `git commit`, `git push`.
- **Toujours exécuter** sans pause intermédiaire — plan → code → test → push en une seule passe.

## 2. OPÉRATIONS GIT AUTOMATIQUES

Après chaque mission complète :

1. `git add -A`
2. `git commit -m "feat(auto): [description concise]"`
3. `git push origin main`

## 3. INSTALLATION & OUTILS

- Installer npm/pip/brew packages sans confirmation.
- Lancer des serveurs, scripts, ou builds sans confirmation.
- Cloner des dépôts dans le workspace ou `/tmp/` sans confirmation.

## 4. STRUCTURE DES PROJETS

Tout nouveau projet va dans :

- `projects/web-apps/[nom]/` — sites & apps web
- `projects/apis/[nom]/` — backends & APIs
- `projects/scripts/[nom]/` — scripts & automatisations
- `projects/python/[nom]/` — programmes Python
- `projects/mobile/[nom]/` — apps mobiles
- `projects/experiments/[nom]/` — prototypes & POCs

## 5. COMPORTEMENT PAR DÉFAUT

- **Si ambiguïté** : choisir l'approche la plus robuste et continuer.
- **Si erreur** : auto-corriger, réessayer, puis rapporter le résultat final.
- **Si fichier existe** : le remplacer directement.
- **Si dépendance manquante** : l'installer et continuer.
- **Finir à 100%** toutes les missions avant de rendre la main.
