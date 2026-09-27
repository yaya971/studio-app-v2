/**
 * Agency Profile & Encrypted API Keys Vault
 * Configures the qualification logic, proposal copy, and external API providers
 */

const SETTINGS_KEY = 'studio_a_client_machine_profile_v2';
const API_VAULT_KEY = 'studio_a_client_machine_vault_v2';

export class SettingsManager {
  static getProfile() {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erreur lecture profile:', e);
    }
    return {
      name: 'Studio A Digital',
      founder: 'Alexandre M.',
      specialty: 'Refonte de sites & Acquisition locale pour commerçants et PME',
      averagePrice: '1 800 €',
      calendly: 'https://calendly.com/studio-a-demo/refonte',
      budgetPerLead: '2.00 €',
      emailProvider: 'resend'
    };
  }

  static saveProfile(profile) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(profile));
  }

  static getApiVault() {
    try {
      const stored = localStorage.getItem(API_VAULT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erreur lecture vault:', e);
    }
    return {
      geminiKey: '',
      apifyKey: '',
      vercelToken: '',
      resendKey: ''
    };
  }

  static saveApiVault(vault) {
    localStorage.setItem(API_VAULT_KEY, JSON.stringify(vault));
  }

  static exportAllData(leads) {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      leads: leads
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studio-a-client-machine-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static importData(jsonString, store) {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveProfile(data.profile);
      if (data.leads && Array.isArray(data.leads)) {
        store.saveLeads(data.leads);
      }
      return true;
    } catch (e) {
      console.error('Erreur import JSON:', e);
      return false;
    }
  }
}
