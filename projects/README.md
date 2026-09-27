# 🚀 Studio App v2 — Projets & Applications Actives

Bienvenue dans l'espace de projets de **Studio App v2**. Toutes les applications sont construites en architecture autonome et tournent en local.

---

## 🌐 Applications Web Opérationnelles (`projects/web-apps/`)

| Application | Port Local | Outils Utilisés | Description & Fonctionnalités |
| :--- | :--- | :--- | :--- |
| **[ECC Mission Control](http://localhost:3000)** | `3000` | `ECC` + `kev` (Outils 41 & 42) | **Cockpit de pilotage du workspace & Micro-Routeur d'intentions (<1.5ms)** : Détection d'intentions, scaffolding 1-clic, exécution du moteur TDD global et générateur de changelog vidéo. |
| **[RepurposeFlow](http://localhost:3010)** | `3010` | `hotclip` + `autoclip` + `motion-web` (Outil 06) | **Découpeur YouTube vers 10 Shorts TikTok Viraux** : Détection des hooks par IA, sous-titres animés karaoké style Hormozi, descriptions & hashtags prêts à poster, et filtres anti-blocage (micro-pitch + micro-zoom + anti-pHash). |
| **[StemStudio & Mashup DJ](http://localhost:3011)** | `3011` | `stemkit` + Web Audio (Outils 11, 12, 19) | **Suite Audio Neuronale 3-en-1** :<br>• *StemForge (11)* : Mixeur 4 pistes (Voix, Batterie, Basse, Synthés) avec solo/mute et spectre temps-réel.<br>• *Vocal Isolator (12)* : Isole l'Acapella pure ou l'Instrumental karaoké en 1 clic.<br>• *Mashup DJ Lab (19)* : Mixe deux sons simultanés (Voix A sur Beat B) avec synchronisation auto du BPM. |
| **[SaaS Kinetic Bento Landing](http://localhost:3012)** | `3012` | `motion-web` + `ui-ux-pro-max` (Outil 33) | **Landing Page SaaS Conversion Maximale** : Bento grid kinétique, calculateur interactif de revenus/ROI, tarification en abonnements mensuels/annuels (-20%) et preuves sociales. |

---

## 🛠️ Outils Transversaux du Workspace

| Outil | Script CLI | Description |
| :--- | :--- | :--- |
| **Autonomous TDD Engine (Outil 43)** | `node projects/scripts/autonomous-tdd-engine/run-tdd.mjs` | Testeur automatique en boucle fermée qui valide 100% des suites de tests de tous les projets du workspace. |
| **Repo2Video Changelog Generator (Outil 44)** | `node projects/scripts/repo2video-changelog/generate-changelog-video.mjs` | Analyse les commits git récents et produit un storyboard / vidéo de présentation 15s des nouveautés. |

---

## 🧪 Validation TDD Globale

Tous les projets disposent de suites de tests unitaires dédiées. Exécutez :
```bash
node projects/scripts/autonomous-tdd-engine/run-tdd.mjs
```
Résultat : **4/4 projets validés (100% vert, zéro régression)**.
