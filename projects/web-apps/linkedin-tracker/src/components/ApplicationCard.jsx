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
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATUS_CONFIG, STATUS_LIST, getDaysSince, formatDateFr } from '../constants';

export default function ApplicationCard({ 
  app, 
  onSelect, 
  onStatusChange, 
  onDelete 
}) {
  const daysSince = getDaysSince(app.lastActivityDate || app.appliedDate);
  const isStale = !['offer', 'rejected'].includes(app.status) && daysSince >= 7;

  // Find next status in pipeline
  const currentIndex = STATUS_LIST.findIndex(s => s.id === app.status);
  const nextStatus = currentIndex < STATUS_LIST.length - 2 ? STATUS_LIST[currentIndex + 1] : null;

  const handleNextStatus = (e) => {
    e.stopPropagation();
    if (!nextStatus) return;

    if (nextStatus.id === 'offer') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onStatusChange(app.id, nextStatus.id);
  };

  const getCompanyInitial = (name) => {
    return (name || 'C').charAt(0).toUpperCase();
  };

  // Generate pleasant gradient based on company name
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
        padding: '14px 16px',
        background: 'var(--bg-card)',
        border: isStale ? '1px solid hsla(38, 92%, 52%, 0.35)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = isStale ? 'hsl(38, 92%, 52%)' : 'var(--border-medium)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = isStale ? 'hsla(38, 92%, 52%, 0.35)' : 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Header: Company Avatar, Name, LinkedIn link & Stale badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: getCompanyGradient(app.company),
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            flexShrink: 0
          }}>
            {getCompanyInitial(app.company)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              color: 'var(--text-main)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {app.company}
            </div>
            <div style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-dim)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4 
            }}>
              <MapPin size={11} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {app.location || 'France'}
              </span>
            </div>
          </div>
        </div>

        {/* External LinkedIn Link */}
        {app.linkedinUrl && (
          <a
            href={app.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="Ouvrir l'offre sur LinkedIn"
            style={{
              padding: 5,
              borderRadius: 6,
              background: 'hsla(210, 95%, 54%, 0.1)',
              color: 'hsl(210, 95%, 65%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Job Title */}
      <div>
        <h4 style={{
          fontSize: '0.92rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          lineHeight: 1.35,
          fontFamily: 'var(--font-heading)'
        }}>
          {app.title}
        </h4>
      </div>

      {/* Tags / Meta: Contract, Remote & Salary */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {app.contract && (
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: 4,
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>
            {app.contract}
          </span>
        )}
        {app.remoteType && (
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: 4,
            background: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>
            {app.remoteType === 'full_remote' ? 'Remote 100%' : app.remoteType === 'hybride' ? 'Hybride' : 'Sur site'}
          </span>
        )}
        {app.salary && (
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: 4,
            background: 'hsla(154, 75%, 48%, 0.12)',
            color: 'hsl(154, 75%, 52%)',
            fontWeight: 600
          }}>
            {app.salary}
          </span>
        )}
      </div>

      {/* Next Step / Notes snippet */}
      {app.nextStep && (
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)',
          padding: '6px 10px',
          borderRadius: 6,
          borderLeft: '2px solid var(--accent-linkedin)',
          lineHeight: 1.3
        }}>
          <strong style={{ color: 'var(--text-main)' }}>Prochaine étape :</strong> {app.nextStep}
        </div>
      )}

      {/* Recruiter contact if present */}
      {app.recruiterName && (
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'center',
          gap: 5
        }}>
          <User size={12} color="hsl(210, 95%, 65%)" />
          <span>Contact : <strong style={{ color: 'var(--text-muted)' }}>{app.recruiterName}</strong> {app.recruiterRole ? `(${app.recruiterRole})` : ''}</span>
        </div>
      )}

      {/* Footer: Date, Stale alert & Next step button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 2
      }}>
        {/* Date / Stale Warning */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isStale ? (
            <span style={{
              fontSize: '0.72rem',
              color: 'hsl(38, 92%, 52%)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
              <Clock size={12} />
              {daysSince}j (relancer !)
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} />
              {formatDateFr(app.appliedDate)}
            </span>
          )}
        </div>

        {/* Quick action to move to next pipeline step */}
        {nextStatus && (
          <button
            onClick={handleNextStatus}
            title={`Avancer vers "${nextStatus.label}"`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'var(--bg-surface)',
              color: nextStatus.color,
              border: `1px solid ${nextStatus.borderColor}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = nextStatus.bgColor;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
          >
            <span>{nextStatus.label}</span>
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
