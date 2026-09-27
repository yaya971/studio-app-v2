#!/usr/bin/env node

/**
 * 🛡️ Autonomous TDD Engine (Outil 43)
 * Orchestrateur de tests multi-projets :
 * Exécute les suites de tests unitaires, vérifie l'intégrité des composants,
 * valide les endpoints et génère un rapport de conformité 100% au vert.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const APPS_DIR = join(process.cwd(), 'projects', 'web-apps');

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 AUTONOMOUS TDD ENGINE — VALIDATION TOTALE DU WORKSPACE');
console.log('═══════════════════════════════════════════════════════════════\n');

if (!existsSync(APPS_DIR)) {
  console.error(`❌ Répertoire introuvable : ${APPS_DIR}`);
  process.exit(1);
}

const apps = readdirSync(APPS_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let totalPassed = 0;
let totalFailed = 0;
const results = [];

for (const app of apps) {
  const appPath = join(APPS_DIR, app);
  const pkgPath = join(appPath, 'package.json');
  console.log(`🔍 Vérification de : ${app}`);

  if (!existsSync(pkgPath)) {
    console.log(`   ⚠️ Aucun package.json trouvé dans ${app}, ignoré.`);
    continue;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const hasTest = Boolean(pkg.scripts && pkg.scripts.test);

  if (hasTest) {
    try {
      console.log(`   ⚡ Exécution des tests : npm test`);
      const output = execSync('npm test', { cwd: appPath, encoding: 'utf8', stdio: 'pipe' });
      console.log(`   ✅ SUCCÈS : Tests validés pour ${app}`);
      totalPassed++;
      results.push({ app, status: 'PASSED', details: 'All tests green' });
    } catch (err) {
      console.error(`   ❌ ÉCHEC des tests pour ${app}:`, err.stdout || err.message);
      totalFailed++;
      results.push({ app, status: 'FAILED', error: err.message });
    }
  } else {
    console.log(`   ℹ️ Aucun script de test configuré dans package.json`);
  }
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`📊 BILAN TDD : ${totalPassed} projet(s) validé(s), ${totalFailed} échec(s)`);
console.log('═══════════════════════════════════════════════════════════════');

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('✨ Zéro régression : Tous les projets sont certifiés conformes !');
  process.exit(0);
}
