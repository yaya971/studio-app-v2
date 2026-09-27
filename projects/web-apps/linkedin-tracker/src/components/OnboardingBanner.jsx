import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  UploadCloud, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function OnboardingBanner({ 
  user, 
  applicationsCount, 
  onOpenAuthModal, 
  onOpenImportModal, 
  onOpenNewModal,
  onDemoLogin
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Determine progress
  const step1Done = Boolean(user);
  const step2Done = applicationsCount > 0;
  const completedSteps = (step1Done ? 1 : 0) + (step2Done ? 1 : 0);
  const progressPercent = Math.round((completedSteps / 2) * 100);

  return (
    <div 
      className="glass-panel animate-fade-in"
      style={{
        marginBottom: 24,
        background: 'linear-gradient(135deg, hsla(210, 95%, 54%, 0.12), hsla(224, 40%, 12%, 0.95))',
        border: '1px solid hsla(210, 95%, 54%, 0.35)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Header of Guide */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        background: 'hsla(224, 45%, 10%, 0.4)'
      }}
      onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'hsl(210, 95%, 54%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 16px hsla(210, 95%, 54%, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Guide étape par étape — Prise en main de votre recherche LinkedIn
              </h3>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 9999,
                background: progressPercent === 100 ? 'hsla(154, 75%, 48%, 0.2)' : 'hsla(210, 95%, 54%, 0.2)',
                color: progressPercent === 100 ? 'hsl(154, 75%, 55%)' : 'hsl(210, 95%, 65%)',
                border: progressPercent === 100 ? '1px solid hsla(154, 75%, 48%, 0.35)' : '1px solid hsla(210, 95%, 54%, 0.3)'
              }}>
                {progressPercent === 100 ? 'Prêt à 100% ✅' : `${completedSteps}/2 Étapes validées (${progressPercent}%)`}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Suivez ces étapes pour connecter votre profil et gérer vos candidatures de A à Z.
            </p>
          </div>
        </div>

        <button 
          type="button"
          style={{ background: 'transparent', color: 'var(--text-dim)', padding: 4 }}
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Steps Content */}
      {!collapsed && (
        <div style={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16
        }}>
          {/* Étape 1 : Connexion LinkedIn */}
          <div style={{
            background: step1Done ? 'hsla(154, 75%, 48%, 0.08)' : 'var(--bg-surface)',
            border: step1Done ? '1px solid hsla(154, 75%, 48%, 0.3)' : '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {step1Done ? (
                    <CheckCircle2 size={20} color="hsl(154, 75%, 48%)" />
                  ) : (
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--accent-linkedin)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>1</span>
                  )}
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Étape 1 : Connecter votre compte LinkedIn
                  </h4>
                </div>
                {step1Done && (
                  <span style={{ fontSize: '0.72rem', color: 'hsl(154, 75%, 48%)', fontWeight: 600 }}>
                    Connecté ✓
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                {step1Done ? (
                  <>Connecté en tant que <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.headline || 'Profil actif'}). Votre compte est relié à l'application.</>
                ) : (
                  <>Connectez votre profil LinkedIn pour synchroniser vos informations et personnaliser votre recherche d'emploi.</>
                )}
              </p>
            </div>

            {!step1Done ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={onOpenAuthModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-linkedin)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px hsla(210, 95%, 54%, 0.3)'
                  }}
                >
                  <LinkedInIcon size={16} />
                  <span>Se connecter avec LinkedIn</span>
                </button>
                <button
                  onClick={onDemoLogin}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  Mode Démo (1 clic)
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
                color: 'hsl(154, 75%, 48%)'
              }}>
                <CheckCircle2 size={16} />
                <span>Compte LinkedIn vérifié et prêt.</span>
              </div>
            )}
          </div>

          {/* Étape 2 : Importer ou ajouter vos candidatures */}
          <div style={{
            background: step2Done ? 'hsla(154, 75%, 48%, 0.08)' : 'var(--bg-surface)',
            border: step2Done ? '1px solid hsla(154, 75%, 48%, 0.3)' : '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {step2Done ? (
                    <CheckCircle2 size={20} color="hsl(154, 75%, 48%)" />
                  ) : (
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'hsl(210, 95%, 54%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>2</span>
                  )}
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Étape 2 : Suivre vos candidatures
                  </h4>
                </div>
                {step2Done && (
                  <span style={{ fontSize: '0.72rem', color: 'hsl(154, 75%, 48%)', fontWeight: 600 }}>
                    {applicationsCount} candidatures suivies ✓
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14 }}>
                Chargez votre historique officiel LinkedIn en 1 clic via le fichier CSV (dans vos paramètres de compte), ou ajoutez directement une offre par son URL.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={onOpenImportModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <UploadCloud size={16} color="hsl(210, 95%, 65%)" />
                <span>Importer CSV LinkedIn</span>
              </button>
              <button
                onClick={onOpenNewModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-linkedin)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <Plus size={16} />
                <span>Ajouter par URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
