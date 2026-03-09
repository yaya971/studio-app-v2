"use client";

import React, { useState, useEffect } from 'react';
import { Folder, Plus, Loader2, FileText, Edit, Trash2, ListMusic } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ProjetsPage() {
  const [projets, setProjets] = useState<any[]>([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le Projet
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // NOUVEAU : États pour la Tracklist
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newSongTitle, setNewSongTitle] = useState('');

  const [currentArtiste, setCurrentArtiste] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artiste_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    let loggedInArtiste = null;
    if (session) {
      const { data } = await supabase.from('artistes').select('id, nom').eq('user_id', session.user.id).single();
      if (data) loggedInArtiste = data;
    }
    setCurrentArtiste(loggedInArtiste);

    // On récupère les projets ET on inclut leurs chansons
    let projetsQuery = supabase.from('projets').select('*, artistes(nom), chansons(*)').order('created_at', { ascending: false });
    let artistesQuery = supabase.from('artistes').select('id, nom').order('nom', { ascending: true });

    if (loggedInArtiste) {
      projetsQuery = projetsQuery.eq('artiste_id', loggedInArtiste.id);
      artistesQuery = artistesQuery.eq('id', loggedInArtiste.id);
    }

    const { data: projetsData } = await projetsQuery;
    const { data: artistesData } = await artistesQuery;
    
    if (projetsData) {
      // On trie les chansons de la plus ancienne à la plus récente
      projetsData.forEach(p => {
        if (p.chansons) {
          p.chansons.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
      });
      setProjets(projetsData);
    }
    if (artistesData) setArtistes(artistesData);
    
    setLoading(false);
  };

  // --- ACTIONS PROJETS ---
  const openNewModal = () => {
    setFormData({ title: '', description: '', artiste_id: currentArtiste ? currentArtiste.id : '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (projet: any) => {
    setFormData({ title: projet.title, description: projet.description || '', artiste_id: projet.artiste_id || '' });
    setEditingId(projet.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ? \n⚠️ Sessions et chansons seront perdues !`)) {
      const { error } = await supabase.from('projets').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingId) {
      const { error } = await supabase.from('projets').update(formData).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchData(); }
    } else {
      const { error } = await supabase.from('projets').insert([formData]);
      if (!error) { setIsModalOpen(false); fetchData(); }
    }
    setIsSubmitting(false);
  };

  // --- ACTIONS CHANSONS (TRACKLIST) ---
  const addChanson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle || !activeProjectId) return;
    
    const { error } = await supabase.from('chansons').insert([{ titre: newSongTitle, project_id: activeProjectId }]);
    if (!error) {
      setNewSongTitle('');
      fetchData(); // On recharge les données pour afficher le nouveau titre
    }
  };

  const updateChansonStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('chansons').update({ status: newStatus }).eq('id', id);
    if (!error) fetchData(); // On recharge pour mettre à jour la barre de progression
  };

  const deleteChanson = async (id: string) => {
    if (window.confirm("Supprimer ce titre de la tracklist ?")) {
      const { error } = await supabase.from('chansons').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const activeProject = projets.find(p => p.id === activeProjectId);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Projets
          </h1>
          <p className="mt-2 text-gray-400">Gérez les productions, albums et singles.</p>
        </div>
        
        <button onClick={openNewModal} className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]">
          <Plus size={20} /> Nouveau projet
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>
      ) : projets.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <Folder className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucun projet</h3>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projets.map((projet) => {
            // Calcul de la progression
            const totalSongs = projet.chansons?.length || 0;
            const completedSongs = projet.chansons?.filter((c: any) => c.status === 'Terminé').length || 0;
            const progressPercentage = totalSongs === 0 ? 0 : Math.round((completedSongs / totalSongs) * 100);

            return (
              <div key={projet.id} className="group flex flex-col justify-between relative rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                
                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                  <button onClick={() => handleEditClick(projet)} className="rounded p-2 text-gray-400 hover:bg-[#4ade80]/20 hover:text-[#4ade80]"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(projet.id, projet.title)} className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-500"><Trash2 size={16} /></button>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3 pr-16">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4ade80]/20 text-[#4ade80]"><Folder size={24} /></div>
                    <div>
                      <h3 className="truncate text-xl font-bold text-white">{projet.title}</h3>
                      <span className="text-sm font-medium text-[#4ade80]">{projet.artistes?.nom || 'Artiste inconnu'}</span>
                    </div>
                  </div>
                  {projet.description && (
                    <div className="mt-4 flex gap-2 text-sm text-gray-400 mb-6">
                      <FileText size={16} className="shrink-0 mt-0.5" /> 
                      <p className="line-clamp-3">{projet.description}</p>
                    </div>
                  )}
                </div>

                {/* Section Avancement et Tracklist */}
                <div className="mt-auto border-t border-gray-800 pt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">{totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                    <span className="font-bold text-[#4ade80]">{progressPercentage}%</span>
                  </div>
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full bg-[#4ade80] shadow-[0_0_10px_#4ade80] transition-all" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <button 
                    onClick={() => { setActiveProjectId(projet.id); setIsTrackModalOpen(true); }}
                    className="w-full flex items-center justify-center gap-2 rounded bg-white/5 py-2 text-sm font-medium text-white transition-all hover:bg-[#4ade80]/20 hover:text-[#4ade80]"
                  >
                    <ListMusic size={16} /> Gérer la Tracklist
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL : Nouveau Projet */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier le projet" : "Nouveau Projet"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Titre du projet *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Artiste associé *</label>
            <select required value={formData.artiste_id} onChange={(e) => setFormData({...formData, artiste_id: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [&>option]:bg-black">
              <option value="">Sélectionnez un artiste...</option>
              {artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" rows={3} />
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>

      {/* MODAL : Tracklist (Chansons) */}
      <Modal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} title={`Tracklist : ${activeProject?.title || ''}`}>
        <div className="space-y-6">
          
          <form onSubmit={addChanson} className="flex gap-2">
            <input 
              type="text" required value={newSongTitle} onChange={(e)=>setNewSongTitle(e.target.value)} 
              placeholder="Titre de la chanson..." 
              className="flex-1 rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" 
            />
            <button type="submit" className="flex items-center justify-center rounded-lg bg-[#4ade80] px-4 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
              <Plus size={20}/>
            </button>
          </form>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
            {activeProject?.chansons?.map((chanson: any) => (
              <div key={chanson.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition-all hover:border-gray-600">
                <span className={`font-medium flex-1 truncate ${chanson.status === 'Terminé' ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {chanson.titre}
                </span>
                <select 
                  value={chanson.status}
                  onChange={(e) => updateChansonStatus(chanson.id, e.target.value)}
                  className={`rounded border px-2 py-1 text-xs focus:outline-none ${
                    chanson.status === 'Terminé' ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 'border-gray-700 bg-black text-gray-300 focus:border-[#4ade80]'
                  }`}
                >
                  <option value="Maquette">Maquette</option>
                  <option value="Enregistrement">Enregistrement</option>
                  <option value="Mixage">Mixage</option>
                  <option value="Mastering">Mastering</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <button onClick={() => deleteChanson(chanson.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
            
            {activeProject?.chansons?.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-8">Aucun titre dans ce projet. Ajoutez votre première maquette !</p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
