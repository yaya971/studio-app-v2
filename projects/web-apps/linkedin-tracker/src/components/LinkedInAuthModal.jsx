import { 
  X, 
  Key, 
  CheckCircle2, 
  ExternalLink, 
  Info, 
  Sparkles,
  ShieldCheck,
  Save
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function LinkedInAuthModal({ 
  isOpen, 
  onClose, 
  authStatus, 
  onDemoLogin, 
  onRefreshAuth 
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState(authStatus?.redirectUri || 'http://localhost:3001/api/auth/linkedin/callback');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

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
          maxHeight: '90vh'
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Connexion avec LinkedIn</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Authentification officielle OpenID Connect OAuth 2.0
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', padding: 6 }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {/* Important Technical Note */}
          <div style={{
            background: 'hsla(210, 95%, 54%, 0.08)',
            border: '1px solid hsla(210, 95%, 54%, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Info size={18} color="hsl(210, 95%, 65%)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-main)' }}>Fonctionnement de l'accès LinkedIn :</strong>
                <p style={{ marginTop: 4 }}>
                  L'API officielle de LinkedIn autorise la <strong>connexion de votre profil (Nom, Prénom, Photo, Email)</strong>. Cependant, pour protéger votre vie privée, LinkedIn ne permet à aucune application externe d'accéder directement à vos candidatures privées via API.
                </p>
                <p style={{ marginTop: 4 }}>
                  👉 <strong>CareerPulse combine donc :</strong> votre connexion LinkedIn officielle + l'import en 1 clic de votre historique de candidatures (fichier CSV officiel de LinkedIn) + le suivi par URL !
                </p>
              </div>
            </div>
          </div>

          {/* Quick Choice Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {/* 1. Official OAuth Button */}
            <button
              onClick={handleStartRealOAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'hsl(210, 95%, 54%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                boxShadow: '0 4px 14px hsla(210, 95%, 54%, 0.35)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'hsl(210, 95%, 60%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'hsl(210, 95%, 54%)'}
            >
              <LinkedInIcon size={20} />
              <span>Se connecter via LinkedIn (OAuth 2.0)</span>
            </button>

            {/* 2. Instant Demo Mode */}
            <button
              onClick={() => {
                onDemoLogin();
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '11px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-medium)',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(38, 92%, 52%)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            >
              <Sparkles size={16} color="hsl(38, 92%, 52%)" />
              <span>Connexion Démo Instantanée (sans configuration)</span>
            </button>
          </div>

          {/* Toggle Custom API Keys Configuration */}
          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'transparent',
                color: 'var(--accent-linkedin)',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Key size={14} />
              <span>{showConfig ? 'Masquer la configuration des clés' : 'Configurer mes clés d\'API LinkedIn (Développeur)'}</span>
            </button>
          </div>

          {/* Form to enter LinkedIn Client ID & Secret */}
          {showConfig && (
            <form onSubmit={handleSaveCredentials} className="animate-fade-in" style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginTop: 10
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-main)' }}>
                Paramètres de votre application LinkedIn Developer
              </h4>
              
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Client ID LinkedIn
                </label>
                <input
                  type="text"
                  placeholder="Ex: 77xxxxxxxxxxxx"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Client Secret LinkedIn
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Authorized Redirect URL (à coller dans LinkedIn Developer Portal)
                </label>
                <input
                  type="text"
                  readOnly
                  value={redirectUri}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'hsl(210, 95%, 65%)',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href="https://www.linkedin.com/developers/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Portail Développeur LinkedIn</span>
                </a>

                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-linkedin)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Save size={13} />
                  <span>Enregistrer les clés</span>
                </button>
              </div>

              {saveSuccess && (
                <div style={{
                  marginTop: 10,
                  fontSize: '0.78rem',
                  color: 'hsl(154, 75%, 48%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <CheckCircle2 size={14} />
                  <span>Clés enregistrées avec succès !</span>
                </div>
              )}
            </form>
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
