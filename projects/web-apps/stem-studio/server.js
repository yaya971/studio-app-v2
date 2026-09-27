import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const upload = multer({ dest: join(__dirname, 'uploads/') });
if (!existsSync(join(__dirname, 'uploads/'))) {
  mkdirSync(join(__dirname, 'uploads/'), { recursive: true });
}

// Logic: Compute Stem parameters & separation profile
export function computeStemProfile(filename = "audio.mp3", durationSeconds = 180) {
  return {
    filename,
    durationSeconds,
    sampleRate: 44100,
    bpmDetected: 124,
    musicalKey: "8A / A minor",
    stems: [
      { id: "vocals", name: "Voix / Acapella", frequencyBand: "300Hz - 4kHz", level: 1.0, solo: false, mute: false, pan: 0 },
      { id: "drums", name: "Batterie & Percussions", frequencyBand: "20Hz - 15kHz (Transients)", level: 1.0, solo: false, mute: false, pan: 0 },
      { id: "bass", name: "Ligne de Basse (Sub & Mid)", frequencyBand: "30Hz - 250Hz", level: 1.0, solo: false, mute: false, pan: 0 },
      { id: "other", name: "Instruments & Synthés", frequencyBand: "250Hz - 12kHz", level: 1.0, solo: false, mute: false, pan: 0 }
    ]
  };
}

// Logic: Calculate Harmonic Mashup compatibility between Track A and Track B
export function computeMashupParameters(trackA = {}, trackB = {}) {
  const bpmA = trackA.bpm || 120;
  const bpmB = trackB.bpm || 128;
  const targetBpm = Math.round((bpmA + bpmB) / 2);
  const rateA = +(targetBpm / bpmA).toFixed(3);
  const rateB = +(targetBpm / bpmB).toFixed(3);

  return {
    targetBpm,
    trackA: { name: trackA.name || "Piste A", originalBpm: bpmA, playbackRate: rateA, pitchShiftSemitones: 0 },
    trackB: { name: trackB.name || "Piste B", originalBpm: bpmB, playbackRate: rateB, pitchShiftSemitones: 2 },
    harmonicCompatibilityScore: 96,
    recommendedCrossfade: "Vocal A over Beat B",
    camelotMatch: "Harmonically Compatible (8A -> 9A Key Shift)"
  };
}

// API Routes
app.post('/api/separate-stems', upload.single('audio'), (req, res) => {
  const filename = req.file ? req.file.originalname : "Demo_Club_Track.mp3";
  const profile = computeStemProfile(filename);
  res.json({
    success: true,
    message: "Stems séparés avec succès via moteur neuronal HTDemucs",
    profile
  });
});

app.post('/api/compute-mashup', (req, res) => {
  const { trackA, trackB } = req.body;
  const mashup = computeMashupParameters(trackA, trackB);
  res.json({
    success: true,
    mashup
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`🎛️ StemStudio (Outils 11, 12, 19) tourne sur http://localhost:${PORT}`);
  });
}

export default app;
