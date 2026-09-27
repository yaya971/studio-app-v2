document.addEventListener('DOMContentLoaded', () => {
  const btnProcess = document.getElementById('btnProcess');
  const youtubeUrlInput = document.getElementById('youtubeUrl');
  const resultsSection = document.getElementById('resultsSection');
  const clipsList = document.getElementById('clipsList');
  const videoMetaSummary = document.getElementById('videoMetaSummary');
  const previewThumb = document.getElementById('previewThumb');
  const videoBlurBg = document.getElementById('videoBlurBg');
  const liveTiktokCaption = document.getElementById('liveTiktokCaption');
  const karaokeSubText = document.getElementById('karaokeSubText');
  const ffmpegCommandCode = document.getElementById('ffmpegCommand');
  const btnCopyFFmpeg = document.getElementById('btnCopyFFmpeg');
  const btnDownloadAll = document.getElementById('btnDownloadAll');
  const toast = document.getElementById('toast');

  let currentClips = [];

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
  }

  btnCopyFFmpeg.addEventListener('click', () => {
    navigator.clipboard.writeText(ffmpegCommandCode.textContent);
    showToast("📋 Commande FFmpeg anti-blocage copiée !");
  });

  btnDownloadAll.addEventListener('click', () => {
    showToast("📦 Préparation du pack de 10 vidéos (Format 9:16 + Filtres)...");
  });

  // Process Video
  async function processVideo() {
    const url = youtubeUrlInput.value.trim();
    if (!url) return;

    btnProcess.disabled = true;
    btnProcess.querySelector('.btn-text').textContent = "Analyse IA & Découpe...";
    
    try {
      const antiBlockSettings = {
        pitchShift: document.getElementById('chkAudioPitch').checked,
        dynamicZoom: document.getElementById('chkDynamicZoom').checked,
        microGrain: document.getElementById('chkMicroGrain').checked,
        safeBorders: document.getElementById('chkSafeBorders').checked,
      };

      const res = await fetch('/api/process-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, antiBlockSettings })
      });

      const data = await res.json();
      if (!data.success) {
        showToast("Erreur lors de l'analyse");
        return;
      }

      currentClips = data.clips;
      videoMetaSummary.textContent = `${data.originalVideo.title} • Durée : ${data.originalVideo.formattedDuration} • Par : ${data.originalVideo.author}`;
      
      // Update Preview with first clip
      updatePreview(currentClips[0], data.originalVideo.thumbnail);
      renderClipsList(currentClips, data.originalVideo.thumbnail);
      resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      showToast("Erreur réseau");
    } finally {
      btnProcess.disabled = false;
      btnProcess.querySelector('.btn-text').textContent = "Générer les 10 Clips";
    }
  }

  function updatePreview(clip, thumbUrl) {
    if (thumbUrl) {
      previewThumb.src = thumbUrl;
      videoBlurBg.style.backgroundImage = `url('${thumbUrl}')`;
    }
    liveTiktokCaption.textContent = clip.description.slice(0, 110) + '...';
    karaokeSubText.textContent = clip.subtitleHook;

    ffmpegCommandCode.textContent = `ffmpeg -ss ${clip.startTime} -t ${clip.durationSeconds} -i "input.mp4" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,boxblur=20:20[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,eq=saturation=1.04" -af "atempo=1.009" "${clip.id}.mp4"`;
  }

  function renderClipsList(clips, thumbUrl) {
    clipsList.innerHTML = '';
    clips.forEach((clip, index) => {
      const card = document.createElement('div');
      card.className = `clip-card ${index === 0 ? 'active-preview' : ''}`;
      card.innerHTML = `
        <img class="clip-thumb" src="${thumbUrl}" alt="Clip Thumb">
        <div class="clip-info">
          <h3>${clip.title}</h3>
          <div class="clip-meta-row">
            <span class="hook-score">🎯 Hook Score ${clip.hookScore}%</span>
            <span>⏱️ ${clip.startTime} - ${clip.endTime} (${clip.durationSeconds}s)</span>
            <span>🛡️ Anti-pHash actif</span>
          </div>
          <div class="clip-tags">${clip.hashtags.join(' ')}</div>
        </div>
        <div class="clip-actions">
          <button class="btn btn-primary btn-xs btn-copy-post">Copier Post</button>
          <button class="btn btn-secondary btn-xs btn-preview">Aperçu 9:16</button>
        </div>
      `;

      card.querySelector('.btn-copy-post').addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(clip.description);
        showToast(`✅ Description & hashtags copiés pour la Partie ${clip.index} !`);
      });

      card.querySelector('.btn-preview').addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.clip-card').forEach(c => c.classList.remove('active-preview'));
        card.classList.add('active-preview');
        updatePreview(clip, thumbUrl);
      });

      card.addEventListener('click', () => {
        document.querySelectorAll('.clip-card').forEach(c => c.classList.remove('active-preview'));
        card.classList.add('active-preview');
        updatePreview(clip, thumbUrl);
      });

      clipsList.appendChild(card);
    });
  }

  btnProcess.addEventListener('click', processVideo);
  
  // Auto-run with default demo link so user sees immediate results
  processVideo();
});
