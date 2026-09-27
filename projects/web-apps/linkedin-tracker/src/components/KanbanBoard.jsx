import React from 'react';
import { STATUS_LIST } from '../constants';
import ApplicationCard from './ApplicationCard';
import { Plus } from 'lucide-react';

export default function KanbanBoard({ 
  applications = [], 
  onSelectApplication, 
  onStatusChange, 
  onDeleteApplication,
  onAddNewInStatus
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16,
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: 24
    }}>
      {STATUS_LIST.map((status) => {
        const columnApps = applications.filter(a => a.status === status.id);

        return (
          <div 
            key={status.id}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 280,
              maxHeight: 'calc(100vh - 270px)',
              overflow: 'hidden'
            }}
          >
            {/* Column Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: status.color,
                  boxShadow: `0 0 8px ${status.color}`
                }} />
                <h3 style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.01em'
                }}>
                  {status.label}
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 9999,
                  background: status.bgColor,
                  color: status.color,
                  border: `1px solid ${status.borderColor}`
                }}>
                  {columnApps.length}
                </span>
              </div>

              {/* Add button inside column */}
              <button
                onClick={() => onAddNewInStatus(status.id)}
                title={`Ajouter une candidature directement en "${status.label}"`}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-dim)';
                }}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Column Body: Cards List */}
            <div style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              overflowY: 'auto',
              flex: 1,
              minHeight: 120
            }}>
              {columnApps.length === 0 ? (
                <div style={{
                  padding: '28px 16px',
                  textAlign: 'center',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  margin: '4px 0'
                }}>
                  Aucune candidature dans cette colonne
                </div>
              ) : (
                columnApps.map(app => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onSelect={onSelectApplication}
                    onStatusChange={onStatusChange}
                    onDelete={onDeleteApplication}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
