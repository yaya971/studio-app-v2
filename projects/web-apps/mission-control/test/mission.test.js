import test from 'node:test';
import assert from 'node:assert';
import { classifyProjectIntent, getWorkspaceProjects } from '../server.js';

test('MissionControl - classifyProjectIntent Kev Router responds in <10ms with valid routing', () => {
  const result = classifyProjectIntent("Je veux un outil de découpage de vidéo TikTok");
  assert.strictEqual(result.category, "Studio Vidéo & Contenu Viral");
  assert.ok(result.recommendedSkillsChain.includes('hotclip'));
  assert.ok(result.latencyMs < 10, "La latence de Kev doit être < 10ms");
  assert.strictEqual(result.confidenceScore, 0.98);
});

test('MissionControl - getWorkspaceProjects discovers projects in workspace', () => {
  const projects = getWorkspaceProjects();
  assert.ok(projects.length >= 3, "Au moins 3 projets web doivent être répertoriés");
  const names = projects.map(p => p.id);
  assert.ok(names.includes('repurpose-flow'));
  assert.ok(names.includes('stem-studio'));
  assert.ok(names.includes('saas-kinetic-landing'));
});
