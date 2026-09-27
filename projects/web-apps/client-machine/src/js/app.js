/**
 * Main Application Orchestrator for Studio A Client Machine
 */

import { ProspectorStore } from './prospector.js';
import { MapController } from './map.js';
import { AuditEngine } from './audit.js';
import { RedesignEngine } from './redesign.js';
import { ProposalGenerator } from './proposals.js';
import { CRMController } from './crm.js';
import { SettingsManager } from './settings.js';

class ClientMachineApp {
  constructor() {
    this.store = new ProspectorStore();
    this.mapController = null;
    this.redesignEngine = null;
    this.crmController = null;
    this.activeTab = 'tab-map';
  }

  init() {
    this.initNavigation();
    this.initEngines();
    this.initSearchAndFilters();
    this.initSettings();
    this.updateStats();

    // Subscribe to store updates
    this.store.subscribe((filteredLeads) => {
      this.updateStats();
      this.renderLeadsList(filteredLeads);
      if (this.mapController) {
        this.mapController.renderMarkers(filteredLeads, this.store.selectedLeadId);
      }
    });

    // Initial render
    this.renderLeadsList(this.store.getFilteredLeads());
    this.renderSelectedLeadViews();
  }

  initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = tab.dataset.target;
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.target === tabId);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });

    // Handle view-specific triggers
    if (tabId === 'tab-map') {
      setTimeout(() => {
        if (this.mapController && this.mapController.map) {
          this.mapController.map.invalidateSize();
        }
      }, 100);
    } else if (tabId === 'tab-audit') {
      this.renderAuditView();
    } else if (tabId === 'tab-redesign') {
      this.renderRedesignView();
    } else if (tabId === 'tab-proposals') {
      this.renderProposalsView();
    } else if (tabId === 'tab-crm') {
      this.crmController.render();
    } else if (tabId === 'tab-settings') {
      this.renderSettingsView();
    }
  }

  initEngines() {
    // 1. Map
    this.mapController = new MapController('leafletMap', (leadId) => {
      this.store.setSelectedLead(leadId);
      this.switchTab('tab-audit');
    });

    this.mapController.renderMarkers(this.store.getFilteredLeads(), this.store.selectedLeadId);

    // 2. Redesign Engine
    this.redesignEngine = new RedesignEngine('redesignContainer');

    // 3. CRM Controller
    this.crmController = new CRMController('crmContainer', this.store, (leadId) => {
      this.store.setSelectedLead(leadId);
      this.switchTab('tab-audit');
    });
  }

  initSearchAndFilters() {
    // Search Form
    const searchForm = document.getElementById('searchProspectsForm');
    const searchStatus = document.getElementById('searchStatus');

    if (searchForm) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.getElementById('inputCity').value.trim();
        const commerce = document.getElementById('selectCommerce').value;

        if (!city) return;

        searchStatus.innerHTML = `🔍 Recherche en direct sur <strong>${city}</strong> (${commerce})...`;
        searchStatus.style.display = 'block';

        const newLeads = await this.store.searchOverpass(city, commerce);

        if (newLeads && newLeads.length > 0) {
          newLeads.forEach(l => this.store.addLead(l));
          searchStatus.innerHTML = `✅ <strong>${newLeads.length} nouveaux prospects qualifiés</strong> trouvés à ${city} !`;
          if (newLeads[0].lat && newLeads[0].lng) {
            this.mapController.map.flyTo([newLeads[0].lat, newLeads[0].lng], 13);
          }
        } else {
          searchStatus.innerHTML = `ℹ️ Aucun nouveau résultat trouvé pour cette zone.`;
        }

        setTimeout(() => { searchStatus.style.display = 'none'; }, 4000);
      });
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.store.setFilter(btn.dataset.filter);
      });
    });

    // Keyword Search
    const keywordInput = document.getElementById('inputKeyword');
    if (keywordInput) {
      keywordInput.addEventListener('input', (e) => {
        this.store.setSearchQuery(e.target.value);
      });
    }
  }

  updateStats() {
    const leads = this.store.leads;
    const totalLeads = leads.length;
    const emailLeads = leads.filter(l => l.hasEmail).length;
    const dmLeads = leads.filter(l => !l.hasEmail).length;
    const pipelineValue = leads.filter(l => l.status !== 'perdu').length * 1800;

    const elTotal = document.getElementById('statTotalLeads');
    const elEmail = document.getElementById('statEmailLeads');
    const elDm = document.getElementById('statDmLeads');
    const elPipe = document.getElementById('statPipelineVal');

    if (elTotal) elTotal.textContent = totalLeads;
    if (elEmail) elEmail.textContent = emailLeads;
    if (elDm) elDm.textContent = dmLeads;
    if (elPipe) elPipe.textContent = `${pipelineValue.toLocaleString('fr-FR')} €`;
  }

  renderLeadsList(leads) {
    const listContainer = document.getElementById('leadsListContainer');
    if (!listContainer) return;

    if (leads.length === 0) {
      listContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">Aucun prospect ne correspond aux critères.</div>';
      return;
    }

    listContainer.innerHTML = leads.map(lead => {
      const isSelected = lead.id === this.store.selectedLeadId;
      return `
        <div class="lead-item-card ${isSelected ? 'selected' : ''}" data-id="${lead.id}">
          <div class="lead-meta">
            <div class="lead-name">${lead.name}</div>
            <div class="lead-subtitle">
              <span>📍 ${lead.city}</span>
              <span>•</span>
              <span>⭐ ${lead.rating}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="lead-badge ${lead.hasEmail ? 'badge-blue' : 'badge-amber'}">
              ${lead.hasEmail ? '🔵 Email' : '🟡 DM'}
            </span>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 3px;">
              Score : <strong>${lead.auditScore}</strong>/100
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Click handler for items
    listContainer.querySelectorAll('.lead-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.store.setSelectedLead(id);
        const lead = this.store.getSelectedLead();
        if (lead) {
          this.mapController.panToLead(lead);
          this.renderSelectedLeadViews();
        }
      });
    });
  }

  renderSelectedLeadViews() {
    this.renderAuditView();
    this.renderRedesignView();
    this.renderProposalsView();
  }

  renderAuditView() {
    const auditContainer = document.getElementById('auditContentContainer');
    if (!auditContainer) return;

    const lead = this.store.getSelectedLead();
    AuditEngine.renderAuditView(lead, auditContainer);

    const btnGoRedesign = document.getElementById('btn-go-to-redesign');
    if (btnGoRedesign) {
      btnGoRedesign.addEventListener('click', () => {
        this.switchTab('tab-redesign');
      });
    }
  }

  renderRedesignView() {
    const lead = this.store.getSelectedLead();
    if (this.redesignEngine) {
      this.redesignEngine.setLead(lead);
    }
  }

  renderProposalsView() {
    const container = document.getElementById('proposalsContainer');
    if (!container) return;

    const lead = this.store.getSelectedLead();
    if (!lead) {
      container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Sélectionnez un prospect pour générer les propositions.</div>';
      return;
    }

    const profile = SettingsManager.getProfile();
    const data = ProposalGenerator.getAngles(lead, profile);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.3rem; color: #fff;">Propositions Commerciales & Messages de Prospection</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Prospect : <strong>${lead.name}</strong> • ${lead.hasEmail ? 'Canal : 🔵 Email' : 'Canal : 🟡 DM Réseaux Sociaux'}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btnMarkSent" class="btn-primary btn-sm">
            ✓ Marquer comme Envoyé
          </button>
        </div>
      </div>

      <!-- 3 Business Angles Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        ${data.angles.map((angle, idx) => `
          <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">
                ${angle.title}
              </div>
              <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 0.75rem;">
                ${angle.tagline}
              </div>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; background: var(--bg-surface); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle);">
                Objet : ${angle.subject}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); white-space: pre-wrap; line-height: 1.4; max-height: 180px; overflow-y: auto; background: var(--bg-surface); padding: 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle); font-family: monospace;">${angle.body}</div>
            </div>
            <button class="btn-secondary btn-sm btn-copy-proposal" data-text="${encodeURIComponent(angle.body + '\n' + data.legalFooter)}" style="margin-top: 0.75rem; width: 100%;">
              📋 Copier l'Email (+ Mentions RGPD)
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Social Media DM Kit -->
      <div class="glass-card" style="margin-bottom: 1.5rem; border-color: hsla(42, 98%, 52%, 0.3); background: hsla(42, 98%, 52%, 0.05);">
        <h3 style="font-size: 1.05rem; margin-bottom: 0.85rem; color: var(--status-amber); display: flex; align-items: center; gap: 0.5rem;">
          📱 Boîte à Outils DM : Instagram & Facebook (Envoi Manuel Conforme)
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Message Instagram Direct</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface); padding: 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle); line-height: 1.4; white-space: pre-wrap; font-family: monospace;">${data.instagramDm}</div>
            <button class="btn-secondary btn-sm btn-copy-proposal" data-text="${encodeURIComponent(data.instagramDm)}" style="margin-top: 0.5rem; width: 100%;">
              📸 Copier pour Instagram DM
            </button>
          </div>
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;">Message Facebook Messenger</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface); padding: 0.6rem; border-radius: 6px; border: 1px solid var(--border-subtle); line-height: 1.4; white-space: pre-wrap; font-family: monospace;">${data.facebookDm}</div>
            <button class="btn-secondary btn-sm btn-copy-proposal" data-text="${encodeURIComponent(data.facebookDm)}" style="margin-top: 0.5rem; width: 100%;">
              💬 Copier pour Facebook DM
            </button>
          </div>
        </div>
      </div>
    `;

    // Copy event bindings
    container.querySelectorAll('.btn-copy-proposal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = decodeURIComponent(e.currentTarget.dataset.text);
        navigator.clipboard.writeText(text);
        const originalText = e.currentTarget.textContent;
        e.currentTarget.textContent = '✅ Copié dans le presse-papier !';
        setTimeout(() => {
          e.currentTarget.textContent = originalText;
        }, 2000);
      });
    });

    // Mark as Sent button
    const btnMark = document.getElementById('btnMarkSent');
    if (btnMark) {
      btnMark.addEventListener('click', () => {
        this.store.updateLeadStatus(lead.id, 'proposition_envoyee');
        alert(`✓ Statut de "${lead.name}" passé à "Proposition Envoyée" dans le CRM !`);
        this.updateStats();
      });
    }
  }

  initSettings() {
    const profile = SettingsManager.getProfile();
    const vault = SettingsManager.getApiVault();

    // Populate inputs if present
    const fill = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    fill('settingAgencyName', profile.name);
    fill('settingFounder', profile.founder);
    fill('settingSpecialty', profile.specialty);
    fill('settingAvgPrice', profile.averagePrice);
    fill('settingCalendly', profile.calendly);
    fill('settingBudgetLead', profile.budgetPerLead);

    fill('vaultGeminiKey', vault.geminiKey);
    fill('vaultApifyKey', vault.apifyKey);
    fill('vaultVercelToken', vault.vercelToken);
    fill('vaultResendKey', vault.resendKey);

    // Save profile form
    const formProfile = document.getElementById('formAgencyProfile');
    if (formProfile) {
      formProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        SettingsManager.saveProfile({
          name: document.getElementById('settingAgencyName').value,
          founder: document.getElementById('settingFounder').value,
          specialty: document.getElementById('settingSpecialty').value,
          averagePrice: document.getElementById('settingAvgPrice').value,
          calendly: document.getElementById('settingCalendly').value,
          budgetPerLead: document.getElementById('settingBudgetLead').value
        });
        alert('✅ Profil d\'agence enregistré avec succès !');
      });
    }

    // Save vault form
    const formVault = document.getElementById('formApiVault');
    if (formVault) {
      formVault.addEventListener('submit', (e) => {
        e.preventDefault();
        SettingsManager.saveApiVault({
          geminiKey: document.getElementById('vaultGeminiKey').value,
          apifyKey: document.getElementById('vaultApifyKey').value,
          vercelToken: document.getElementById('vaultVercelToken').value,
          resendKey: document.getElementById('vaultResendKey').value
        });
        alert('🔒 Clés API enregistrées dans le coffre-fort local sécurisé !');
      });
    }

    // Export all data
    const btnExport = document.getElementById('btnExportBackup');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        SettingsManager.exportAllData(this.store.leads);
      });
    }

    // Import data
    const inputImport = document.getElementById('inputImportBackup');
    if (inputImport) {
      inputImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const success = SettingsManager.importData(event.target.result, this.store);
          if (success) {
            alert('✅ Données et prospects restaurés avec succès !');
            this.updateStats();
            this.renderLeadsList(this.store.getFilteredLeads());
          } else {
            alert('❌ Erreur lors de la lecture du fichier JSON.');
          }
        };
        reader.readAsText(file);
      });
    }
  }

  renderSettingsView() {
    // Refresh inputs
    this.initSettings();
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ClientMachineApp();
  window.app.init();
});
