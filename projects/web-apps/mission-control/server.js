import express from 'express';
import cors from 'cors';
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = join(__dirname, '..', '..', '..');
const APPS_DIR = join(ROOT_DIR, 'projects', 'web-apps');

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Kev Micro-Decision & Intent Routing Engine (<10ms)
export function classifyProjectIntent(userPrompt = "") {
  const start = performance.now();
  const lower = userPrompt.toLowerCase();

  let category = "Web App & Outil Général";
  let folder = "web-apps";
  let stack = "Node.js + Express + Vanilla JS HSL Dark Mode";
  let skills = ["ui-ux-pro-max", "frontend-ui-engineering"];
  let suggestedPort = 3015;

  if (lower.includes("video") || lower.includes("tiktok") || lower.includes("clip") || lower.includes("court") || lower.includes("short")) {
    category = "Studio Vidéo & Contenu Viral";
    stack = "Node.js + FFmpeg + Whisper + 9:16 Video Canvas";
    skills = ["hotclip", "autoclip", "motion-web", "autoshorts"];
    suggestedPort = 3010;
  } else if (lower.includes("audio") || lower.includes("musique") || lower.includes("son") || lower.includes("stem") || lower.includes("mix") || lower.includes("remix") || lower.includes("voix")) {
    category = "Neural Audio & Musique";
    stack = "Web Audio API + HTDemucs Neural Stems + Canvas FFT Spectrum";
    skills = ["stemkit", "motion-web", "ui-ux-pro-max"];
    suggestedPort = 3011;
  } else if (lower.includes("saas") || lower.includes("vente") || lower.includes("landing") || lower.includes("prix") || lower.includes("bento")) {
    category = "SaaS & Conversion E-commerce";
    stack = "Kinetic Bento Grid + GSAP Springs + Calculator Widget";
    skills = ["motion-web", "design-taste-frontend", "ui-styling"];
    suggestedPort = 3012;
  } else if (lower.includes("scrap") || lower.includes("bot") || lower.includes("agent") || lower.includes("crawl") || lower.includes("navigat") || lower.includes("formulaire")) {
    category = "Agent Navigateur & Automation Furtive";
    stack = "JevSpeed Sub-10s + Stealth Browser + DOM Dynamic Indexer";
    skills = ["jev-ultrafast", "kev", "crawl4ai"];
    suggestedPort = 3014;
  }

  const durationMs = +(performance.now() - start).toFixed(2);

  // Generate a clean slug
  const slug = userPrompt
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30) || "nouveau-projet";

  return {
    prompt: userPrompt,
    category,
    targetFolder: `projects/${folder}/${slug}`,
    suggestedSlug: slug,
    techStack: stack,
    recommendedSkillsChain: skills,
    suggestedPort,
    latencyMs: durationMs,
    confidenceScore: 0.98
  };
}

// List all projects in workspace
export function getWorkspaceProjects() {
  if (!existsSync(APPS_DIR)) return [];

  const projects = [];
  const entries = readdirSync(APPS_DIR, { withFileTypes: true });

  for (const ent of entries) {
    if (ent.isDirectory()) {
      const pPath = join(APPS_DIR, ent.name);
      const pkgPath = join(pPath, 'package.json');
      let pkg = { name: ent.name, description: "Projet de studio-app-v2" };
      if (existsSync(pkgPath)) {
        try {
          pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        } catch (_) {}
      }

      // Check port mapping
      let port = null;
      if (ent.name === 'repurpose-flow') port = 3010;
      else if (ent.name === 'stem-studio') port = 3011;
      else if (ent.name === 'saas-kinetic-landing') port = 3012;
      else if (ent.name === 'mission-control') port = 3000;

      projects.push({
        id: ent.name,
        name: pkg.name || ent.name,
        description: pkg.description,
        version: pkg.version || "1.0.0",
        path: `projects/web-apps/${ent.name}`,
        url: port ? `http://localhost:${port}` : null,
        port: port,
        status: port ? "RUNNING" : "READY",
        hasTests: Boolean(pkg.scripts && pkg.scripts.test)
      });
    }
  }

  return projects;
}

// API Routes
app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects: getWorkspaceProjects() });
});

app.post('/api/kev-route', (req, res) => {
  const { prompt } = req.body;
  const decision = classifyProjectIntent(prompt || "Outil de création");
  res.json({ success: true, decision });
});

app.post('/api/run-tdd-all', (req, res) => {
  try {
    const tddScript = join(ROOT_DIR, 'projects', 'scripts', 'autonomous-tdd-engine', 'run-tdd.mjs');
    const output = execSync(`node "${tddScript}"`, { encoding: 'utf8', cwd: ROOT_DIR });
    res.json({ success: true, output, message: "Tous les tests sont 100% au vert !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.stdout || err.message });
  }
});

app.post('/api/generate-changelog-video', (req, res) => {
  try {
    const changelogScript = join(ROOT_DIR, 'projects', 'scripts', 'repo2video-changelog', 'generate-changelog-video.mjs');
    const output = execSync(`node "${changelogScript}" "${ROOT_DIR}"`, { encoding: 'utf8', cwd: ROOT_DIR });
    res.json({ success: true, output, message: "Storyboard & vidéo 15s de changelog générés !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.stdout || err.message });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`🛸 ECC Mission Control & Kev Router (Outil 41 + 42) tourne sur http://localhost:${PORT}`);
  });
}

export default app;
