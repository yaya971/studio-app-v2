import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Trash2,
  Edit3
} from 'lucide-react';
import { STATUS_CONFIG, STATUS_LIST, getDaysSince, formatDateFr } from '../constants';

export default function ListView({ 
  applications = [], 
  onSelectApplication, 
  onStatusChange, 
  onDeleteApplication 
}) {
  if (applications.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Aucune candidature ne correspond à vos filtres.
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
        <thead>
          <tr style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-dim)',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <th style={{ padding: '14px 18px' }}>Entreprise & Poste</th>
            <th style={{ padding: '14px 18px' }}>Statut</th>
            <th style={{ padding: '14px 18px' }}>Date</th>
            <th style={{ padding: '14px 18px' }}>Type & Salaire</th>
            <th style={{ padding: '14px 18px' }}>Prochaine étape</th>
            <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => {
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const days = getDaysSince(app.lastActivityDate || app.appliedDate);
            const isStale = !['offer', 'rejected'].includes(app.status) && days >= 7;

            return (
              <tr 
                key={app.id}
                onClick={() => onSelectApplication(app)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Company & Title */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--accent-linkedin)'
                    }}>
                      {(app.company || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {app.company}
                        {app.linkedinUrl && (
                          <a 
                            href={app.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: 'hsl(210, 95%, 65%)' }}
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {app.title}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td style={{ padding: '14px 18px' }} onClick={e => e.stopPropagation()}>
                  <select
                    value={app.status}
                    onChange={e => onStatusChange(app.id, e.target.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 9999,
                      background: status.bgColor,
                      color: status.color,
                      border: `1px solid ${status.borderColor}`,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {STATUS_LIST.map(s => (
                      <option key={s.id} value={s.id} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Date & Stale Indicator */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{formatDateFr(app.appliedDate)}</span>
                    {isStale && (
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'hsla(38, 92%, 52%, 0.2)',
                        color: 'hsl(38, 92%, 55%)',
                        fontWeight: 600
                      }}>
                        {days}j
                      </span>
                    )}
                  </div>
                </td>

                {/* Type & Salary */}
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    {app.salary || 'Non communiqué'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {app.contract} • {app.remoteType === 'full_remote' ? 'Remote' : app.remoteType === 'hybride' ? 'Hybride' : 'Sur site'}
                  </div>
                </td>

                {/* Next Step */}
                <td style={{ padding: '14px 18px', maxWidth: 260 }}>
                  <div style={{
                    fontSize: '0.78rem',
                    color: app.nextStep ? 'var(--text-muted)' : 'var(--text-dim)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {app.nextStep || '—'}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 18px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                    <button
                      onClick={() => onSelectApplication(app)}
                      title="Modifier ou voir détails"
                      style={{
                        padding: 6,
                        borderRadius: 6,
                        background: 'transparent',
                        color: 'var(--text-dim)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--bg-surface)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-dim)';
                      }}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      title="Supprimer la candidature"
                      style={{
                        padding: 6,
                        borderRadius: 6,
                        background: 'transparent',
                        color: 'var(--text-dim)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'hsla(352, 80%, 62%, 0.15)';
                        e.currentTarget.style.color = 'hsl(352, 80%, 65%)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-dim)';
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
