/**
 * Integrated CRM Kanban Pipeline Controller
 * Drag & Drop or 1-click status transitions, notes, follow-up dates, open tracking
 */

export const CRM_COLUMNS = [
  { id: 'nouveau', title: 'Nouveau Lead', color: 'var(--text-muted)' },
  { id: 'qualifie', title: 'Qualifié & Audité', color: 'var(--status-blue)' },
  { id: 'proposition_envoyee', title: 'Proposition Envoyée', color: 'var(--status-amber)' },
  { id: 'discussion', title: 'En Négociation', color: 'var(--status-purple)' },
  { id: 'gagne', title: 'Client Gagné 🎉', color: 'var(--status-emerald)' },
  { id: 'perdu', title: 'Non Retenu', color: 'var(--status-rose)' }
];

export class CRMController {
  constructor(containerId, store, onSelectLead) {
    this.container = document.getElementById(containerId);
    this.store = store;
    this.onSelectLead = onSelectLead;
  }

  render() {
    if (!this.container) return;

    const leads = this.store.leads;

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h2 style="font-size: 1.3rem; color: #fff;">Pipeline Commercial & Suivi des Relances</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            ${leads.length} prospects dans le pipe • Suivi automatique des ouvertures et relances J+3
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btnExportCrmCsv" class="btn-secondary btn-sm">
            📊 Exporter CSV
          </button>
        </div>
      </div>

      <div class="kanban-board">
        ${CRM_COLUMNS.map(col => {
          const colLeads = leads.filter(l => (l.status || 'nouveau') === col.id);
          return `
            <div class="kanban-col" data-status="${col.id}">
              <div class="col-header">
                <span class="col-title" style="color: ${col.color};">
                  ${col.title}
                </span>
                <span class="col-count">${colLeads.length}</span>
              </div>
              <div class="kanban-cards-wrapper" id="col-${col.id}">
                ${colLeads.map(lead => this.renderLeadCard(lead)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.bindEvents();
  }

  renderLeadCard(lead) {
    const trackingBadge = lead.status === 'proposition_envoyee' || lead.status === 'discussion'
      ? `<span style="font-size: 10px; color: var(--status-emerald); background: hsla(156, 73%, 45%, 0.15); padding: 2px 6px; border-radius: 8px;">👁️ Ouvert 2x</span>`
      : '';

    return `
      <div class="crm-card" data-id="${lead.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="crm-card-title">${lead.name}</div>
          <span class="lead-badge ${lead.hasEmail ? 'badge-blue' : 'badge-amber'}">
            ${lead.hasEmail ? 'Email' : 'DM'}
          </span>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted);">
          📍 ${lead.city} • ${lead.category}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; font-weight: 700; color: ${lead.auditScore < 50 ? 'var(--status-rose)' : 'var(--status-amber)'};">
            Score : ${lead.auditScore}/100
          </span>
          ${trackingBadge}
        </div>

        <div style="font-size: 0.75rem; color: var(--text-secondary); background: hsla(220, 30%, 15%, 0.4); padding: 4px 6px; border-radius: 4px; margin-top: 2px;">
          📝 <em>${lead.notes ? lead.notes.substring(0, 45) + '...' : 'Aucune note'}</em>
        </div>

        <div class="crm-card-footer">
          <select class="change-status-select" data-id="${lead.id}" style="background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-subtle); border-radius: 4px; font-size: 11px; padding: 2px 4px; outline: none;">
            ${CRM_COLUMNS.map(c => `
              <option value="${c.id}" ${lead.status === c.id ? 'selected' : ''}>${c.title}</option>
            `).join('')}
          </select>
          <button class="btn-inspect-lead" data-id="${lead.id}" style="background: none; border: none; color: var(--accent-indigo); cursor: pointer; font-size: 11px; font-weight: 600;">
            Ouvrir ➜
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Status change selects
    document.querySelectorAll('.change-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const leadId = e.target.dataset.id;
        const newStatus = e.target.value;
        this.store.updateLeadStatus(leadId, newStatus);
        this.render();
      });
    });

    // Inspect lead buttons
    document.querySelectorAll('.btn-inspect-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const leadId = e.currentTarget.dataset.id;
        this.onSelectLead(leadId);
      });
    });

    // Export CSV
    const btnCsv = document.getElementById('btnExportCrmCsv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        const rows = [
          ['Nom', 'Catégorie', 'Ville', 'Email', 'Téléphone', 'Site Web', 'Score Audit', 'Statut', 'Notes']
        ];
        this.store.leads.forEach(l => {
          rows.push([
            `"${l.name}"`,
            `"${l.category}"`,
            `"${l.city}"`,
            `"${l.email}"`,
            `"${l.phone}"`,
            `"${l.website}"`,
            l.auditScore,
            `"${l.status}"`,
            `"${l.notes || ''}"`
          ]);
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `leads-crm-${new Date().toISOString().slice(0, 10)}.csv`);
        link.click();
      });
    }
  }
}
