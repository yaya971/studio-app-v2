# 🛸 Studio A V2

Espace de travail Antigravity — création de projets en mode autonome.

## Démarrage rapide

Dis simplement ce que tu veux créer dans le chat Antigravity, par exemple :
- *"Crée une landing page pour mon SaaS"*
- *"Fais-moi un script Python pour analyser des fichiers CSV"*
- *"Construis un backend API REST avec auth"*

L'agent s'occupe de tout : code, design, tests, push GitHub.

---

## Structure du Workspace

```
studio-app-v2/
│
├── 📁 projects/               ← Tous les projets créés ici
│   ├── 📁 web-apps/           ← Sites & apps web (Next.js, React, HTML)
│   ├── 📁 apis/               ← Backends, APIs REST/GraphQL
│   ├── 📁 scripts/            ← Scripts Node.js, Bash, automatisations
│   ├── 📁 python/             ← Scripts & programmes Python
│   ├── 📁 mobile/             ← Apps mobiles (React Native, Expo)
│   └── 📁 experiments/        ← Prototypes rapides & POCs
│
├── 📁 skills/                 ← 47 skills Antigravity (moteur IA)
├── 📁 Understand-Anything/    ← Cartographie de code & dashboard
├── 📁 tools/                  ← Outils locaux (gitignorés)
│
├── ⚙️  orchestrator.mjs       ← Moteur d'orchestration automatique
├── 📄 AGENTS.md               ← Config mode autonome
└── 📄 WORKFLOW.md             ← Guide des 7 phases de développement
```

---

## Commandes utiles

```bash
npm run status      # État du workspace et des 47 skills
npm run route "..."  # Recommandation de skills pour une tâche
npm run dashboard   # Dashboards graphiques disponibles
```
