document.addEventListener('DOMContentLoaded', () => {
  const kevPromptInput = document.getElementById('kevPromptInput');
  const btnClassify = document.getElementById('btnClassify');
  const resCategory = document.getElementById('resCategory');
  const resLatency = document.getElementById('resLatency');
  const resStack = document.getElementById('resStack');
  const resSkills = document.getElementById('resSkills');
  const btnScaffoldProject = document.getElementById('btnScaffoldProject');
  const projectsGrid = document.getElementById('projectsGrid');
  const projectsCount = document.getElementById('projectsCount');

  const btnRunTdd = document.getElementById('btnRunTdd');
  const btnRunChangelog = document.getElementById('btnRunChangelog');
  const terminalOutputSection = document.getElementById('terminalOutputSection');
  const terminalTitle = document.getElementById('terminalTitle');
  const terminalCodeOutput = document.getElementById('terminalCodeOutput');
  const btnCloseTerminal = document.getElementById('btnCloseTerminal');
  const toast = document.getElementById('toast');

  let currentDecision = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
  }

  btnCloseTerminal.addEventListener('click', () => {
    terminalOutputSection.hidden = true;
  });

  // Kev Micro-Router Classification
  async function runKevRouting() {
    const prompt = kevPromptInput.value.trim();
    if (!prompt) return;

    try {
      const res = await fetch('/api/kev-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.success) {
        currentDecision = data.decision;
        resCategory.textContent = currentDecision.category;
        resLatency.textContent = `⚡ ${currentDecision.latencyMs} ms`;
        resStack.textContent = currentDecision.techStack;
        resSkills.innerHTML = currentDecision.recommendedSkillsChain.map(s => `<span class="skill-tag">${s}</span>`).join('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  btnClassify.addEventListener('click', runKevRouting);
  kevPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runKevRouting();
  });

  btnScaffoldProject.addEventListener('click', () => {
    if (!currentDecision) return;
    showToast(`🚀 Projet "${currentDecision.suggestedSlug}" prêt dans ${currentDecision.targetFolder} !`);
  });

  // Fetch and display active workspace projects
  async function loadProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (!data.success) return;

      projectsGrid.innerHTML = '';
      projectsCount.textContent = `${data.projects.length} Applications en ligne`;

      data.projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <div class="project-header">
            <div>
              <div class="project-title">${p.name}</div>
              <small style="color:var(--text-muted)">${p.path}</small>
            </div>
            <span class="status-badge running">${p.status}</span>
          </div>
          <div class="project-desc">${p.description || "Application autonome Studio App v2"}</div>
          <div class="project-footer">
            <span class="project-port">Port : :${p.port || '3000'}</span>
            ${p.url ? `<a href="${p.url}" target="_blank" class="btn btn-primary btn-sm">Ouvrir l'App ↗</a>` : ''}
          </div>
        `;
        projectsGrid.appendChild(card);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // TDD Engine Runner
  btnRunTdd.addEventListener('click', async () => {
    showToast("🧪 Exécution du moteur TDD sur tous les projets...");
    terminalTitle.textContent = "🛡️ Autonomous TDD Engine — Rapport d'exécution";
    terminalCodeOutput.textContent = "Exécution des tests en cours...\n";
    terminalOutputSection.hidden = false;

    try {
      const res = await fetch('/api/run-tdd-all', { method: 'POST' });
      const data = await res.json();
      terminalCodeOutput.textContent = data.output || data.error;
    } catch (err) {
      terminalCodeOutput.textContent = "Erreur : " + err.message;
    }
  });

  // Changelog Video Runner
  btnRunChangelog.addEventListener('click', async () => {
    showToast("🎬 Génération de la vidéo de changelog...");
    terminalTitle.textContent = "🎥 Repo2Video Changelog Generator — Storyboard";
    terminalCodeOutput.textContent = "Génération du changelog vidéo...\n";
    terminalOutputSection.hidden = false;

    try {
      const res = await fetch('/api/generate-changelog-video', { method: 'POST' });
      const data = await res.json();
      terminalCodeOutput.textContent = data.output || data.error;
    } catch (err) {
      terminalCodeOutput.textContent = "Erreur : " + err.message;
    }
  });

  // Initial runs
  runKevRouting();
  loadProjects();
});
