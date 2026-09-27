import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsBar from './components/MetricsBar';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import NewApplicationModal from './components/NewApplicationModal';
import ImportCsvModal from './components/ImportCsvModal';
import LinkedInAuthModal from './components/LinkedInAuthModal';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import OnboardingBanner from './components/OnboardingBanner';
import MinimalWizard from './components/MinimalWizard';
import LinkedInIcon from './components/LinkedInIcon';
import { ArrowRight } from 'lucide-react';
import { getDaysSince } from './constants';
import confetti from 'canvas-confetti';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Minimalist single-button wizard mode (defaults to true as requested)
  const [isWizardMode, setIsWizardMode] = useState(() => {
    return localStorage.getItem('careerpulse_completed') !== 'true';
  });

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [isFollowUpActive, setIsFollowUpActive] = useState(false);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newModalInitialStatus, setNewModalInitialStatus] = useState('applied');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Notifications banner
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Initial load
  useEffect(() => {
    fetchAuthStatus();
    fetchApplications();

    // Check url search params for oauth return
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth_success')) {
      showToast('🎉 Connecté à LinkedIn avec succès !');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('auth_error')) {
      showToast(`⚠️ Erreur d'authentification LinkedIn : ${params.get('auth_error')}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setAuthStatus(data);
    } catch (e) {
      console.error('Failed to fetch auth status', e);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (e) {
      console.error('Failed to fetch applications', e);
    } finally {
      setLoading(false);
    }
  };

  // Auth actions
  const handleDemoLogin = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAuthStatus({
          ...authStatus,
          isAuthenticated: true,
          user: data.user
        });
        showToast('Connecté en Mode Démo LinkedIn (Profil vérifié) !');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnectProfile = async (name, headline, linkedinUrl) => {
    try {
      const res = await fetch('/api/auth/connect-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, headline, linkedinUrl })
      });
      const data = await res.json();
      if (data.success) {
        setAuthStatus({
          ...authStatus,
          isAuthenticated: true,
          user: data.user
        });
        showToast(`🎉 Profil LinkedIn de ${name} relié avec succès !`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthStatus({
        ...authStatus,
        isAuthenticated: false,
        user: null
      });
      showToast('Déconnecté de LinkedIn');
    } catch (e) {
      console.error(e);
    }
  };

  // Application CRUD
  const handleCreateApplication = async (newAppData) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppData)
      });
      const created = await res.json();
      setApplications([created, ...applications]);
      showToast(`Candidature chez ${created.company} ajoutée avec succès !`);
    } catch (e) {
      console.error('Error creating app', e);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const target = applications.find(a => a.id === id);
    if (!target) return;

    if (newStatus === 'offer') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      showToast(`🎉 Félicitations pour l'offre reçue chez ${target.company} !`);
    }

    // Optimistic update
    setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));

    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Error updating status', e);
      fetchApplications();
    }
  };

  const handleUpdateApplication = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const saved = await res.json();
      setApplications(applications.map(a => a.id === id ? saved : a));
      setSelectedApp(saved);
      showToast('Candidature mise à jour !');
    } catch (e) {
      console.error('Error updating app', e);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      setApplications(applications.filter(a => a.id !== id));
      showToast('Candidature supprimée');
    } catch (e) {
      console.error('Error deleting app', e);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Voulez-vous recharger la liste d\'exemples de candidatures ?')) {
      try {
        await fetch('/api/applications/reset-demo', { method: 'POST' });
        fetchApplications();
        showToast('Exemples réinitialisés avec succès !');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filter and sort logic
  const filteredApplications = applications.filter(app => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = (app.company || '').toLowerCase().includes(q);
      const matchTitle = (app.title || '').toLowerCase().includes(q);
      const matchTags = (app.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchCompany && !matchTitle && !matchTags) return false;
    }

    // Remote filter
    if (remoteFilter !== 'all' && app.remoteType !== remoteFilter) {
      return false;
    }

    // Contract filter
    if (contractFilter !== 'all' && app.contract !== contractFilter) {
      return false;
    }

    // Follow-up only filter
    if (isFollowUpActive) {
      if (['offer', 'rejected'].includes(app.status)) return false;
      const days = getDaysSince(app.lastActivityDate || app.appliedDate);
      if (days < 7) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date_desc') {
      return new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0);
    } else if (sortBy === 'date_asc') {
      return new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0);
    } else if (sortBy === 'company_asc') {
      return (a.company || '').localeCompare(b.company || '');
    }
    return 0;
  });

  const handleImportCsvDirect = async (csvText) => {
    try {
      const res = await fetch('/api/applications/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvText })
      });
      await fetchApplications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinishWizard = () => {
    localStorage.setItem('careerpulse_completed', 'true');
    setIsWizardMode(false);
    showToast('🎉 Configuration terminée ! Bienvenue sur votre tableau de bord.');
  };

  // --- RENDU 1 : MODE ULTRA MINIMALISTE ÉTAPE PAR ÉTAPE (COMMENCE AVEC UN SEUL BOUTON AU MILIEU) ---
  if (isWizardMode) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* En-tête épuré */}
        <header style={{
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'hsla(224, 45%, 8%, 0.85)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'hsl(210, 95%, 54%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 12px hsla(210, 95%, 54%, 0.4)'
            }}>
              <LinkedInIcon size={20} />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              CareerPulse
            </span>
          </div>

          <button
            onClick={() => {
              localStorage.setItem('careerpulse_completed', 'true');
              setIsWizardMode(false);
            }}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              border: '1px solid var(--border-subtle)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.borderColor = 'var(--border-medium)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <span>Passer directement au tableau de bord</span>
            <ArrowRight size={14} />
          </button>
        </header>

        {/* L'Assistant guidé avec un seul bouton au milieu */}
        <main style={{ flex: 1 }}>
          <MinimalWizard
            user={authStatus?.user}
            onDemoLogin={handleDemoLogin}
            onConnectProfile={handleConnectProfile}
            onOpenRealAuth={() => setIsAuthModalOpen(true)}
            onCreateApplication={handleCreateApplication}
            onImportCsv={handleImportCsvDirect}
            onCompleteWizard={handleFinishWizard}
          />
        </main>

        <LinkedInAuthModal
          isOpen={isAuthModalOpen}
          authStatus={authStatus}
          onClose={() => setIsAuthModalOpen(false)}
          onDemoLogin={handleDemoLogin}
          onRefreshAuth={fetchAuthStatus}
        />
      </div>
    );
  }

  // --- RENDU 2 : TABLEAU DE BORD COMPLET DE GESTION ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        user={authStatus?.user}
        authStatus={authStatus}
        totalCount={applications.length}
        onOpenNewModal={() => {
          setNewModalInitialStatus('applied');
          setIsNewModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onDemoLogin={handleDemoLogin}
        onOpenWizard={() => setIsWizardMode(true)}
      />

      {/* Toast alert */}
      {toastMessage && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'hsl(224, 45%, 12%)',
            border: '1px solid var(--accent-linkedin)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 20px',
            color: 'var(--text-main)',
            fontSize: '0.88rem',
            fontWeight: 600,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ maxWidth: 1600, width: '100%', margin: '0 auto', padding: '24px 24px 48px', flex: 1 }}>
        {/* Step-by-Step Onboarding Guide */}
        <OnboardingBanner
          user={authStatus?.user}
          applicationsCount={applications.length}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenNewModal={() => {
            setNewModalInitialStatus('applied');
            setIsNewModalOpen(true);
          }}
          onDemoLogin={handleDemoLogin}
        />

        {/* Key Metrics Summary Bar */}
        <MetricsBar 
          applications={applications} 
          onFilterByFollowUp={() => setIsFollowUpActive(!isFollowUpActive)} 
        />

        {/* Filter and Control Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          remoteFilter={remoteFilter}
          setRemoteFilter={setRemoteFilter}
          contractFilter={contractFilter}
          setContractFilter={setContractFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetDemo={handleResetDemo}
          isFollowUpActive={isFollowUpActive}
          setIsFollowUpActive={setIsFollowUpActive}
        />

        {/* Main Applications View: Kanban or List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Chargement de vos candidatures...
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            applications={filteredApplications}
            onSelectApplication={setSelectedApp}
            onStatusChange={handleStatusChange}
            onDeleteApplication={handleDeleteApplication}
            onAddNewInStatus={(statusId) => {
              setNewModalInitialStatus(statusId);
              setIsNewModalOpen(true);
            }}
          />
        ) : (
          <ListView
            applications={filteredApplications}
            onSelectApplication={setSelectedApp}
            onStatusChange={handleStatusChange}
            onDeleteApplication={handleDeleteApplication}
          />
        )}
      </main>

      {/* Modals */}
      <NewApplicationModal
        isOpen={isNewModalOpen}
        initialStatus={newModalInitialStatus}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleCreateApplication}
      />

      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          fetchApplications();
          showToast('Importation terminée !');
        }}
      />

      <LinkedInAuthModal
        isOpen={isAuthModalOpen}
        authStatus={authStatus}
        onClose={() => setIsAuthModalOpen(false)}
        onDemoLogin={handleDemoLogin}
        onRefreshAuth={fetchAuthStatus}
      />

      <ApplicationDetailsModal
        isOpen={Boolean(selectedApp)}
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}
