import test from 'node:test';
import assert from 'node:assert';
import { computeStemProfile, computeMashupParameters } from '../server.js';

test('StemStudio - computeStemProfile returns 4 dedicated neural stems', () => {
  const profile = computeStemProfile('test_song.wav', 210);
  assert.strictEqual(profile.filename, 'test_song.wav');
  assert.strictEqual(profile.stems.length, 4);
  const ids = profile.stems.map(s => s.id);
  assert.deepStrictEqual(ids, ['vocals', 'drums', 'bass', 'other']);
});

test('StemStudio - computeMashupParameters aligns BPM and calculates harmonic key shift', () => {
  const mashup = computeMashupParameters({ name: "Summer Hits", bpm: 120 }, { name: "Techno Groove", bpm: 130 });
  assert.strictEqual(mashup.targetBpm, 125);
  assert.ok(mashup.trackA.playbackRate > 1.0, "Track A must speed up to 125 BPM");
  assert.ok(mashup.trackB.playbackRate < 1.0, "Track B must slow down to 125 BPM");
  assert.strictEqual(mashup.harmonicCompatibilityScore, 96);
});
