/**
 * Leaflet Dark Map Controller with Custom Status Markers
 * 🔵 Bleu : Email disponible (Prospection auto possible)
 * 🟡 Jaune : Contact par DM (Réseaux sociaux)
 * 🔴 Rose : Sans site web / Score critique
 */

export class MapController {
  constructor(mapContainerId, onLeadSelect) {
    this.mapContainerId = mapContainerId;
    this.onLeadSelect = onLeadSelect;
    this.map = null;
    this.markersGroup = null;
    this.initMap();
  }

  initMap() {
    if (!window.L) {
      console.error('Leaflet non chargé');
      return;
    }

    // Default center on France
    this.map = window.L.map(this.mapContainerId, {
      zoomControl: false,
      attributionControl: false
    }).setView([46.603354, 1.888334], 6);

    // Zoom controls top right
    window.L.control.zoom({ position: 'topright' }).addTo(this.map);

    // CartoDB Dark Matter Tiles (High-end sleek dark aesthetics)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.markersGroup = window.L.layerGroup().addTo(this.map);
  }

  createCustomIcon(lead) {
    let color = '#3b82f6'; // Blue
    let haloClass = 'pulse-blue';

    if (!lead.hasEmail) {
      color = '#f59e0b'; // Amber
      haloClass = 'pulse-amber';
    } else if (lead.auditScore < 35 || !lead.website) {
      color = '#f43f5e'; // Rose
      haloClass = 'pulse-rose';
    }

    const svgHtml = `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 14px ${color}; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 11px; color: #fff;">${lead.hasEmail ? '✉' : '★'}</span>
        </div>
      </div>
    `;

    return window.L.divIcon({
      html: svgHtml,
      className: 'custom-map-marker',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18]
    });
  }

  renderMarkers(leads, selectedLeadId) {
    if (!this.map || !this.markersGroup) return;

    this.markersGroup.clearLayers();

    const bounds = [];

    leads.forEach(lead => {
      if (!lead.lat || !lead.lng) return;

      const icon = this.createCustomIcon(lead);
      const marker = window.L.marker([lead.lat, lead.lng], { icon });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; color: #f8fafc; padding: 4px; max-width: 240px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 3px; font-family: 'Outfit', sans-serif;">${lead.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">${lead.category} • ${lead.city}</div>
          
          <div style="display: flex; gap: 4px; margin-bottom: 8px;">
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 600; background: ${lead.hasEmail ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${lead.hasEmail ? '#60a5fa' : '#fbbf24'}; border: 1px solid ${lead.hasEmail ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'};">
              ${lead.hasEmail ? '🔵 Email disponible' : '🟡 Contact DM'}
            </span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 600; background: rgba(255,255,255,0.1); color: #cbd5e1;">
              Score: ${lead.auditScore}/100
            </span>
          </div>

          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px; line-height: 1.3;">
            ⚠️ <em>${lead.painPoints[0] || 'Refonte recommandée'}</em>
          </div>

          <button id="btn-select-${lead.id}" style="width: 100%; padding: 6px 10px; border-radius: 6px; border: none; background: linear-gradient(135deg, hsl(238, 86%, 66%), hsl(280, 84%, 62%)); color: #fff; font-weight: 600; font-size: 11px; cursor: pointer;">
            ⚡ Analyser & Refondre
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'dark-popup'
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${lead.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            this.onLeadSelect(lead.id);
          });
        }
      });

      this.markersGroup.addLayer(marker);
      bounds.push([lead.lat, lead.lng]);
    });

    if (bounds.length > 0 && this.map) {
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }

  panToLead(lead) {
    if (!this.map || !lead.lat || !lead.lng) return;
    this.map.flyTo([lead.lat, lead.lng], 15, { duration: 1.2 });
  }
}
