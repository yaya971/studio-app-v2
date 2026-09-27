import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  RotateCcw,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { REMOTE_TYPES } from '../constants';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  remoteFilter,
  setRemoteFilter,
  contractFilter,
  setContractFilter,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onResetDemo,
  isFollowUpActive,
  setIsFollowUpActive
}) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 20
    }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: '1 1 280px',
        maxWidth: 420,
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: 14,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
          color: 'var(--text-dim)'
        }}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher par poste, entreprise, tag..." 
          style={{
            width: '100%',
            padding: '10px 38px 10px 40px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.88rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-linkedin)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 12,
              background: 'transparent',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Dropdowns & Toggles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
        {/* Follow up toggle pill */}
        <button
          onClick={() => setIsFollowUpActive(!isFollowUpActive)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            background: isFollowUpActive ? 'hsla(38, 92%, 52%, 0.2)' : 'var(--bg-card)',
            color: isFollowUpActive ? 'hsl(38, 92%, 55%)' : 'var(--text-muted)',
            border: isFollowUpActive ? '1px solid hsl(38, 92%, 52%)' : '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          <span>⏳ À relancer (&gt;7j)</span>
        </button>

        {/* Remote Type Filter */}
        <select
          value={remoteFilter}
          onChange={e => setRemoteFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tous modes (Remote / Hybride)</option>
          <option value="full_remote">Full Remote</option>
          <option value="hybride">Hybride</option>
          <option value="sur_site">Sur site</option>
        </select>

        {/* Contract Type Filter */}
        <select
          value={contractFilter}
          onChange={e => setContractFilter(e.target.value)}
          style={{
            padding: '8px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tous contrats</option>
          <option value="CDI">CDI</option>
          <option value="Freelance">Freelance</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '8px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="date_desc">Plus récentes d'abord</option>
          <option value="date_asc">Plus anciennes</option>
          <option value="company_asc">Entreprise (A-Z)</option>
        </select>

        {/* View Toggle: Kanban vs List */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 3
        }}>
          <button
            onClick={() => setViewMode('kanban')}
            title="Vue Kanban par statut"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--accent-linkedin)' : 'var(--text-dim)',
              border: viewMode === 'kanban' ? '1px solid var(--border-medium)' : 'none'
            }}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Vue Liste tabulaire"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'list' ? 'var(--accent-linkedin)' : 'var(--text-dim)',
              border: viewMode === 'list' ? '1px solid var(--border-medium)' : 'none'
            }}
          >
            <List size={16} />
          </button>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={onResetDemo}
          title="Recharger des exemples réalistes de candidatures"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--text-dim)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.borderColor = 'var(--border-medium)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-dim)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <RotateCcw size={14} />
          <span>Réinitialiser Démo</span>
        </button>
      </div>
    </div>
  );
}
