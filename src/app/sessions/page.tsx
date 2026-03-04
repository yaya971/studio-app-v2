"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { Projet } from '@/lib/types';
import Modal from '@/components/Modal';
import { Plus, Mic2, Loader2, Save } from 'lucide-react';

interface SessionWithProject {
  id: string;
  project_id: string;
  artist_id: string;
  date: string;
  notes?: string;
  status: string;
  projets?: {
    name: string;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithProject[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<'Admin' | 'Artiste' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [newProjectId, setNewProjectId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newArtistId, setNewArtistId] = useState('');

  // Notes state
  const [selectedSession, setSelectedSession] = useState<SessionWithProject | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const userRole = user.email?.includes('admin') ? 'Admin' : 'Artiste';
        setRole(userRole);
        
        try {
          const [sessionsData, projetsData] = await Promise.all([
            db.sessions.getAll(userRole, user.id),
            db.projets.getAll(userRole, user.id)
          ]);
          setSessions(sessionsData);
          setProjets(projetsData);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.sessions.create({
        project_id: newProjectId,
        date: newDate,
        artist_id: newArtistId || userId || '',
        status: 'Prévue',
        notes: ''
      });
      const updatedSessions = await db.sessions.getAll(role!, userId!);
      setSessions(updatedSessions);
      setIsModalOpen(false);
      setNewProjectId('');
      setNewDate('');
      setNewArtistId('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSession) return;
    setSavingNotes(true);
    try {
      await db.sessions.updateNotes(selectedSession.id, notes);
      setSessions(sessions.map(s => s.id === selectedSession.id ? { ...s, notes } : s));
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neon-green" size={48} /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4">
        <header className="flex justify-between items-center sticky top-0 bg-black py-2 z-10">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="neon-text">Sessions</span>
          </h1>
          {role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-neon-green text-black rounded-lg hover:neon-glow transition-all"
            >
              <Plus size={20} />
            </button>
          )}
        </header>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group
                ${selectedSession?.id === session.id 
                  ? 'border-neon-green bg-neon-green/5 neon-glow' 
                  : 'border-white/5 hover:border-neon-green/30 bg-white/5'
                }`}
              onClick={() => {
                setSelectedSession(session);
                setNotes(session.notes || '');
              }}
            >
              <Link 
                href={`/sessions/${session.id}`}
                className="absolute top-4 right-4 text-[10px] text-neon-green opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
              >
                Détails →
              </Link>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-neon-green uppercase">{session.status}</span>
                <span className="text-xs text-slate-500">{new Date(session.date).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-white mb-1">{session.projets?.name || "Projet Inconnu"}</h4>
              <p className="text-xs text-slate-400">Artiste: {session.artist_id.slice(0, 8)}...</p>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-center text-slate-500 py-10 italic">Aucune session.</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6 h-full">
        {selectedSession ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Notes de Session</h2>
                <p className="text-slate-400 text-sm">{selectedSession.projets?.name} - {new Date(selectedSession.date).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:neon-glow transition-all disabled:opacity-50"
              >
                {savingNotes ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Sauvegarder
              </button>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prenez vos notes ici..."
              className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none resize-none"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-2xl">
            <Mic2 size={64} className="mb-4 opacity-20" />
            <p>Sélectionnez une session pour voir les notes.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Programmer une session"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Projet</label>
            <select 
              required
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none"
            >
              <option value="" className="bg-black">Sélectionner un projet</option>
              {projets.map(p => (
                <option key={p.id} value={p.id} className="bg-black">{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
            <input 
              type="datetime-local" 
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">ID de l&apos;artiste</label>
            <input 
              type="text" 
              value={newArtistId}
              onChange={(e) => setNewArtistId(e.target.value)}
              placeholder="Laisser vide pour votre propre ID"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:neon-glow-strong transition-all mt-4"
          >
            Programmer la session
          </button>
        </form>
      </Modal>
    </div>
  );
}
