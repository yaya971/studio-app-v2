"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Plus, Loader2, FileText, Edit, Trash2, ListMusic, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ProjetsPage() {
  const router = useRouter();
  const [projets, setProjets] = useState<any[]>([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newSongTitle, setNewSongTitle] = useState('');

  const [activeRetoursId, setActiveRetoursId] = useState<string | null>(null);
  const [retoursText, setRetoursText] = useState('');

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
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      let loggedInArtiste = null;
      // maybeSingle() évite que l'application plante si l'Admin n'est pas dans la table "artistes"
      const { data } = await supabase.from('artistes').select('id, nom').eq('user_id', session.user.id).maybeSingle();
      if (data) loggedInArtiste = data;
      
      setCurrentArtiste(loggedInArtiste);

      let projetsQuery = supabase.from('projets').select('*, artistes(nom), chansons(*)').order('created_at', { ascending: false });
      let artistesQuery = supabase.from('artistes').select('id, nom').order('nom', { ascending: true });

      if (loggedInArtiste) {
        projetsQuery = projetsQuery.eq('artiste_id', loggedInArtiste.id);
        artistesQuery = artistesQuery.eq('id', loggedInArtiste.id);
      }

      const { data: projetsData } = await projetsQuery;
      const { data: artistesData } = await artistesQuery;
      
      if (projetsData) {
        projetsData.forEach(p => {
          if (p.chansons) {
            p.chansons.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          }
        });
        setProjets(projetsData);
      }
      if (artistesData) setArtistes(artistesData);

    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      // CEINTURE DE SÉCURITÉ : On arrête de tourner !
      setLoading(false);
    }
  };

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
    
    if (!formData.artiste_id || formData.artiste_id === "") {
      alert("Veuillez sélectionner un artiste dans la liste !");
      setIsSubmitting(false);
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('projets').update(formData).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchData(); }
      else alert("Erreur de modification : " + error.message);
    } else {
      const { error } = await supabase.from('projets').insert([formData]);
      if (!error) { setIsModalOpen(false); fetchData(); }
      else alert("Erreur de création : " + error.message);
    }
    setIsSubmitting(false);
  };

  const addChanson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle || !activeProjectId) return;
    const { error } = await supabase.from('chansons').insert([{ titre: newSongTitle, project_id: activeProjectId }]);
    if (!error) { setNewSongTitle(''); fetchData(); }
  };

  const updateChansonStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('chansons').update({ status: newStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const deleteChanson = async (id: string) => {
    if (window.confirm("Supprimer ce titre de la tracklist ?")) {
      const { error } = await supabase.from('chansons').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const toggleRetours = (chanson: any) => {
    if (activeRetoursId === chanson.id) {
      setActiveRetoursId(null);
    } else {
      setActiveRetoursId(chanson.id);
      setRetoursText(chanson.retours_artiste || '');
    }
  };

  const saveRetours = async (id: string) => {
    const { error } = await supabase.from('chansons').update({ retours_artiste: retoursText }).eq('id', id);
    if (!error) {
      setActiveRetoursId(null);
      fetchData();
    } else {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const activeProject = projets.find(p => p.id === activeProjectId);
  const isAdmin = !currentArtiste;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Projets</h1>
          <p className="mt-2 text-gray-400">Gérez les productions, albums et singles.</p>
        </div>
        
        {isAdmin && (
          <button onClick={openNewModal} className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90">
            <Plus size={20} /> Nouveau projet
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>
      ) : projets.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center"><Folder className="mx-auto mb-4 text-[#4ade80]/50" size={48} /><h3 className="mb-2 text-xl font-bold text-white">Aucun projet</h3></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projets.map((projet) => {
            const totalSongs = projet.chansons?.length || 0;
            const completedSongs = projet.chansons?.filter((c: any) => c.status === 'TERMINÉ').length || 0;
            const progressPercentage = totalSongs === 0 ? 0 : Math.round((completedSongs / totalSongs) * 100);

            return (
              <div key={projet.id} className="group flex flex-col justify-between relative rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80">
                {isAdmin && (
                  <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                    <button onClick={() => handleEditClick(projet)} className="rounded p-2 text-gray-400 hover:text-[#4ade80]"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(projet.id, projet.title)} className="rounded p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                )}
                <div>
                  <div className="mb-4 flex items-center gap-3 pr-16">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4ade80]/20 text-[#4ade80]"><Folder size={24} /></div>
                    <div>
                      <h3 className="truncate text-xl font-bold text-white">{projet.title}</h3>
                      <span className="text-sm font-medium text-[#4ade80]">{projet.artistes?.nom || 'Artiste inconnu'}</span>
                    </div>
                  </div>
                  {projet.description && (
                    <div className="mt-4 flex gap-2 text-sm text-gray-400 mb-6"><FileText size={16} className="shrink-0 mt-0.5" /> <p className="line-clamp-3">{projet.description}</p></div>
                  )}
                </div>
                <div className="mt-auto border-t border-gray-800 pt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">{totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                    <span className="font-bold text-[#4ade80]">{progressPercentage}%</span>
                  </div>
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full bg-[#4ade80] shadow-[0_0_10px_#4ade80] transition-all" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <button onClick={() => { setActiveProjectId(projet.id); setIsTrackModalOpen(true); }} className="w-full flex items-center justify-center gap-2 rounded bg-white/5 py-2 text-sm font-medium text-white transition-all hover:bg-[#4ade80]/20 hover:text-[#4ade80]">
                    <ListMusic size={16} /> Voir la Tracklist
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
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Artiste associé *</label>
            <select required value={formData.artiste_id} onChange={(e) => setFormData({...formData, artiste_id: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80] [&>option]:bg-black">
              <option value="">Sélectionnez un artiste...</option>
              {artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" rows={3} />
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black hover:bg-[#4ade80]/90">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>

      {/* MODAL : Tracklist (Chansons) */}
      <Modal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} title={`Tracklist : ${activeProject?.title || ''}`}>
        <div className="space-y-6">
          
          {isAdmin && (
            <form onSubmit={addChanson} className="flex gap-2">
              <input type="text" required value={newSongTitle} onChange={(e)=>setNewSongTitle(e.target.value)} placeholder="Titre de la chanson..." className="flex-1 rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" />
              <button type="submit" className="flex items-center justify-center rounded-lg bg-[#4ade80] px-4 font-bold text-black hover:bg-[#4ade80]/90"><Plus size={20}/></button>
            </form>
          )}
          
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {activeProject?.chansons?.map((chanson: any) => (
              <div key={chanson.id} className="flex flex-col gap-2 rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition-all">
                
                {/* Ligne principale du titre */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className={`font-medium flex-1 truncate ${chanson.status === 'TERMINÉ' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {chanson.titre}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* LE BOUTON RETOURS (Message) */}
                    <button 
                      onClick={() => toggleRetours(chanson)} 
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
                        chanson.retours_artiste ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      title="Notes et Retours"
                    >
                      <MessageSquare size={16} />
                      {chanson.retours_artiste ? 'Notes' : ''}
                    </button>

                    <select 
                      value={chanson.status}
                      onChange={(e) => updateChansonStatus(chanson.id, e.target.value)}
                      disabled={!isAdmin}
                      className={`rounded border px-2 py-1.5 text-xs font-medium focus:outline-none w-full sm:w-auto ${
                        chanson.status === 'TERMINÉ' ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : 
                        chanson.status === 'EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE' ? 'border-orange-500 bg-orange-500/10 text-orange-500' :
                        'border-gray-700 bg-black text-gray-300 focus:border-[#4ade80]'
                      } ${!isAdmin ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      <option value="ENREGISTREMENT">ENREGISTREMENT</option>
                      <option value="MIXAGE/MASTERING">MIXAGE/MASTERING</option>
                      <option value="EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE">EN ATTENTE DE CORRECTION...</option>
                      <option value="TERMINÉ">TERMINÉ</option>
                    </select>

                    {isAdmin && (
                      <button onClick={() => deleteChanson(chanson.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                </div>

                {/* LA ZONE DE TEXTE DÉROULANTE (Carnet de notes) */}
                {activeRetoursId === chanson.id && (
                  <div className="mt-2 border-t border-gray-800 pt-3 flex flex-col gap-2 animate-in slide-in-from-top-2">
                    <label className="text-xs text-gray-400">Notes / Retours sur le mixage :</label>
                    <textarea
                      value={retoursText}
                      onChange={(e) => setRetoursText(e.target.value)}
                      rows={4}
                      placeholder={isAdmin ? "Les retours de l'artiste s'afficheront ici..." : "Ex: 0:45 - Baisser un peu la charley, 1:20 - Monter ma voix..."}
                      className="w-full rounded-lg bg-black/50 border border-gray-700 p-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button onClick={() => setActiveRetoursId(null)} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                        Annuler
                      </button>
                      <button onClick={() => saveRetours(chanson.id)} className="rounded bg-orange-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-orange-600 transition-all">
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {activeProject?.chansons?.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-8">
                {isAdmin ? "Aucun titre dans ce projet. Ajoutez votre première maquette !" : "La tracklist n'a pas encore été créée."}
              </p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
