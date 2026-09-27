import { 
  X, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  Check
} from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';
import { STATUS_LIST } from '../constants';

export default function NewApplicationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialStatus = 'applied' 
}) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'manual'
  const [linkedinUrlInput, setLinkedinUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Paris (Hybride)');
  const [remoteType, setRemoteType] = useState('hybride');
  const [contract, setContract] = useState('CDI');
  const [salary, setSalary] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(initialStatus);
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterRole, setRecruiterRole] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleExtractFromUrl = async () => {
    if (!linkedinUrlInput) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/applications/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkedinUrlInput })
      });
      const data = await res.json();
      if (data.suggestedTitle) setTitle(data.suggestedTitle);
      if (data.suggestedCompany) setCompany(data.suggestedCompany);
      setActiveTab('manual');
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company) return;

    onSave({
      title,
      company,
      location,
      remoteType,
      contract,
      salary,
      appliedDate,
      status,
      linkedinUrl: linkedinUrlInput,
      recruiterName,
      recruiterRole,
      nextStep,
      notes,
      tags: ['Candidature']
    });

    onClose();
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
          maxWidth: 620,
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
        {/* Modal Header */}
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
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'hsla(210, 95%, 54%, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-linkedin)'
            }}>
              <LinkedInIcon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Ajouter une Candidature</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Renseignez le poste ou collez directement le lien LinkedIn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-dim)',
              padding: 6,
              borderRadius: 6
            }}
          >
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
            onClick={() => setActiveTab('url')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'url' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'url' ? 'var(--accent-linkedin)' : 'var(--text-muted)',
              border: activeTab === 'url' ? '1px solid var(--border-medium)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={14} />
            <span>Coller un lien d'offre LinkedIn</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'manual' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'manual' ? 'var(--accent-linkedin)' : 'var(--text-muted)',
              border: activeTab === 'manual' ? '1px solid var(--border-medium)' : '1px solid transparent',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            Formulaire complet
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px', flex: 1 }}>
          {activeTab === 'url' && (
            <div style={{
              background: 'var(--bg-surface)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 20
            }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                Lien de l'offre d'emploi LinkedIn
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/3892019482..."
                  value={linkedinUrlInput}
                  onChange={e => setLinkedinUrlInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleExtractFromUrl}
                  disabled={isExtracting || !linkedinUrlInput}
                  style={{
                    padding: '0 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-linkedin)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={14} />
                  <span>{isExtracting ? 'Extraction...' : 'Pré-remplir'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 8 }}>
                Astuce : Vous pouvez coller le lien d'une offre pour en extraire automatiquement les informations ou continuer ci-dessous.
              </p>
            </div>
          )}

          {/* Core Info: Title & Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Intitulé du poste *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Développeur Fullstack React/Node"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Entreprise *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Doctolib, Alan, Stripe..."
                value={company}
                onChange={e => setCompany(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Status & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Statut initial dans le pipeline
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                {STATUS_LIST.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Date de candidature
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={e => setAppliedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Location & Remote & Contract */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Localisation
              </label>
              <input
                type="text"
                placeholder="Ex: Paris, Lyon..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Mode de travail
              </label>
              <select
                value={remoteType}
                onChange={e => setRemoteType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              >
                <option value="hybride">Hybride</option>
                <option value="full_remote">Full Remote</option>
                <option value="sur_site">Sur site</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Contrat & Salaire
              </label>
              <input
                type="text"
                placeholder="Ex: 60k - 70k €"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>

          {/* Recruiter info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Nom du recruteur / contact RH
              </label>
              <input
                type="text"
                placeholder="Ex: Sophie Martin"
                value={recruiterName}
                onChange={e => setRecruiterName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
                Prochaine action / échéance
              </label>
              <input
                type="text"
                placeholder="Ex: Entretien RH mardi à 14h"
                value={nextStep}
                onChange={e => setNextStep(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>
              Notes personnelles & questions pour l'entretien
            </label>
            <textarea
              rows={3}
              placeholder="Questions sur le stack, points forts de ma candidature, feedbacks..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Footer actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-linkedin)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: '0 2px 10px hsla(210, 95%, 54%, 0.35)'
              }}
            >
              Enregistrer la Candidature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
