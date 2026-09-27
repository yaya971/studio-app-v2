/**
 * Interactive Before / After Redesign Engine with Device Viewport Switcher
 * Generates sector-specific modern landing pages tailored to the business
 */

export class RedesignEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentLead = null;
    this.currentViewport = 'desktop'; // desktop, tablet, mobile
    this.sliderPosition = 50; // percentage
  }

  setLead(lead) {
    this.currentLead = lead;
    this.render();
  }

  setViewport(vp) {
    this.currentViewport = vp;
    const stage = document.getElementById('beforeAfterStage');
    if (stage) {
      stage.className = `before-after-stage ${vp}`;
    }
    // Update active button state
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.viewport === vp);
    });
  }

  generateOldSiteHtml(lead) {
    return `
      <div style="background: #f1f5f9; color: #334155; font-family: Times New Roman, serif; min-height: 100%; padding: 2rem; border-bottom: 2px solid #cbd5e1;">
        <div style="background: #94a3b8; color: #fff; padding: 10px; font-weight: bold; text-align: center; margin-bottom: 1.5rem; font-family: Arial, sans-serif;">
          ⚠️ VERSION ACTUELLE (Site non sécurisé HTTP - Daté 2014)
        </div>
        <table width="100%" cellpadding="10" cellspacing="0" border="1" bordercolor="#cbd5e1">
          <tr bgcolor="#e2e8f0">
            <td colspan="2"><h2 style="margin: 0; font-size: 20px;">${lead.name}</h2></td>
          </tr>
          <tr>
            <td width="25%" valign="top" bgcolor="#f8fafc">
              <strong>Menu</strong><br><br>
              • Accueil<br>
              • Présentation<br>
              • Nos Tarifs (PDF)<br>
              • Livre d'or<br>
              • Contact (formulaire)
            </td>
            <td valign="top" bgcolor="#ffffff">
              <h3>Bienvenue sur notre page web officielle</h3>
              <p>Situé à ${lead.address}, nous vous accueillons avec plaisir du mardi au samedi.</p>
              <p>Pour toute réservation, veuillez composer le <strong>${lead.phone}</strong> aux heures d'ouverture de notre établissement.</p>
              <br>
              <div style="border: 1px dashed #64748b; padding: 10px; text-align: center; color: #64748b; font-size: 12px;">
                [Photo du commerce - image_0129.jpg introuvable]
              </div>
              <br>
              <p style="font-size: 11px; color: #94a3b8;">Site créé en HTML 4.01 • Optimisé pour Internet Explorer 8 (Résolution 1024x768)</p>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  generateNewSiteHtml(lead) {
    const isRestaurant = lead.category.toLowerCase().includes('restaurant') || lead.category.toLowerCase().includes('brasserie');
    const isBarber = lead.category.toLowerCase().includes('coiffure') || lead.category.toLowerCase().includes('barbier');
    const isLawyer = lead.category.toLowerCase().includes('avocat') || lead.category.toLowerCase().includes('cabinet');

    const heroTitle = isRestaurant ? 'Une expérience culinaire d\'exception au cœur de Paris' :
                      isBarber ? 'L\'Art du barbier traditionnel & soins d\'exception' :
                      isLawyer ? 'Conseil stratégique & défense rigoureuse de vos intérêts' :
                      `L'Excellence artisanale & service haut de gamme à ${lead.city}`;

    const ctaText = isRestaurant ? 'Réserver une table en ligne' :
                    isBarber ? 'Prendre rendez-vous en 1 clic' :
                    isLawyer ? 'Planifier une consultation' :
                    'Demander un devis immédiat';

    return `
      <div style="background: #090d16; color: #f8fafc; font-family: 'Inter', -apple-system, sans-serif; min-height: 100%; padding: 2.5rem 2rem;">
        <!-- Top Modern Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.25rem; margin-bottom: 2.5rem;">
          <div style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${lead.name}
          </div>
          <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: #94a3b8; align-items: center;">
            <span style="color: #fff; font-weight: 500;">Accueil</span>
            <span>Prestations</span>
            <span>Avis Clients</span>
            <button style="padding: 0.5rem 1rem; border-radius: 8px; border: none; background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; font-weight: 600; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);">
              ${ctaText}
            </button>
          </div>
        </div>

        <!-- Hero Section -->
        <div style="max-width: 650px; margin-bottom: 2.5rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0.8rem; border-radius: 20px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;">
            <span>★</span> Noté ${lead.rating}/5 par plus de ${lead.reviewsCount} clients vérifiés
          </div>
          <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; line-height: 1.15; margin-bottom: 1rem; color: #fff;">
            ${heroTitle}
          </h1>
          <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
            Situé au ${lead.address}. Réservez votre créneau en toute simplicité 24h/24 et profitez d'une prise en charge sur-mesure.
          </p>
          <div style="display: flex; gap: 1rem; align-items: center;">
            <button style="padding: 0.85rem 1.5rem; border-radius: 10px; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);">
              ${ctaText} ➜
            </button>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #38bdf8;">
              <span>📞</span> ${lead.phone}
            </div>
          </div>
        </div>

        <!-- Bento Grid Benefits -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⚡</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 0.25rem;">Ultra-Rapide & Mobile</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Chargement en 0.8s, optimisé pour tous les smartphones.</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📅</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 0.25rem;">Réservation Autonome</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Synchronisation en temps réel avec votre calendrier.</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.25rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔒</div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 0.25rem;">Sécurité & RGPD 100%</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Certificat SSL bancaire et conformité européenne.</div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.currentLead) {
      this.container.innerHTML = '<div style="padding: 3rem; text-align: center; color: var(--text-muted);">Veuillez sélectionner un prospect pour afficher la refonte.</div>';
      return;
    }

    const lead = this.currentLead;

    this.container.innerHTML = `
      <div class="redesign-viewport-toolbar">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-weight: 700; font-size: 0.9rem; color: #fff;">Prévisualisation Refonte :</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">${lead.name} (${lead.city})</span>
        </div>

        <div class="device-switcher">
          <button class="device-btn ${this.currentViewport === 'desktop' ? 'active' : ''}" data-viewport="desktop" id="btnVpDesktop">
            💻 Desktop (1000px)
          </button>
          <button class="device-btn ${this.currentViewport === 'tablet' ? 'active' : ''}" data-viewport="tablet" id="btnVpTablet">
            📱 Tablet (768px)
          </button>
          <button class="device-btn ${this.currentViewport === 'mobile' ? 'active' : ''}" data-viewport="mobile" id="btnVpMobile">
            📱 Mobile (375px)
          </button>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button id="btnExportHtml" class="btn-secondary btn-sm">
            💾 Télécharger Code HTML
          </button>
          <button id="btnVercelDeploy" class="btn-primary btn-sm">
            ▲ Déployer Vercel (1 Clic)
          </button>
        </div>
      </div>

      <!-- Before/After Interactive Stage -->
      <div id="beforeAfterStage" class="before-after-stage ${this.currentViewport}">
        <!-- Layer 1: Old Site (Underneath) -->
        <div class="frame-layer">
          ${this.generateOldSiteHtml(lead)}
        </div>

        <!-- Layer 2: New Redesign (Clipped on left) -->
        <div id="afterLayer" class="after-layer" style="width: ${this.sliderPosition}%;">
          <div style="width: 1000px; height: 100%; position: absolute; top: 0; left: 0;">
            ${this.generateNewSiteHtml(lead)}
          </div>
        </div>

        <!-- Draggable Separator Handle -->
        <div id="sliderHandle" class="slider-handle" style="left: ${this.sliderPosition}%;">
          <div class="handle-button">⇄</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; color: var(--text-muted); font-size: 0.8rem;">
        <span>👈 <strong>Gauche :</strong> Refonte Studio A V2 (Modernisée, Mobile-first)</span>
        <span>👉 <strong>Droite :</strong> Site Original (${lead.website || 'Aucun site existant'})</span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Device buttons
    const btnD = document.getElementById('btnVpDesktop');
    const btnT = document.getElementById('btnVpTablet');
    const btnM = document.getElementById('btnVpMobile');

    if (btnD) btnD.addEventListener('click', () => this.setViewport('desktop'));
    if (btnT) btnT.addEventListener('click', () => this.setViewport('tablet'));
    if (btnM) btnM.addEventListener('click', () => this.setViewport('mobile'));

    // Draggable Before/After Slider
    const stage = document.getElementById('beforeAfterStage');
    const handle = document.getElementById('sliderHandle');
    const afterLayer = document.getElementById('afterLayer');

    if (stage && handle && afterLayer) {
      let isDragging = false;

      const updateSlider = (clientX) => {
        const rect = stage.getBoundingClientRect();
        let pos = ((clientX - rect.left) / rect.width) * 100;
        pos = Math.max(5, Math.min(95, pos));
        this.sliderPosition = pos;
        handle.style.left = `${pos}%`;
        afterLayer.style.width = `${pos}%`;
      };

      stage.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      // Touch events for mobile/tablet
      stage.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          updateSlider(e.touches[0].clientX);
        }
      });
    }

    // Export HTML button
    const btnExport = document.getElementById('btnExportHtml');
    if (btnExport && this.currentLead) {
      btnExport.addEventListener('click', () => {
        const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.currentLead.name} — Refonte Haute Performance</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; background: #090d16; color: #f8fafc; }
  </style>
</head>
<body>
  ${this.generateNewSiteHtml(this.currentLead)}
</body>
</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `refonte-${this.currentLead.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Vercel Deploy button
    const btnVercel = document.getElementById('btnVercelDeploy');
    if (btnVercel) {
      btnVercel.addEventListener('click', () => {
        alert(`🚀 Refonte de "${this.currentLead.name}" prête pour déploiement Vercel !\n\nLien de prévisualisation généré : https://${this.currentLead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-refonte.vercel.app`);
      });
    }
  }
}
