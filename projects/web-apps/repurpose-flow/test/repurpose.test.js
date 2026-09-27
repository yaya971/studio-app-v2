import test from 'node:test';
import assert from 'node:assert';
import { generateTenClips, generateAntiBlockConfig } from '../server.js';

test('RepurposeFlow - generateAntiBlockConfig should create active evasion filters', () => {
  const config = generateAntiBlockConfig({ mirrorFlip: true });
  assert.strictEqual(config.dynamicZoom, true);
  assert.strictEqual(config.mirrorFlip, true);
  assert.ok(config.pitchShift.includes('1.009'));
  assert.ok(config.colorLUT.includes('+4% sat'));
});

test('RepurposeFlow - generateTenClips must generate exactly 10 clips with hooks and hashtags', () => {
  const clips = generateTenClips("Podcast Masterclass", 900);
  assert.strictEqual(clips.length, 10);
  
  clips.forEach((clip, index) => {
    assert.strictEqual(clip.index, index + 1);
    assert.ok(clip.title.length > 5, "Le titre doit être captivant");
    assert.ok(clip.description.includes('#'), "La description doit contenir des hashtags");
    assert.ok(clip.hashtags.length >= 5, "Au moins 5 hashtags doivent être fournis");
    assert.ok(clip.hookScore >= 90, "Le score de rétention doit être >= 90%");
    assert.ok(clip.antiBlock, "La config anti-blocage doit être présente");
  });
});
