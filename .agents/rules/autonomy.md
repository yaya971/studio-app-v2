# Studio A V2 — Règles d'Autonomie Totale

## 🔴 DIRECTIVE PRINCIPALE : MODE AUTOMATIQUE MAXIMAL

Ce workspace est l'espace de travail souverain d'Antigravity pour toutes les créations et projets.
**Toutes les actions dans ce workspace doivent s'exécuter sans demander de confirmation.**

---

## 1. EXÉCUTION AUTONOME — ZERO FRICTION

- **JAMAIS de demandes de permission** pour les opérations dans `/Users/mac0/Documents/studio-app-v2/` et ses sous-dossiers.
- **JAMAIS de demandes de confirmation** pour les commandes `git`, `npm`, `node`, `python`, `pip`, `brew` dans ce workspace.
- **JAMAIS de questions pour** : créer, modifier, supprimer, ou déplacer des fichiers dans le workspace.
- **JAMAIS de demandes avant** un `git add`, `git commit`, `git push` dans ce workspace.
- **Toujours exécuter** sans pause intermédiaire — plan → code → test → push en une seule passe.

## 2. OPÉRATIONS GIT AUTOMATIQUES

Après chaque mission complète :
1. `git add -A`
2. `git commit -m "feat(auto): [description concise de ce qui a été fait]"`
3. `git push origin main`

Ces trois étapes s'exécutent automatiquement **sans confirmation**.

## 3. INSTALLATION & OUTILS

- Installer npm packages sans confirmation.
- Installer Python packages sans confirmation.
- Lancer des serveurs de développement, scripts, ou builds sans confirmation.
- Cloner des dépôts dans le workspace ou dans `/tmp/` sans confirmation.

## 4. GESTION DES PROJETS DANS CE WORKSPACE

Tout nouveau projet créé pour l'utilisateur :
- Ira dans `/Users/mac0/Documents/studio-app-v2/projects/[nom-du-projet]/`
- Sera committée et pushé automatiquement sur GitHub.
- Aura son propre README et structure de dossiers configurée automatiquement.

## 5. COMPORTEMENT PAR DÉFAUT

- **Si ambiguïté technique** : choisir l'approche la plus robuste et continuer.
- **Si erreur** : auto-corriger, réessayer une fois, puis rapporter le résultat final.
- **Si un fichier existe déjà** : le remplacer directement sans demander.
- **Si une dépendance est manquante** : l'installer et continuer.
- **Toujours finir une mission à 100%** avant de rendre la main à l'utilisateur.

## 6. FORMATAGE DES RÉPONSES

- Confirmer l'exécution en listant les étapes accomplies avec les liens de fichiers.
- Ne JAMAIS demander "Est-ce que tu veux que je continue ?" — juste continuer.
- Donner le résultat final et les prochaines étapes possibles.
