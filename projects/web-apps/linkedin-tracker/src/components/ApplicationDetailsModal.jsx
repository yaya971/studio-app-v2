import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  Check, 
  Copy, 
  Trash2, 
  MessageSquare, 
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { STATUS_CONFIG, STATUS_LIST, getDaysSince, formatDateFr } from '../constants';

export default function ApplicationDetailsModal({ 
  application, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete 
}) {
  if (!isOpen || !application) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...application });
  const [copiedRelance, setCopiedRelance] = useState(false);
  const [showRelanceBox, setShowRelanceBox] = useState(false);

  const status = STATUS_CONFIG[formData.status] || STATUS_CONFIG.applied;
  const daysSince = getDaysSince(formData.lastActivityDate || formData.appliedDate);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(formData.id, formData);
    setIsEditing(false);
  };

  // Generate tailored follow-up message for LinkedIn
  const recruiter = formData.recruiterName ? formData.recruiterName.split(' ')[0] : 'Bonjour';
  const followUpTemplate = `Bonjour ${recruiter},

J'espère que vous allez bien.

Je me permets de vous contacter suite à ma candidature déposée le ${formatDateFr(formData.appliedDate)} pour le poste de ${formData.title} chez ${formData.company}.

Très motivé par les projets de votre équipe, je souhaitais savoir où en était l'évaluation des profils pour cette opportunité. Je reste à votre entière disposition pour échanger de vive voix sur la manière dont mes compétences peuvent s'intégrer à vos enjeux actuels.

Bien cordialement,
[Votre Prénom & Nom]
[Lien vers mon profil LinkedIn]`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(followUpTemplate);
    setCopiedRelance(true);
    setTimeout(() => setCopiedRelance(false), 2500);
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
          maxWidth: 680,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, hsl(210, 95%, 54%), hsl(220, 90%, 40%))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              {(formData.company || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {formData.company}
                </h3>
                {formData.linkedinUrl && (
                  <a
                    href={formData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Voir l'offre sur LinkedIn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.75rem',
                      color: 'hsl(210, 95%, 65%)'
                    }}
                  >
                    <span>LinkedIn</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {formData.title}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: isEditing ? 'var(--accent-linkedin)' : 'var(--bg-card)',
                color: isEditing ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
            <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', padding: 6 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {isEditing ? (
            /* Editing form */
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Intitulé du poste
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Statut du pipeline
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  >
                    {STATUS_LIST.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Salaire estimé / proposé
                  </label>
                  <input
                    type="text"
                    value={formData.salary || ''}
                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Contact Recruteur (Nom & Rôle)
                  </label>
                  <input
                    type="text"
                    value={formData.recruiterName || ''}
                    onChange={e => setFormData({ ...formData, recruiterName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Prochaine Étape / Échéance
                  </label>
                  <input
                    type="text"
                    value={formData.nextStep || ''}
                    onChange={e => setFormData({ ...formData, nextStep: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Notes & Retours d'entretien
                </label>
                <textarea
                  rows={4}
                  value={formData.notes || ''}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-linkedin)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <Save size={14} />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          ) : (
            /* Read-only view with interactive features */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Pipeline Status Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: status.bgColor,
                border: `1px solid ${status.borderColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: status.color }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: status.color }}>
                      {status.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {status.desc}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Postulé le {formatDateFr(formData.appliedDate)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: daysSince >= 7 ? 'hsl(38, 92%, 55%)' : 'var(--text-muted)', fontWeight: 500 }}>
                    {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince} jour(s)`}
                  </div>
                </div>
              </div>

              {/* Grid with Key Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 2 }}>Localisation & Mode</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {formData.location} ({formData.remoteType === 'full_remote' ? 'Remote' : formData.remoteType === 'hybride' ? 'Hybride' : 'Sur site'})
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 2 }}>Salaire / Taux</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(154, 75%, 48%)' }}>
                    {formData.salary || 'Non précisé'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 2 }}>Recruteur / Contact</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {formData.recruiterName || 'Non renseigné'}
                  </div>
                </div>
              </div>

              {/* Next Step Box */}
              {formData.nextStep && (
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--accent-linkedin)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(210, 95%, 65%)', marginBottom: 2 }}>
                    PROCHAINE ACTION
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {formData.nextStep}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                  NOTES DE CANDIDATURE
                </h4>
                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {formData.notes || 'Aucune note pour le moment.'}
                </div>
              </div>

              {/* Smart Relance LinkedIn Generator */}
              <div style={{
                background: 'linear-gradient(135deg, hsla(210, 95%, 54%, 0.08), hsla(224, 40%, 13%, 0.8))',
                border: '1px solid hsla(210, 95%, 54%, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} color="hsl(210, 95%, 65%)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Modèle de message de relance LinkedIn
                    </span>
                  </div>
                  <button
                    onClick={() => setShowRelanceBox(!showRelanceBox)}
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent-linkedin)',
                      background: 'transparent',
                      fontWeight: 600
                    }}
                  >
                    {showRelanceBox ? 'Masquer' : 'Afficher le modèle'}
                  </button>
                </div>

                {showRelanceBox && (
                  <div className="animate-fade-in" style={{ marginTop: 12 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Message soigné et professionnel prêt à être envoyé sur LinkedIn :
                    </p>
                    <pre style={{
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      fontSize: '0.78rem',
                      lineHeight: 1.5,
                      color: 'var(--text-main)',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit'
                    }}>
                      {followUpTemplate}
                    </pre>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        onClick={copyToClipboard}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: copiedRelance ? 'hsl(154, 75%, 48%)' : 'var(--accent-linkedin)',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {copiedRelance ? (
                          <>
                            <Check size={14} />
                            <span>Copié dans le presse-papier !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copier pour LinkedIn</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}>
          <button
            onClick={() => {
              if (window.confirm(`Supprimer la candidature chez ${formData.company} ?`)) {
                onDelete(formData.id);
                onClose();
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'hsl(352, 80%, 65%)',
              fontSize: '0.8rem'
            }}
          >
            <Trash2 size={14} />
            <span>Supprimer</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
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
