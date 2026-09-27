import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Trophy, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { getDaysSince } from '../constants';

export default function MetricsBar({ applications = [], onFilterByFollowUp }) {
  const total = applications.length;

  // Has response (Yes): phone screen, tech assessment, final interview, offer, rejected
  const responsesReceived = applications.filter(a => 
    ['phone_screen', 'tech_assessment', 'final_interview', 'offer', 'rejected'].includes(a.status)
  ).length;

  // Pending response (No): applied or reviewing
  const pendingResponses = applications.filter(a => 
    ['applied', 'reviewing'].includes(a.status)
  ).length;

  const interviewsAndOffers = applications.filter(a => 
    ['phone_screen', 'tech_assessment', 'final_interview', 'offer'].includes(a.status)
  ).length;

  // Needs follow-up: pending and >= 7 days
  const needsFollowUp = applications.filter(a => {
    if (!['applied', 'reviewing'].includes(a.status)) return false;
    const days = getDaysSince(a.appliedDate);
    return days >= 7;
  });

  const responseRate = total > 0 ? Math.round((responsesReceived / total) * 100) : 0;
  const successRate = total > 0 ? Math.round((interviewsAndOffers / total) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 14,
      marginBottom: 24
    }}>
      {/* 1. Total Postulé */}
      <div className="glass-panel" style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Candidatures
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'var(--text-main)' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'hsl(210, 95%, 65%)', marginTop: 2 }}>
            Recherche LinkedIn active
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'hsla(210, 95%, 54%, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-linkedin)'
        }}>
          <Briefcase size={20} />
        </div>
      </div>

      {/* 2. Réponse : NON (En attente) */}
      <div className="glass-panel" style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(38, 92%, 55%)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Réponse : NON (En attente)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'hsl(38, 92%, 52%)' }}>
            {pendingResponses}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 2 }}>
            {total > 0 ? `${Math.round((pendingResponses / total) * 100)}% de vos candidatures` : 'Aucune'}
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'hsla(38, 92%, 52%, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(38, 92%, 52%)'
        }}>
          <Clock size={20} />
        </div>
      </div>

      {/* 3. Réponse : OUI (Retours reçus) */}
      <div className="glass-panel" style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-card)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(154, 75%, 48%)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Réponse : OUI ({responseRate}%)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: 'hsl(154, 75%, 48%)' }}>
            {responsesReceived}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'hsl(154, 75%, 52%)', marginTop: 2, fontWeight: 500 }}>
            {interviewsAndOffers} entretiens & offres
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'hsla(154, 75%, 48%, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(154, 75%, 48%)'
        }}>
          <CheckCircle2 size={20} />
        </div>
      </div>

      {/* 4. À relancer (> 7 jours) */}
      <div 
        className="glass-panel"
        onClick={() => onFilterByFollowUp && onFilterByFollowUp()}
        style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: needsFollowUp.length > 0 ? 'pointer' : 'default',
          background: needsFollowUp.length > 0 ? 'hsla(38, 92%, 52%, 0.08)' : 'var(--bg-card)',
          border: needsFollowUp.length > 0 ? '1.5px solid hsl(38, 92%, 52%)' : '1px solid var(--border-subtle)'
        }}
        title="Cliquez pour filtrer les candidatures sans réponse à relancer"
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'hsl(38, 92%, 55%)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Relances prioritaires
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: 4, color: needsFollowUp.length > 0 ? 'hsl(38, 92%, 52%)' : 'var(--text-dim)' }}>
            {needsFollowUp.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: needsFollowUp.length > 0 ? 'hsl(38, 92%, 55%)' : 'var(--text-dim)', marginTop: 2 }}>
            {needsFollowUp.length > 0 ? '⚠️ Sans réponse depuis +7j (Cliquez)' : 'Aucun retard'}
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: needsFollowUp.length > 0 ? 'hsla(38, 92%, 52%, 0.2)' : 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: needsFollowUp.length > 0 ? 'hsl(38, 92%, 52%)' : 'var(--text-dim)'
        }}>
          <AlertTriangle size={20} />
        </div>
      </div>
    </div>
  );
}
