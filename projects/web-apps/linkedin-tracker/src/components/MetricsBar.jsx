import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Trophy, 
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { getDaysSince } from '../constants';

export default function MetricsBar({ applications = [], onFilterByFollowUp }) {
  const total = applications.length;

  const interviews = applications.filter(a => 
    ['phone_screen', 'tech_assessment', 'final_interview'].includes(a.status)
  ).length;

  const offers = applications.filter(a => a.status === 'offer').length;

  // Follow-ups needed: applied or reviewing and > 7 days since last activity or applied date
  const needsFollowUp = applications.filter(a => {
    if (['offer', 'rejected'].includes(a.status)) return false;
    const days = getDaysSince(a.lastActivityDate || a.appliedDate);
    return days >= 7;
  });

  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      marginBottom: 24
    }}>
      {/* Metric 1: Total Candidatures */}
      <div className="glass-panel" style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Candidatures
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4, color: 'var(--text-main)' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(210, 95%, 65%)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Toutes plateformes & LinkedIn</span>
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'hsla(210, 95%, 54%, 0.15)',
          border: '1px solid hsla(210, 95%, 54%, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Briefcase size={22} color="hsl(210, 95%, 54%)" />
        </div>
      </div>

      {/* Metric 2: Taux de Réponse */}
      <div className="glass-panel" style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Taux de Conversion
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4, color: 'hsl(154, 75%, 48%)' }}>
            {responseRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {interviews + offers} réponses positives
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'hsla(154, 75%, 48%, 0.15)',
          border: '1px solid hsla(154, 75%, 48%, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingUp size={22} color="hsl(154, 75%, 48%)" />
        </div>
      </div>

      {/* Metric 3: Entretiens Actifs */}
      <div className="glass-panel" style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entretiens en Cours
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4, color: 'hsl(270, 75%, 66%)' }}>
            {interviews}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            RH, Tests & Étape Finale
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'hsla(270, 75%, 66%, 0.15)',
          border: '1px solid hsla(270, 75%, 66%, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calendar size={22} color="hsl(270, 75%, 66%)" />
        </div>
      </div>

      {/* Metric 4: Offres Reçues */}
      <div className="glass-panel" style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: offers > 0 ? 'linear-gradient(135deg, hsla(154, 75%, 48%, 0.12), hsla(224, 40%, 13%, 0.8))' : 'var(--bg-glass)'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Offres Reçues
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4, color: 'hsl(154, 75%, 52%)' }}>
            {offers}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(154, 75%, 48%)', marginTop: 2, fontWeight: 500 }}>
            {offers > 0 ? '🎉 Propositions prêtes à négocier' : 'En phase d\'entretiens'}
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: 'hsla(154, 75%, 48%, 0.2)',
          border: '1px solid hsla(154, 75%, 48%, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy size={22} color="hsl(154, 75%, 48%)" />
        </div>
      </div>

      {/* Metric 5: Relances Recommandées */}
      <div 
        className="glass-panel" 
        onClick={() => onFilterByFollowUp && onFilterByFollowUp()}
        style={{
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: needsFollowUp.length > 0 ? 'pointer' : 'default',
          border: needsFollowUp.length > 0 ? '1px solid hsla(38, 92%, 52%, 0.35)' : '1px solid var(--border-subtle)',
          background: needsFollowUp.length > 0 ? 'linear-gradient(135deg, hsla(38, 92%, 52%, 0.08), hsla(224, 40%, 13%, 0.8))' : 'var(--bg-glass)'
        }}
        title={needsFollowUp.length > 0 ? 'Cliquez pour filtrer les candidatures à relancer' : ''}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            À Relancer
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: 4, color: needsFollowUp.length > 0 ? 'hsl(38, 92%, 52%)' : 'var(--text-dim)' }}>
            {needsFollowUp.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: needsFollowUp.length > 0 ? 'hsl(38, 92%, 55%)' : 'var(--text-dim)', marginTop: 2 }}>
            {needsFollowUp.length > 0 ? '⚠️ Sans réponse depuis +7 jours' : 'À jour sur vos relances'}
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: needsFollowUp.length > 0 ? 'hsla(38, 92%, 52%, 0.18)' : 'var(--bg-card)',
          border: '1px solid hsla(38, 92%, 52%, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={22} color={needsFollowUp.length > 0 ? 'hsl(38, 92%, 52%)' : 'var(--text-dim)'} />
        </div>
      </div>
    </div>
  );
}
