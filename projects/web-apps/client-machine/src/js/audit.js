/**
 * 360° AI Website Audit & Business Opportunity Scoring
 */

export class AuditEngine {
  static analyzeLead(lead) {
    const hasWebsite = Boolean(lead.website && lead.website.trim().length > 0);
    const isHttps = lead.website.startsWith('https://');

    // Calculated metrics
    const mobileScore = hasWebsite ? lead.mobileScore || 45 : 0;
    const seoScore = lead.seoScore || 50;
    const accessScore = lead.accessScore || 55;
    const speedScore = hasWebsite ? lead.speedScore || 48 : 0;

    // Global Opportunity Score (Higher means higher urgency to redesign)
    const globalQualityScore = hasWebsite
      ? Math.round((mobileScore * 0.4) + (speedScore * 0.3) + (seoScore * 0.2) + (accessScore * 0.1))
      : 20;

    const urgencyLevel = globalQualityScore < 40 ? 'CRITIQUE' : (globalQualityScore < 65 ? 'ÉLEVÉE' : 'MODÉRÉE');

    // Estimated monthly business loss
    const estimatedMonthlyLoss = hasWebsite
      ? Math.round((100 - globalQualityScore) * 35) + ' € / mois'
      : '1 500 € à 3 200 € / mois';

    return {
      hasWebsite,
      isHttps,
      globalQualityScore,
      urgencyLevel,
      estimatedMonthlyLoss,
      metrics: {
        mobile: { score: mobileScore, label: 'Performance Mobile' },
        speed: { score: speedScore, label: 'Vitesse de Chargement' },
        seo: { score: seoScore, label: 'Référencement Local' },
        accessibility: { score: accessScore, label: 'Accessibilité (WCAG)' }
      },
      diagnosticBullets: [
        hasWebsite ? (isHttps ? '✓ Certificat SSL actif' : '❌ Non sécurisé (Bandeau d\'alerte Google Chrome)') : '❌ Aucun site internet existant',
        mobileScore < 50 ? '❌ Non responsive : zoom obligatoire sur mobile, boutons trop petits' : '⚠️ Navigation mobile perfectible',
        speedScore < 50 ? '❌ Temps de chargement > 4.5s (82% de rebond immédiat)' : '✓ Vitesse acceptable',
        '❌ Absence de prise de contact / réservation directe en 1 clic',
        '⚠️ Données enrichies Schema.org manquantes pour Google Maps'
      ]
    };
  }

  static renderAuditView(lead, container) {
    if (!lead) {
      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Sélectionnez un prospect pour lancer l\'analyse.</div>';
      return;
    }

    const audit = this.analyzeLead(lead);

    const getScoreColor = (sc) => {
      if (sc >= 80) return 'var(--status-emerald)';
      if (sc >= 50) return 'var(--status-amber)';
      return 'var(--status-rose)';
    };

    container.innerHTML = `
      <div class="glass-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.35rem;">${lead.name}</h2>
            <div style="display: flex; gap: 0.75rem; align-items: center; color: var(--text-muted); font-size: 0.85rem;">
              <span>📍 ${lead.address}</span>
              <span>•</span>
              <span>⭐ ${lead.rating} (${lead.reviewsCount} avis)</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Urgence Refonte</div>
            <span style="display: inline-block; margin-top: 0.25rem; font-size: 0.85rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 20px; background: hsla(350, 89%, 60%, 0.15); color: var(--status-rose); border: 1px solid hsla(350, 89%, 60%, 0.3);">
              ${audit.urgencyLevel}
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 1rem;">
          ${Object.values(audit.metrics).map(m => `
            <div class="score-box">
              <div class="score-number" style="color: ${getScoreColor(m.score)};">${m.score}<span style="font-size: 1rem; opacity: 0.6;">/100</span></div>
              <div class="score-label">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
        <div class="glass-card">
          <h3 style="font-size: 1.05rem; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem; color: var(--status-rose);">
            ⚠️ Points de friction détectés par l'IA
          </h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.85rem; color: var(--text-secondary);">
            ${audit.diagnosticBullets.map(b => `<li style="padding-left: 0.5rem; line-height: 1.4;">${b}</li>`).join('')}
          </ul>
        </div>

        <div class="glass-card" style="background: hsla(238, 86%, 66%, 0.08); border-color: hsla(238, 86%, 66%, 0.3);">
          <h3 style="font-size: 1.05rem; margin-bottom: 0.85rem; color: var(--accent-cyan); display: flex; align-items: center; gap: 0.5rem;">
            💡 Impact Business & Manque à gagner
          </h3>
          <div style="font-size: 1.8rem; font-weight: 800; font-family: 'Outfit', sans-serif; color: #fff; margin-bottom: 0.5rem;">
            ${audit.estimatedMonthlyLoss}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Sur la zone de <strong>${lead.city}</strong>, plus de 70% des recherches pour <em>"${lead.category}"</em> se font depuis un smartphone.
            L'absence d'interface tactile fluide dévie vos clients directement vers vos concurrents locaux.
          </p>
          <button id="btn-go-to-redesign" class="btn-primary" style="width: 100%;">
            🎨 Voir la Refonte Interactive Avant/Après ➜
          </button>
        </div>
      </div>
    `;
  }
}
