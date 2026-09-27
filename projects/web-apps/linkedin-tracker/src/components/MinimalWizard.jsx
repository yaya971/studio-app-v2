import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  Plus, 
  FileText,
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';

export default function MinimalWizard({ 
  user, 
  onDemoLogin, 
  onConnectProfile,
  onOpenRealAuth, 
  onCreateApplication, 
  onImportCsv,
  onCompleteWizard 
}) {
  // Wizard steps:
  // 0: Initial Screen (Single button in center)
  // 1: Step 1 - LinkedIn Connection
  // 2: Step 2 - Search Profile & Target
  // 3: Step 3 - First Application or CSV Import
  // 4: Step 4 - Completion Screen
  const [step, setStep] = useState(0);

  // Step 1 state: Direct profile name
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileHeadlineInput, setProfileHeadlineInput] = useState('');

  // Step 2 state: Target criteria
  const [targetTitle, setTargetTitle] = useState('Développeur Fullstack');
  const [targetContract, setTargetContract] = useState('CDI');
  const [targetRemote, setTargetRemote] = useState('hybride');
  const [targetSalary, setTargetSalary] = useState('65k €');

  // Step 3 state: First job application
  const [appInputMode, setAppInputMode] = useState('url'); // 'url', 'csv', 'sample'
  const [firstUrl, setFirstUrl] = useState('');
  const [firstCompany, setFirstCompany] = useState('');
  const [firstJobTitle, setFirstJobTitle] = useState('');
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 0 -> Step 1
  const handleStart = () => {
    setStep(1);
  };

  // Step 1: Connect LinkedIn
  const handleConnectDemo = async () => {
    setIsProcessing(true);
    await onDemoLogin();
    setIsProcessing(false);
    setTimeout(() => {
      setStep(2);
    }, 400);
  };

  // Step 2: Next
  const handleSaveCriteria = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // Step 3: Handle Import or Add Application
  const handleCompleteStep3 = async () => {
    setIsProcessing(true);

    if (appInputMode === 'url' && (firstCompany || firstJobTitle)) {
      await onCreateApplication({
        title: firstJobTitle || targetTitle,
        company: firstCompany || 'Entreprise LinkedIn',
        location: 'Paris (Hybride)',
        remoteType: targetRemote,
        contract: targetContract,
        salary: targetSalary,
        linkedinUrl: firstUrl,
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
        nextStep: 'En attente du premier contact recruteur',
        notes: `Candidature ajoutée via l'assistant de configuration. Profil cible : ${targetTitle}.`,
        tags: ['Première candidature']
      });
    } else if (appInputMode === 'sample') {
      const sampleCsv = `"Application Date","Company Name","Job Title","Job Url"
"2026-09-24","Doctolib","${targetTitle}","https://www.linkedin.com/jobs/view/3892019482"
"2026-09-22","Alan","${targetTitle} Senior","https://www.linkedin.com/jobs/view/3881920192"
"2026-09-18","Qonto","Tech Lead Web","https://www.linkedin.com/jobs/view/3874019283"`;
      await onImportCsv(sampleCsv);
    }

    setIsProcessing(false);
    setStep(4);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* --- ÉCRAN 0 : ULTRA MINIMALISTE — UN SEUL BOUTON AU MILIEU --- */}
      {step === 0 && (
        <div 
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            maxWidth: 640,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32
          }}
        >
          {/* Subtle minimal badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 9999,
            background: 'hsla(210, 95%, 54%, 0.1)',
            border: '1px solid hsla(210, 95%, 54%, 0.25)',
            color: 'hsl(210, 95%, 65%)',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <LinkedInIcon size={16} />
            <span>Suivi de Candidatures LinkedIn</span>
          </div>

          {/* Minimalist Title */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#ffffff'
          }}>
            Pilotez vos offres d'emploi LinkedIn, <br/>
            <span style={{
              background: 'linear-gradient(90deg, hsl(210, 95%, 60%), hsl(154, 75%, 50%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              étape par étape.
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: 480,
            lineHeight: 1.6
          }}>
            Une configuration guidée en 3 étapes simples pour relier votre compte et suivre l'avancement de chaque candidature.
          </p>

          {/* LE BOUTON UNIQUE AU MILIEU */}
          <button
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '18px 36px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(220, 90%, 46%))',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 8px 32px hsla(210, 95%, 54%, 0.45)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 40px hsla(210, 95%, 54%, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px hsla(210, 95%, 54%, 0.45)';
            }}
          >
            <span>Démarrer la configuration</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* --- ÉCRAN 1 : ÉTAPE 1 — CONNEXION LINKEDIN --- */}
      {step === 1 && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: 540,
            padding: '36px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--accent-linkedin)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-subtle)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-subtle)' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'hsl(210, 95%, 54%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px hsla(210, 95%, 54%, 0.35)',
              marginBottom: 16
            }}>
              <LinkedInIcon size={32} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Étape 1 sur 3 : Connexion LinkedIn
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
              Connectez votre profil pour identifier vos candidatures et personnaliser votre espace.
            </p>
          </div>

          {user ? (
            <div style={{
              background: 'hsla(154, 75%, 48%, 0.1)',
              border: '1px solid hsla(154, 75%, 48%, 0.3)',
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(154, 75%, 50%)', fontWeight: 600 }}>✓ Profil vérifié & connecté</div>
                </div>
              </div>
              <CheckCircle2 size={24} color="hsl(154, 75%, 48%)" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '16px'
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
                  Votre Nom et Prénom *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Yaya Touré..."
                  value={profileNameInput}
                  onChange={e => setProfileNameInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    marginBottom: 12
                  }}
                />

                <button
                  type="button"
                  disabled={!profileNameInput.trim() || isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    if (onConnectProfile) {
                      await onConnectProfile(profileNameInput, profileHeadlineInput || 'En recherche active sur LinkedIn');
                    } else {
                      await onDemoLogin();
                    }
                    setIsProcessing(false);
                    setStep(2);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 8,
                    background: profileNameInput.trim() ? 'hsl(210, 95%, 54%)' : 'var(--bg-card)',
                    color: profileNameInput.trim() ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: profileNameInput.trim() ? '0 4px 12px hsla(210, 95%, 54%, 0.35)' : 'none',
                    cursor: profileNameInput.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <span>Connecter mon compte & Continuer</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                — ou —
              </div>

              <button
                type="button"
                onClick={handleConnectDemo}
                disabled={isProcessing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 16px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <Sparkles size={16} color="hsl(38, 92%, 52%)" />
                <span>Tester en 1 clic (Profil Démo)</span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setStep(0)}
              style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '0.85rem' }}
            >
              Retour
            </button>

            {user && (
              <button
                onClick={() => setStep(2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 22px',
                  borderRadius: 9999,
                  background: 'var(--accent-linkedin)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <span>Continuer</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- ÉCRAN 2 : ÉTAPE 2 — VOS CRITÈRES DE RECHERCHE --- */}
      {step === 2 && (
        <form 
          onSubmit={handleSaveCriteria}
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: 540,
            padding: '36px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'hsl(154, 75%, 48%)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--accent-linkedin)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-subtle)' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Étape 2 sur 3 : Vos objectifs d'emploi
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Indiquez ce que vous recherchez pour configurer votre tableau de suivi.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Poste ou intitulé ciblé sur LinkedIn
              </label>
              <input
                type="text"
                required
                value={targetTitle}
                onChange={e => setTargetTitle(e.target.value)}
                placeholder="Ex: Développeur Fullstack, Product Designer..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Type de contrat
                </label>
                <select
                  value={targetContract}
                  onChange={e => setTargetContract(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                >
                  <option value="CDI">CDI</option>
                  <option value="Freelance">Freelance</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  Mode de travail
                </label>
                <select
                  value={targetRemote}
                  onChange={e => setTargetRemote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                >
                  <option value="hybride">Hybride</option>
                  <option value="full_remote">Full Remote</option>
                  <option value="sur_site">Sur site</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Prétention salariale / TJM cible
              </label>
              <input
                type="text"
                value={targetSalary}
                onChange={e => setTargetSalary(e.target.value)}
                placeholder="Ex: 65k - 75k € ou 550€/j"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '0.85rem' }}
            >
              Retour
            </button>

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 9999,
                background: 'var(--accent-linkedin)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <span>Étape suivante</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* --- ÉCRAN 3 : ÉTAPE 3 — AJOUT OU IMPORT DES CANDIDATURES --- */}
      {step === 3 && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: 580,
            padding: '36px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'hsl(154, 75%, 48%)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'hsl(154, 75%, 48%)' }} />
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--accent-linkedin)' }} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Étape 3 sur 3 : Vos premières candidatures
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Choisissez comment vous souhaitez démarrer votre historique.
            </p>
          </div>

          {/* Option Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setAppInputMode('url')}
              style={{
                padding: '12px',
                borderRadius: 12,
                background: appInputMode === 'url' ? 'hsla(210, 95%, 54%, 0.15)' : 'var(--bg-surface)',
                border: appInputMode === 'url' ? '1px solid var(--accent-linkedin)' : '1px solid var(--border-subtle)',
                color: appInputMode === 'url' ? 'var(--text-main)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              1. Ajouter une offre
            </button>

            <button
              type="button"
              onClick={() => setAppInputMode('sample')}
              style={{
                padding: '12px',
                borderRadius: 12,
                background: appInputMode === 'sample' ? 'hsla(210, 95%, 54%, 0.15)' : 'var(--bg-surface)',
                border: appInputMode === 'sample' ? '1px solid var(--accent-linkedin)' : '1px solid var(--border-subtle)',
                color: appInputMode === 'sample' ? 'var(--text-main)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textAlign: 'center'
              }}
            >
              2. Charger 3 exemples réels
            </button>
          </div>

          {/* Form according to choice */}
          {appInputMode === 'url' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Entreprise
                </label>
                <input
                  type="text"
                  placeholder="Ex: Doctolib, Alan, Stripe..."
                  value={firstCompany}
                  onChange={e => setFirstCompany(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Intitulé du poste
                </label>
                <input
                  type="text"
                  placeholder={`Ex: ${targetTitle}`}
                  value={firstJobTitle}
                  onChange={e => setFirstJobTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Lien de l'offre LinkedIn (optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={firstUrl}
                  onChange={e => setFirstUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              padding: '16px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              <p>
                Cette option va importer immédiatement 3 candidatures exemples réalistes chez <strong style={{ color: 'var(--text-main)' }}>Doctolib, Alan et Qonto</strong> adaptées à votre profil de <em>{targetTitle}</em>.
              </p>
              <p style={{ marginTop: 6, fontSize: '0.78rem', color: 'hsl(154, 75%, 48%)' }}>
                ✓ Vous pourrez ensuite ajouter, modifier ou supprimer toutes vos offres librement.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '0.85rem' }}
            >
              Retour
            </button>

            <button
              type="button"
              onClick={handleCompleteStep3}
              disabled={isProcessing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 26px',
                borderRadius: 9999,
                background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(154, 75%, 45%))',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                boxShadow: '0 4px 16px hsla(154, 75%, 45%, 0.35)'
              }}
            >
              <span>{isProcessing ? 'Finalisation...' : 'Terminer la configuration'}</span>
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* --- ÉCRAN 4 : SUCCÈS & ACCÈS AU DASHBOARD --- */}
      {step === 4 && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: 500,
            padding: '40px 32px',
            background: 'var(--bg-card)',
            border: '1px solid hsla(154, 75%, 48%, 0.35)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'hsla(154, 75%, 48%, 0.15)',
            border: '2px solid hsl(154, 75%, 48%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'hsl(154, 75%, 48%)',
            marginBottom: 20
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
            Tout est connecté et prêt !
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28 }}>
            Votre compte LinkedIn est synchronisé, vos critères de recherche sont enregistrés et votre tableau de suivi de candidatures est opérationnel.
          </p>

          <button
            onClick={onCompleteWizard}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(220, 90%, 46%))',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 700,
              boxShadow: '0 8px 24px hsla(210, 95%, 54%, 0.4)'
            }}
          >
            <span>Ouvrir mon tableau de bord</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
