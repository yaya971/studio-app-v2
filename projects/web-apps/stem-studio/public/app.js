document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Web Audio Synth & Stems Engine
  let audioCtx = null;
  let isPlaying = false;
  let stemNodes = {};
  let masterGain = null;
  let analyser = null;
  let animFrameId = null;

  function initAudioEngine() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Create 4 distinct stem sound generators for live preview:
    // 1. Vocals (Formant-like bandpass)
    const vocalOsc = audioCtx.createOscillator();
    vocalOsc.type = 'sawtooth';
    vocalOsc.frequency.value = 220; // A3
    const vocalFilter = audioCtx.createBiquadFilter();
    vocalFilter.type = 'bandpass';
    vocalFilter.frequency.value = 1000;
    vocalFilter.Q.value = 4;
    const vocalGain = audioCtx.createGain();
    vocalGain.gain.value = 0.5;
    vocalOsc.connect(vocalFilter).connect(vocalGain).connect(masterGain);
    vocalOsc.start();

    // 2. Drums (Periodic Kick/Hi-Hat pulses via LFO & noise)
    const drumOsc = audioCtx.createOscillator();
    drumOsc.type = 'sine';
    drumOsc.frequency.value = 60; // Kick
    const drumGain = audioCtx.createGain();
    drumGain.gain.value = 0.7;
    drumOsc.connect(drumGain).connect(masterGain);
    drumOsc.start();

    // 3. Bass (Sub-Bass wave)
    const bassOsc = audioCtx.createOscillator();
    bassOsc.type = 'triangle';
    bassOsc.frequency.value = 110; // A2
    const bassGain = audioCtx.createGain();
    bassGain.gain.value = 0.6;
    bassOsc.connect(bassGain).connect(masterGain);
    bassOsc.start();

    // 4. Other/Synth (Arpeggio style)
    const synthOsc = audioCtx.createOscillator();
    synthOsc.type = 'square';
    synthOsc.frequency.value = 440; // A4
    const synthGain = audioCtx.createGain();
    synthGain.gain.value = 0.3;
    synthOsc.connect(synthGain).connect(masterGain);
    synthOsc.start();

    stemNodes = {
      vocals: { gain: vocalGain, baseGain: 0.5, isMute: false, isSolo: false },
      drums: { gain: drumGain, baseGain: 0.7, isMute: false, isSolo: false },
      bass: { gain: bassGain, baseGain: 0.6, isMute: false, isSolo: false },
      other: { gain: synthGain, baseGain: 0.3, isMute: false, isSolo: false },
    };

    // Initially muted until Play is pressed
    masterGain.gain.value = 0;
  }

  // Visualizer loop
  const canvas = document.getElementById('masterSpectrumCanvas');
  const ctx = canvas.getContext('2d');

  function renderVisualizer() {
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#0a0d17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(1, '#a855f7');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }

    if (isPlaying) {
      animFrameId = requestAnimationFrame(renderVisualizer);
    }
  }

  // Master Play/Pause
  const btnMasterPlay = document.getElementById('btnMasterPlay');
  btnMasterPlay.addEventListener('click', () => {
    initAudioEngine();
    if (!isPlaying) {
      audioCtx.resume();
      masterGain.gain.setTargetAtTime(0.8, audioCtx.currentTime, 0.05);
      isPlaying = true;
      btnMasterPlay.textContent = "⏸ Pause";
      btnMasterPlay.style.background = "#e11d48";
      btnMasterPlay.style.color = "#fff";
      renderVisualizer();
      showToast("▶ Lecture des 4 stems en direct");
    } else {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      isPlaying = false;
      btnMasterPlay.textContent = "▶ Lancer l'écoute";
      btnMasterPlay.style.background = "var(--green-accent)";
      btnMasterPlay.style.color = "#000";
      cancelAnimationFrame(animFrameId);
    }
  });

  // Faders & Mute / Solo handling
  const stems = ['Vocals', 'Drums', 'Bass', 'Other'];
  stems.forEach(stem => {
    const key = stem.toLowerCase();
    const fader = document.getElementById(`fader${stem}`);
    const muteBtn = document.getElementById(`mute${stem}`);
    const soloBtn = document.getElementById(`solo${stem}`);
    const dbReadout = document.getElementById(`db${stem}`);

    fader.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const db = val === 0 ? '-inf' : (20 * Math.log10(val)).toFixed(1);
      dbReadout.textContent = `${db} dB`;
      if (stemNodes[key]) {
        stemNodes[key].baseGain = val * 0.5;
        applyMixLogic();
      }
    });

    muteBtn.addEventListener('click', () => {
      initAudioEngine();
      stemNodes[key].isMute = !stemNodes[key].isMute;
      muteBtn.classList.toggle('active', stemNodes[key].isMute);
      applyMixLogic();
    });

    soloBtn.addEventListener('click', () => {
      initAudioEngine();
      stemNodes[key].isSolo = !stemNodes[key].isSolo;
      soloBtn.classList.toggle('active', stemNodes[key].isSolo);
      applyMixLogic();
    });
  });

  function applyMixLogic() {
    const anySolo = Object.values(stemNodes).some(s => s.isSolo);
    Object.keys(stemNodes).forEach(k => {
      const s = stemNodes[k];
      let active = true;
      if (s.isMute) active = false;
      if (anySolo && !s.isSolo) active = false;

      const targetGain = active ? s.baseGain : 0;
      s.gain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.03);
    });
  }

  // Load Demo / File handling
  document.getElementById('btnLoadDemoTrack').addEventListener('click', () => {
    showToast("Morceau démo chargé : Synthwave Club Mix (124 BPM)");
  });

  document.getElementById('btnBrowseAudio').addEventListener('click', () => {
    document.getElementById('audioFileInput').click();
  });

  document.getElementById('audioFileInput').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      document.getElementById('stemTrackTitle').textContent = file.name;
      showToast(`Fichier chargé : ${file.name}`);
    }
  });

  document.getElementById('btnExportStems').addEventListener('click', () => {
    showToast("Export de 4 pistes WAV 24-bit en cours...");
  });

  // Tab 2: Vocal Isolator
  document.getElementById('btnPreviewAcapella').addEventListener('click', () => {
    initAudioEngine();
    // Mute all except vocals
    stems.forEach(s => {
      const k = s.toLowerCase();
      stemNodes[k].isSolo = (k === 'vocals');
      document.getElementById(`solo${s}`).classList.toggle('active', k === 'vocals');
    });
    applyMixLogic();
    if (!isPlaying) btnMasterPlay.click();
    showToast("🎤 Mode Acapella Pure activé !");
  });

  document.getElementById('btnPreviewInstru').addEventListener('click', () => {
    initAudioEngine();
    // Mute vocals only
    stems.forEach(s => {
      const k = s.toLowerCase();
      stemNodes[k].isSolo = false;
      stemNodes[k].isMute = (k === 'vocals');
      document.getElementById(`mute${s}`).classList.toggle('active', k === 'vocals');
      document.getElementById(`solo${s}`).classList.remove('active');
    });
    applyMixLogic();
    if (!isPlaying) btnMasterPlay.click();
    showToast("🎹 Mode Karaoké / Instrumental activé !");
  });

  document.getElementById('btnExportAcapella').addEventListener('click', () => {
    showToast("Export du fichier Acapella_Clean.wav...");
  });

  document.getElementById('btnExportInstru').addEventListener('click', () => {
    showToast("Export du fichier Instrumental_Master.wav...");
  });

  // Tab 3: Mashup DJ
  const crossfader = document.getElementById('crossfaderSlider');
  crossfader.addEventListener('input', (e) => {
    const ratio = e.target.value / 100;
    // Crossfade between Vocals (A) and Beat (B)
    if (stemNodes.vocals && stemNodes.drums) {
      stemNodes.vocals.gain.gain.value = (1 - ratio) * 0.8;
      stemNodes.drums.gain.gain.value = ratio * 0.8;
      stemNodes.bass.gain.gain.value = ratio * 0.7;
    }
  });

  document.getElementById('btnPlayMashup').addEventListener('click', () => {
    initAudioEngine();
    // Enable vocal from A and drums/bass from B
    stemNodes.vocals.isMute = false;
    stemNodes.drums.isMute = false;
    stemNodes.bass.isMute = false;
    stemNodes.other.isMute = true;
    applyMixLogic();
    if (!isPlaying) btnMasterPlay.click();
    showToast("🎧 Mashup en cours : Voix A + Beat B !");
  });

  document.getElementById('btnAutoSyncBpm').addEventListener('click', () => {
    showToast("⚡ Beat-Matching automatique calé à 124 BPM !");
  });

  document.getElementById('btnExportMashup').addEventListener('click', () => {
    showToast("Export du Mashup Remix final en WAV 24-bit !");
  });
});
