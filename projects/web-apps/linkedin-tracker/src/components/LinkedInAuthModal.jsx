import React, { useState } from 'react';
import { 
  X, 
  Key, 
  CheckCircle2, 
  ExternalLink, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  User, 
  ArrowRight
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function LinkedInAuthModal({ 
  isOpen, 
  onClose, 
  authStatus, 
  onDemoLogin, 
  onRefreshAuth 
}) {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct', 'oauth'
  const [profileName, setProfileName] = useState('');
  const [profileHeadline, setProfileHeadline] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OAuth config state
  const [showConfig, setShowConfig] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState(authStatus?.redirectUri || 'http://localhost:3001/api/auth/linkedin/callback');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Save real profile directly
  const handleConnectMyProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/connect-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          headline: profileHeadline || 'En recherche d\'opportunités sur LinkedIn',
          linkedinUrl: profileUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onRefreshAuth) await onRefreshAuth();
        onClose();
      } else {
        setErrorMessage(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setErrorMessage('Erreur réseau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartRealOAuth = async () => {
    try {
      const res = await fetch('/api/auth/linkedin/url');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.message || 'Veuillez configurer votre Client ID LinkedIn ci-dessous.');
        setShowConfig(true);
      }
    } catch (e) {
      setErrorMessage('Erreur lors de la génération du lien OAuth.');
      setShowConfig(true);
    }
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/save-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret, redirectUri })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (onRefreshAuth) onRefreshAuth();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setErrorMessage('Erreur lors de l\'enregistrement des clés.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 580,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'hsl(210, 95%, 54%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <LinkedInIcon size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Connecter mon compte LinkedIn</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Reliez votre véritable profil à votre tableau de bord
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          padding: '10px 20px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          gap: 10
        }}>
          <button
            onClick={() => setActiveTab('direct')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'direct' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'direct' ? 'var(--accent-linkedin)' : 'var(--text-muted)',
              border: activeTab === 'direct' ? '1px solid var(--border-medium)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <User size={14} />
            <span>Mon Profil LinkedIn (Direct)</span>
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'oauth' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'oauth' ? 'var(--accent-linkedin)' : 'var(--text-muted)',
              border: activeTab === 'oauth' ? '1px solid var(--border-medium)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Key size={14} />
            <span>Connexion OAuth 2.0</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'direct' ? (
            /* Direct Profile Setup */
            <form onSubmit={handleConnectMyProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                background: 'hsla(210, 95%, 54%, 0.08)',
                border: '1px solid hsla(210, 95%, 54%, 0.25)',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}>
                Renseignez votre nom et votre lien LinkedIn pour personnaliser immédiatement votre tableau de bord avec votre identité.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  Votre Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Yaya Touré, Alexandre Martin..."
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  Titre / Poste actuel ou recherché
                </label>
                <input
                  type="text"
                  placeholder="Ex: Développeur Fullstack React & Node.js"
                  value={profileHeadline}
                  onChange={e => setProfileHeadline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  Lien de votre profil LinkedIn (optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/mon-profil"
                  value={profileUrl}
                  onChange={e => setProfileUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ color: 'hsl(352, 80%, 65%)', fontSize: '0.8rem' }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    onDemoLogin();
                    onClose();
                  }}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={14} color="hsl(38, 92%, 52%)" />
                  <span>Utiliser profil démo de test</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !profileName.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 8,
                    background: 'hsl(210, 95%, 54%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 12px hsla(210, 95%, 54%, 0.35)'
                  }}
                >
                  <span>Connecter mon profil</span>
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </form>
          ) : (
            /* OAuth 2.0 Tab */
            <div>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '14px',
                marginBottom: 16,
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}>
                La connexion officielle utilise le protocole OpenID Connect de LinkedIn. Si vous possédez une application LinkedIn Developer avec un <code>Client ID</code> et <code>Secret</code>, vous pouvez vous authentifier directement.
              </div>

              <button
                type="button"
                onClick={handleStartRealOAuth}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '12px 20px',
                  borderRadius: 10,
                  background: 'hsl(210, 95%, 54%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 14px hsla(210, 95%, 54%, 0.35)',
                  marginBottom: 16
                }}
              >
                <LinkedInIcon size={20} />
                <span>Lancer la redirection LinkedIn OAuth 2.0</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  style={{
                    background: 'transparent',
                    color: 'var(--accent-linkedin)',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Key size={14} />
                  <span>{showConfig ? 'Masquer la configuration' : 'Configurer Client ID / Client Secret'}</span>
                </button>
              </div>

              {showConfig && (
                <form onSubmit={handleSaveCredentials} className="animate-fade-in" style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginTop: 12
                }}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      Client ID LinkedIn
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={e => setClientId(e.target.value)}
                      placeholder="77xxxxxxxxxxxx"
                      style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-main)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      Client Secret LinkedIn
                    </label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={e => setClientSecret(e.target.value)}
                      placeholder="••••••••••••••••"
                      style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: 'var(--text-main)', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        background: 'var(--accent-linkedin)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      Enregistrer
                    </button>
                  </div>
                  {saveSuccess && (
                    <div style={{ color: 'hsl(154, 75%, 48%)', fontSize: '0.78rem', marginTop: 8 }}>
                      ✓ Clés enregistrées avec succès !
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--bg-surface)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
