"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { Projet } from '@/lib/types';
import Modal from '@/components/Modal';
import { Plus, Folder, Loader2 } from 'lucide-react';

export default function ProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<'Admin' | 'Artiste' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newArtistId, setNewArtistId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const userRole = user.email?.includes('admin') ? 'Admin' : 'Artiste';
        setRole(userRole);
        
        try {
          const data = await db.projets.getAll(userRole, user.id);
          setProjets(data);
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
      const newProjet = await db.projets.create({
        name: newName,
        description: newDesc,
        artist_id: newArtistId || userId || '',
        status: 'En cours',
      });
      setProjets([...projets, newProjet]);
      setIsModalOpen(false);
      setNewName('');
      setNewDesc('');
      setNewArtistId('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neon-green" size={48} /></div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Mes <span className="neon-text">Projets</span>
          </h1>
          <p className="text-slate-400">Gérez vos productions et albums.</p>
        </div>
        {role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:neon-glow transition-all"
          >
            <Plus size={20} />
            Nouveau Projet
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projets.map((projet) => (
          <div key={projet.id} className="p-6 rounded-2xl bg-black border border-white/5 hover:neon-border transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-neon-green/10 text-neon-green">
                <Folder size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{projet.name}</h3>
                <span className="text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                  {projet.status}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">
              {projet.description || "Aucune description fournie."}
            </p>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>ID Artiste: {projet.artist_id.slice(0, 8)}...</span>
              <span>{new Date(projet.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {projets.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-500">Aucun projet trouvé.</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Créer un nouveau projet"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nom du projet</label>
            <input 
              type="text" 
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none h-24"
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
            Créer le projet
          </button>
        </form>
      </Modal>
    </div>
  );
}
