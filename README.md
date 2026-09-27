# 🛸 Antigravity Studio A V2 — Workspace Orchestré

Bienvenue dans votre environnement opérationnel central **Studio A V2**. Ce dépôt intègre désormais un écosystème complet de **47 skills spécialisées**, **8 packages et outils industriels** dans [`tools/`](file:///Users/mac0/Documents/studio-app-v2/tools), ainsi qu'un **moteur d'orchestration automatique** ([`orchestrator.mjs`](file:///Users/mac0/Documents/studio-app-v2/orchestrator.mjs)).

---

## ⚡ Système d'Orchestration Automatique

Pour maximiser l'efficacité du workflow et optimiser l'utilisation des tokens, chaque demande est analysée et dirigée vers la chaîne de compétences appropriée via le système en 7 phases :

```bash
# Analyse de statut du workspace et des compétences actives
npm run status

# Routage intelligent d'une intention ou tâche
npm run route "Créer une interface de dashboard premium et surveiller les tokens"

# Contrôle qualité et vérification de la mémoire projet
npm run precheck

# Liste des dashboards interactifs (Understand, Token Monitor, ProjectMem)
npm run dashboard
```

Consultez le guide complet : [`WORKFLOW.md`](file:///Users/mac0/Documents/studio-app-v2/WORKFLOW.md).

---

## 🛠️ Outils & Dépôts Clés dans [`tools/`](file:///Users/mac0/Documents/studio-app-v2/tools)

| Répertoire | Rôle & Description |
| :--- | :--- |
| [`Understand-Anything/`](file:///Users/mac0/Documents/studio-app-v2/Understand-Anything) | Cartographie de code, dashboard interactif de dépendances, détection de domaine et onboarding. |
| [`tools/ui-ux-pro-max-skill/`](file:///Users/mac0/Documents/studio-app-v2/tools/ui-ux-pro-max-skill) | Système de design d'élite, tokens UI, palettes HSL, composants anti-génériques, bannières et slides. |
| [`tools/agent-skills/`](file:///Users/mac0/Documents/studio-app-v2/tools/agent-skills) | 25 compétences d'ingénierie logicielle d'Addy Osmani (TDD, Spec, DevTools, Perf, Sécurité). |
| [`tools/CLIProxyAPI/`](file:///Users/mac0/Documents/studio-app-v2/tools/CLIProxyAPI) | Proxy local multi-modèles (OpenAI, Gemini, Claude, Kimi) avec gestion de bascule et quotas. |
| [`tools/token-monitor/`](file:///Users/mac0/Documents/studio-app-v2/tools/token-monitor) | Dashboard temps réel de télémétrie des tokens, calcul des coûts et synchronisation multi-machines. |
| [`tools/projectmem/`](file:///Users/mac0/Documents/studio-app-v2/tools/projectmem) | Mémoire persistante du projet (réduction de 50% des tokens, détection des pièges via `pjm precheck`). |
| [`tools/awesome-agent-skills/`](file:///Users/mac0/Documents/studio-app-v2/tools/awesome-agent-skills) | Référentiel méthodologique et bonnes pratiques d'architecture des skills et du contexte. |
| [`tools/hcom/`](file:///Users/mac0/Documents/studio-app-v2/tools/hcom) | Système de messagerie et coordination temps réel entre agents dans plusieurs terminaux. |
| [`tools/promptscript/`](file:///Users/mac0/Documents/studio-app-v2/tools/promptscript) | Configuration-as-Code pour agents (.prs), compilation native vers 50 plateformes d'IA. |

---

## 📦 Matrice des 47 Skills Installées dans [`skills/`](file:///Users/mac0/Documents/studio-app-v2/skills)

Toutes les skills sont disponibles simultanément dans [`skills/`](file:///Users/mac0/Documents/studio-app-v2/skills) (accès direct dans l'Explorer) et dans [`.agents/skills/`](file:///Users/mac0/Documents/studio-app-v2/.agents/skills) pour la détection native par Antigravity :

1. **Meta & Orchestration** :
   - [`antigravity-orchestrator`](file:///Users/mac0/Documents/studio-app-v2/skills/antigravity-orchestrator)
2. **Architecture & Découverte (Understand-Anything)** :
   - [`understand`](file:///Users/mac0/Documents/studio-app-v2/skills/understand), [`understand-chat`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-chat), [`understand-dashboard`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-dashboard), [`understand-diff`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-diff), [`understand-domain`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-domain), [`understand-explain`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-explain), [`understand-figma`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-figma), [`understand-knowledge`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-knowledge), [`understand-onboard`](file:///Users/mac0/Documents/studio-app-v2/skills/understand-onboard)
3. **UI/UX Pro Max & Design** :
   - [`ui-ux-pro-max`](file:///Users/mac0/Documents/studio-app-v2/skills/ui-ux-pro-max), [`design-system`](file:///Users/mac0/Documents/studio-app-v2/skills/design-system), [`ui-styling`](file:///Users/mac0/Documents/studio-app-v2/skills/ui-styling), [`design`](file:///Users/mac0/Documents/studio-app-v2/skills/design), [`brand`](file:///Users/mac0/Documents/studio-app-v2/skills/brand), [`banner-design`](file:///Users/mac0/Documents/studio-app-v2/skills/banner-design), [`slides`](file:///Users/mac0/Documents/studio-app-v2/skills/slides)
4. **Ingénierie & Qualité (Addy Osmani)** :
   - [`frontend-ui-engineering`](file:///Users/mac0/Documents/studio-app-v2/skills/frontend-ui-engineering), [`test-driven-development`](file:///Users/mac0/Documents/studio-app-v2/skills/test-driven-development), [`spec-driven-development`](file:///Users/mac0/Documents/studio-app-v2/skills/spec-driven-development), [`planning-and-task-breakdown`](file:///Users/mac0/Documents/studio-app-v2/skills/planning-and-task-breakdown), [`incremental-implementation`](file:///Users/mac0/Documents/studio-app-v2/skills/incremental-implementation), [`code-simplification`](file:///Users/mac0/Documents/studio-app-v2/skills/code-simplification), [`code-review-and-quality`](file:///Users/mac0/Documents/studio-app-v2/skills/code-review-and-quality), [`browser-testing-with-devtools`](file:///Users/mac0/Documents/studio-app-v2/skills/browser-testing-with-devtools), [`debugging-and-error-recovery`](file:///Users/mac0/Documents/studio-app-v2/skills/debugging-and-error-recovery), [`security-and-hardening`](file:///Users/mac0/Documents/studio-app-v2/skills/security-and-hardening), [`performance-optimization`](file:///Users/mac0/Documents/studio-app-v2/skills/performance-optimization), [`api-and-interface-design`](file:///Users/mac0/Documents/studio-app-v2/skills/api-and-interface-design), [`context-engineering`](file:///Users/mac0/Documents/studio-app-v2/skills/context-engineering), [`ci-cd-and-automation`](file:///Users/mac0/Documents/studio-app-v2/skills/ci-cd-and-automation), [`git-workflow-and-versioning`](file:///Users/mac0/Documents/studio-app-v2/skills/git-workflow-and-versioning), [`shipping-and-launch`](file:///Users/mac0/Documents/studio-app-v2/skills/shipping-and-launch), [`observability-and-instrumentation`](file:///Users/mac0/Documents/studio-app-v2/skills/observability-and-instrumentation), [`documentation-and-adrs`](file:///Users/mac0/Documents/studio-app-v2/skills/documentation-and-adrs), [`deprecation-and-migration`](file:///Users/mac0/Documents/studio-app-v2/skills/deprecation-and-migration), [`doubt-driven-development`](file:///Users/mac0/Documents/studio-app-v2/skills/doubt-driven-development), [`constraint-driven-development`](file:///Users/mac0/Documents/studio-app-v2/skills/constraint-driven-development), [`source-driven-development`](file:///Users/mac0/Documents/studio-app-v2/skills/source-driven-development), [`idea-refine`](file:///Users/mac0/Documents/studio-app-v2/skills/idea-refine), [`interview-me`](file:///Users/mac0/Documents/studio-app-v2/skills/interview-me), [`using-agent-skills`](file:///Users/mac0/Documents/studio-app-v2/skills/using-agent-skills)
5. **Mémoire, Coordination & Tokens** :
   - [`projectmem`](file:///Users/mac0/Documents/studio-app-v2/skills/projectmem) : Gestionnaire de mémoire projet persistante.
   - [`token-monitor`](file:///Users/mac0/Documents/studio-app-v2/skills/token-monitor) : Télémétrie et alertes de consommation de tokens.
   - [`cliproxyapi`](file:///Users/mac0/Documents/studio-app-v2/skills/cliproxyapi) : Routage d'APIs multi-fournisseurs.
   - [`promptscript`](file:///Users/mac0/Documents/studio-app-v2/skills/promptscript) : Synchronisation des configurations d'agents.
   - [`hcom-agent-messaging`](file:///Users/mac0/Documents/studio-app-v2/skills/hcom-agent-messaging) : Messagerie inter-terminaux.

---

## 🗂 Arborescence dans l'Explorer

```
.
├── 📁 tools/                     # Dépôts complets et moteurs
│   ├── 📁 agent-skills/
│   ├── 📁 awesome-agent-skills/
│   ├── 📁 CLIProxyAPI/
│   ├── 📁 hcom/
│   ├── 📁 projectmem/
│   ├── 📁 promptscript/
│   ├── 📁 token-monitor/
│   └── 📁 ui-ux-pro-max-skill/
├── 📁 Understand-Anything/       # Dépôt Understand-Anything complet
├── 📁 skills/                    # Les 47 skills opérationnelles
├── 📁 .agents/skills/            # Détection native Antigravity IDE
├── ⚙️ orchestrator.mjs           # Cerveau de routage automatique
├── 📄 package.json               # Commandes et scripts npm
├── 📄 WORKFLOW.md                # Guide des 7 phases d'orchestration
└── 📄 README.md                  # Documentation centrale
```
