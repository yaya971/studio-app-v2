import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  User, 
  ChevronRight, 
  Trash2, 
  MoreVertical,
  Calendar,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PhoneCall,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATUS_CONFIG, STATUS_LIST, getDaysSince, formatDateFr } from '../constants';

export default function ApplicationCard({ 
  app, 
  onSelect, 
  onStatusChange, 
  onDelete 
}) {
  const daysSince = getDaysSince(app.appliedDate);
  const isPending = ['applied', 'reviewing'].includes(app.status);
  const hasPositiveResponse = ['phone_screen', 'tech_assessment', 'final_interview', 'offer'].includes(app.status);
  const isRejected = app.status === 'rejected';

  // Stale warning: if pending and >= 7 days
  const isStale = isPending && daysSince >= 7;

  const handleQuickStatus = (e, newStatus) => {
    e.stopPropagation();
    if (newStatus === 'offer') {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    onStatusChange(app.id, newStatus);
  };

  const getCompanyInitial = (name) => {
    return (name || 'C').charAt(0).toUpperCase();
  };

  const getCompanyGradient = (name) => {
    const charCode = (name || 'A').charCodeAt(0);
    const hues = [210, 260, 320, 160, 40, 190];
    const hue = hues[charCode % hues.length];
    return `linear-gradient(135deg, hsl(${hue}, 80%, 45%), hsl(${hue + 30}, 85%, 35%))`;
  };

  return (
    <div 
      onClick={() => onSelect(app)}
      className="glass-panel"
      style={{
        padding: '16px',
        background: 'var(--bg-card)',
        border: isStale 
          ? '1.5px solid hsl(38, 92%, 52%)' 
          : hasPositiveResponse 
            ? '1.5px solid hsla(154, 75%, 48%, 0.4)' 
            : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Header: Company Avatar & Job link */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: getCompanyGradient(app.company),
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            flexShrink: 0
          }}>
            {getCompanyInitial(app.company)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: 800, 
              color: 'var(--text-main)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {app.company}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {app.location || 'France'} • {app.contract || 'CDI'}
            </div>
          </div>
        </div>

        {app.linkedinUrl && (
          <a
            href={app.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="Voir l'offre sur LinkedIn"
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              background: 'hsla(210, 95%, 54%, 0.12)',
              color: 'hsl(210, 95%, 65%)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem',
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            <span>LinkedIn</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Job Title */}
      <div>
        <h4 style={{
          fontSize: '0.96rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.35,
          fontFamily: 'var(--font-heading)'
        }}>
          {app.title}
        </h4>
      </div>

      {/* --- VISUEL 1 : DEPUIS COMBIEN DE TEMPS (TEMPS ÉCOULÉ) --- */}
      <div style={{
        background: isStale ? 'hsla(38, 92%, 52%, 0.12)' : 'var(--bg-surface)',
        border: isStale ? '1px solid hsla(38, 92%, 52%, 0.35)' : '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: isStale ? 'hsl(38, 92%, 55%)' : 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>
            {daysSince === 0 ? "Postulé aujourd'hui" : `Postulé il y a ${daysSince} jour(s)`}
          </span>
        </div>

        {isStale && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            background: 'hsl(38, 92%, 52%)',
            color: '#1a1000'
          }}>
            ⚠️ Relancer !
          </span>
        )}
      </div>

      {/* --- VISUEL 2 : RÉPONSE : OUI / NON --- */}
      <div style={{
        padding: '8px 10px',
        borderRadius: 8,
        background: isPending 
          ? 'hsla(220, 20%, 20%, 0.5)' 
          : hasPositiveResponse 
            ? 'hsla(154, 75%, 48%, 0.12)' 
            : 'hsla(352, 60%, 55%, 0.12)',
        border: isPending 
          ? '1px dashed var(--border-medium)' 
          : hasPositiveResponse 
            ? '1px solid hsla(154, 75%, 48%, 0.3)' 
            : '1px solid hsla(352, 60%, 55%, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem'
      }}>
        <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          Réponse recruteur :
        </span>

        {isPending && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 700,
            color: 'hsl(38, 92%, 55%)'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(38, 92%, 52%)' }} />
            NON (En attente)
          </span>
        )}

        {hasPositiveResponse && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 700,
            color: 'hsl(154, 75%, 52%)'
          }}>
            <CheckCircle2 size={13} color="hsl(154, 75%, 48%)" />
            OUI (Entretien / Offre)
          </span>
        )}

        {isRejected && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 700,
            color: 'hsl(352, 80%, 65%)'
          }}>
            <XCircle size={13} color="hsl(352, 80%, 65%)" />
            OUI (Refusé)
          </span>
        )}
      </div>

      {/* --- VISUEL 3 : ORGANISATION EN 1 CLIC (BOUTONS D'ACTION RAPIDE) --- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        paddingTop: 8,
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {isPending ? (
          <>
            <button
              onClick={(e) => handleQuickStatus(e, 'phone_screen')}
              title="Le recruteur a répondu : Entretien calé !"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '6px',
                borderRadius: 6,
                background: 'hsla(154, 75%, 48%, 0.15)',
                color: 'hsl(154, 75%, 55%)',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid hsla(154, 75%, 48%, 0.3)'
              }}
            >
              <PhoneCall size={12} />
              <span>Entretien</span>
            </button>

            <button
              onClick={(e) => handleQuickStatus(e, 'rejected')}
              title="Réponse négative reçue"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '6px',
                borderRadius: 6,
                background: 'hsla(352, 80%, 62%, 0.1)',
                color: 'hsl(352, 80%, 65%)',
                fontSize: '0.74rem',
                fontWeight: 600,
                border: '1px solid hsla(352, 80%, 62%, 0.25)'
              }}
            >
              <XCircle size={12} />
              <span>Refus</span>
            </button>
          </>
        ) : hasPositiveResponse ? (
          <>
            <button
              onClick={(e) => handleQuickStatus(e, 'offer')}
              title="Offre d'embauche reçue !"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '6px',
                borderRadius: 6,
                background: 'hsla(154, 75%, 48%, 0.2)',
                color: 'hsl(154, 75%, 52%)',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid hsl(154, 75%, 48%)'
              }}
            >
              <span>🎉 Offre Reçue</span>
            </button>

            <button
              onClick={(e) => handleQuickStatus(e, 'rejected')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: 'transparent',
                color: 'var(--text-dim)',
                fontSize: '0.74rem'
              }}
            >
              <span>Refus</span>
            </button>
          </>
        ) : (
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', width: '100%' }}>
            Candidature archivée
          </div>
        )}
      </div>
    </div>
  );
}
