import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  UploadCloud, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function Navbar({ 
  user, 
  authStatus, 
  onOpenNewModal, 
  onOpenImportModal, 
  onOpenAuthModal, 
  onLogout,
  onDemoLogin,
  totalCount,
  onOpenWizard
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'hsla(224, 45%, 8%, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        {/* Left: Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(220, 90%, 40%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <LinkedInIcon size={24} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.25rem', 
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff 60%, hsl(210, 95%, 65%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                CareerPulse
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '2px 8px',
                borderRadius: 9999,
                background: 'hsla(210, 95%, 54%, 0.15)',
                color: 'hsl(210, 95%, 65%)',
                border: '1px solid hsla(210, 95%, 54%, 0.3)'
              }}>
                Tracker LinkedIn
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: -2 }}>
              Suivi intelligent de vos candidatures d'emploi
            </p>
          </div>
        </div>

        {/* Center: Live quick status */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 12,
          padding: '6px 14px',
          borderRadius: 9999,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }} className="desktop-indicator">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'hsl(154, 75%, 48%)' }} />
            {totalCount} candidatures suivies
          </span>
        </div>

        {/* Right: Actions & LinkedIn Auth widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Re-open Wizard */}
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              title="Relancer le guide ultra-minimaliste pas-à-pas"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                color: 'hsl(210, 95%, 65%)',
                border: '1px solid hsla(210, 95%, 54%, 0.3)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} />
              <span>Guide Pas-à-Pas</span>
            </button>
          )}

          {/* Import CSV Button */}
          <button 
            onClick={onOpenImportModal}
            title="Importer le fichier Job Applications.csv officiel de LinkedIn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <UploadCloud size={16} color="hsl(210, 95%, 65%)" />
            <span>Importer CSV</span>
          </button>

          {/* Add Job Button */}
          <button 
            onClick={onOpenNewModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(220, 85%, 48%))',
              color: '#ffffff',
              boxShadow: '0 4px 14px hsla(210, 95%, 54%, 0.35)',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            <Plus size={16} />
            <span>Nouvelle Candidature</span>
          </button>

          {/* LinkedIn Profile / Auth Widget */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '4px 10px 4px 6px',
                  borderRadius: 9999,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: 'hsl(154, 75%, 48%)',
                    border: '2px solid var(--bg-surface)'
                  }} />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {user.name}
                    <LinkedInIcon size={12} color="hsl(210, 95%, 65%)" />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'hsl(154, 75%, 48%)', fontWeight: 500 }}>
                    Connecté LinkedIn
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-dim)" />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: 260,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50
                  }}
                  className="animate-fade-in"
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 6 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email || 'Compte LinkedIn synchronisé'}
                    </div>
                    {user.headline && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 2 }}>
                        {user.headline}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenAuthModal(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings size={15} color="var(--text-muted)" />
                    <span>Paramètres & API LinkedIn</span>
                  </button>

                  <button
                    onClick={() => { setDropdownOpen(false); onOpenImportModal(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <UploadCloud size={15} color="var(--text-muted)" />
                    <span>Importer mes candidatures (CSV)</span>
                  </button>

                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                  <button
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      color: 'hsl(352, 80%, 65%)',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'hsla(352, 80%, 62%, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Connect with LinkedIn button */}
              <button 
                onClick={onOpenAuthModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'hsl(210, 95%, 54%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 10px hsla(210, 95%, 54%, 0.35)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'hsl(210, 95%, 60%)'}
                onMouseLeave={e => e.currentTarget.style.background = 'hsl(210, 95%, 54%)'}
              >
                <LinkedInIcon size={18} />
                <span>Se connecter avec LinkedIn</span>
              </button>

              {/* Instant 1-click Demo button */}
              <button
                onClick={onDemoLogin}
                title="Tester instantanément en 1 clic sans configurer de clé d'API"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  fontWeight: 500
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'hsl(38, 92%, 52%)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Sparkles size={14} color="hsl(38, 92%, 52%)" />
                <span>Mode Démo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
