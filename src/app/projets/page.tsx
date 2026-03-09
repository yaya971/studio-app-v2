"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Folder, Plus, Loader2, FileText, Edit, Trash2, ListMusic, MessageSquare, UploadCloud, XCircle, PlayCircle, MapPin } from 'lucide-react';
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

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [currentArtiste, setCurrentArtiste] = useState<any>(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', artiste_id: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      let loggedInArtiste = null;
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
          if (p.chansons) p.chansons.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });
        setProjets(projetsData);
      }
      if (artistesData) setArtistes(artistesData);
    } catch (error) { console.error("Erreur :", error); } 
    finally { setLoading(false); }
  };

  const openNewModal = () => { setFormData({ title: '', description: '', artiste_id: currentArtiste ? currentArtiste.id : '' }); setEditingId(null); setIsModalOpen(true); };
  const handleEditClick = (projet: any) => { setFormData({ title: projet.title, description: projet.description || '', artiste_id: projet.artiste_id || '' }); setEditingId(projet.id); setIsModalOpen(true); };
  
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ? \n⚠️ Sessions et chansons seront perdues !`)) {
      const { error } = await supabase.from('projets').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.artiste_id) { alert("Veuillez sélectionner un artiste !"); setIsSubmitting(false); return; }
    if (editingId) {
      const { error } = await supabase.from('projets').update(formData).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchData(); }
    } else {
      const { error } = await supabase.from('projets').insert([formData]);
      if (!error) { setIsModalOpen(false); fetchData(); }
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
    if (activeRetoursId === chanson.id) setActiveRetoursId(null);
    else { setActiveRetoursId(chanson.id); setRetoursText(chanson.retours_artiste || ''); }
  };

  const saveRetours = async (id: string) => {
    const { error } = await supabase.from('chansons').update({ retours_artiste: retoursText }).eq('id', id);
    if (!error) { setActiveRetoursId(null); fetchData(); }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, chansonId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingId(chansonId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `track_${chansonId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('maquettes').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('maquettes').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('chansons').update({ fichier_audio: publicUrl }).eq('id', chansonId);
      if (updateError) throw updateError;
      fetchData();
    } catch (error: any) { alert("Erreur d'upload : " + error.message); } 
    finally { setUploadingId(null); }
  };

  const deleteAudio = async (chansonId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer la maquette de ce titre ?")) {
      const { error } = await supabase.from('chansons').update({ fichier_audio: '' }).eq('id', chansonId);
      if (!error) fetchData();
    }
  };

  const handleAddTimestamp = (chanson: any) => {
    const audioElement = document.getElementById(`audio-${chanson.id}`) as HTMLAudioElement;
    let currentTimeStr = "00:00";
    if (audioElement) {
      const time = Math.floor(audioElement.currentTime);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      currentTimeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    setActiveRetoursId(chanson.id);
    const baseText = activeRetoursId === chanson.id ? retoursText : (chanson.retours_artiste || '');
    const separator = baseText.trim() === '' ? '' : '\n';
    setRetoursText(`${baseText}${separator}[${currentTimeStr}] - `);
  };

  const activeProject = projets.find(p => p.id === activeProjectId);
  const isAdmin = !currentArtiste;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Projets</h1>
          <p className="mt-2 text-gray-400 font-bold">Gérez les productions, albums et singles.</p>
        </div>
        {isAdmin && (
          <button onClick={openNewModal} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90">
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
              <div key={projet.id} className="group flex flex-col justify-between relative rounded-xl border border-gray-800 bg-black/50 p-6 transition-all hover:border-[#4ade80]/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                {isAdmin && (
                  <div className="absolute right-4 top-4 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100 z-10">
                    <button onClick={() => handleEditClick(projet)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-[#4ade80] border border-gray-800"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(projet.id, projet.title)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-red-500 border border-gray-800"><Trash2 size={16} /></button>
                  </div>
                )}
                <div>
                  <div className="mb-4 flex items-center gap-4 pr-16">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20"><Folder size={24} /></div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-bold text-white">{projet.title}</h3>
                      <span className="truncate block text-sm font-bold text-[#4ade80] mt-1">{projet.artistes?.nom || 'Artiste inconnu'}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-auto border-t border-gray-800 pt-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-gray-400">{totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                    <span className="text-[#4ade80]">{progressPercentage}%</span>
                  </div>
                  <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full bg-[#4ade80] transition-all shadow-[0_0_10px_#4ade80]" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                  <button onClick={() => { setActiveProjectId(projet.id); setIsTrackModalOpen(true); }} className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#4ade80] hover:text-black border border-gray-800">
                    <ListMusic size={18} /> Ouvrir la Tracklist
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
          <div><label className="mb-1 block text-sm font-bold text-gray-400">Titre du projet *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
          <div><label className="mb-1 block text-sm font-bold text-gray-400">Artiste *</label>
            <select required value={formData.artiste_id} onChange={(e) => setFormData({...formData, artiste_id: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] [&>option]:bg-black">
              <option value="">Sélectionnez un artiste...</option>{artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div><label className="mb-1 block text-sm font-bold text-gray-400">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} /></div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Créer le projet')}
          </button>
        </form>
      </Modal>

      {/* MODAL : Tracklist */}
      <Modal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} title={`Tracklist : ${activeProject?.title || ''}`}>
        <div className="space-y-6">
          
          {isAdmin && (
            <form onSubmit={addChanson} className="flex gap-2">
              <input type="text" required value={newSongTitle} onChange={(e)=>setNewSongTitle(e.target.value)} placeholder="Ajouter un titre (ex: Intro, Piste 1...)" className="flex-1 rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
              <button type="submit" className="flex items-center justify-center rounded-lg bg-[#4ade80] px-6 font-bold text-black hover:bg-[#4ade80]/90 transition-all"><Plus size={20}/></button>
            </form>
          )}
          
          <div className="max-h-[65vh] overflow-y-auto space-y-4 pr-1 pb-4">
            {activeProject?.chansons?.map((chanson: any) => (
              <div key={chanson.id} className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/40 p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
                
                {chanson.status === 'TERMINÉ' && <div className="absolute left-0 top-0 h-full w-1.5 bg-[#4ade80] shadow-[0_0_10px_#4ade80]"></div>}
                
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h4 className={`flex items-center gap-3 text-lg font-bold min-w-0 ${chanson.status === 'TERMINÉ' ? 'text-gray-500 line-through' : 'text-white'}`}>
                    <PlayCircle size={22} className={`shrink-0 ${chanson.fichier_audio ? "text-[#4ade80]" : "text-gray-600"}`} />
                    <span className="truncate">{chanson.titre}</span>
                  </h4>
                  
                  <select value={chanson.status} onChange={(e) => updateChansonStatus(chanson.id, e.target.value)} disabled={!isAdmin} className={`rounded-lg border px-3 py-1.5 text-xs font-bold focus:outline-none shadow-sm [&>option]:bg-gray-900 [&>option]:text-white ${chanson.status === 'TERMINÉ' ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]' : chanson.status === 'EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE' ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-gray-700 bg-black text-gray-300'} ${!isAdmin ? 'appearance-none cursor-default' : 'cursor-pointer'}`}>
                    <option value="ENREGISTREMENT">🔴 ENREGISTREMENT</option>
                    <option value="MIXAGE/MASTERING">🎛️ MIXAGE</option>
                    <option value="EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE">⏳ EN ATTENTE DE RETOURS</option>
                    <option value="TERMINÉ">✅ TERMINÉ</option>
                  </select>
                </div>

                <div className="my-4">
                  {chanson.fichier_audio ? (
                    <div className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-black p-3 shadow-inner">
                      <div className="flex w-full items-center gap-2">
                        <audio id={`audio-${chanson.id}`} controls className="h-10 w-full outline-none [color-scheme:dark] bg-transparent rounded-lg">
                          <source src={chanson.fichier_audio} type="audio/mpeg" />
                          <source src={chanson.fichier_audio} type="audio/wav" />
                        </audio>
                        {isAdmin && (
                          <button onClick={() => deleteAudio(chanson.id)} className="shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/20 hover:text-red-500" title="Supprimer l'audio">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-end px-1 mt-1">
                        <button onClick={() => handleAddTimestamp(chanson)} className="flex items-center gap-1.5 text-xs font-bold text-[#4ade80] hover:text-white transition-colors bg-[#4ade80]/10 hover:bg-[#4ade80]/30 px-3 py-1.5 rounded-full border border-[#4ade80]/20">
                          <MapPin size={14} /> Épingler une note ici
                        </button>
                      </div>
                    </div>
                  ) : (
                    isAdmin ? (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-black/50 py-6 transition-all hover:border-[#4ade80] hover:bg-[#4ade80]/5">
                        {uploadingId === chanson.id ? (
                          <><Loader2 size={24} className="mb-2 animate-spin text-[#4ade80]" /><span className="text-sm font-bold text-[#4ade80]">Envoi du mix...</span></>
                        ) : (
                          <><UploadCloud size={24} className="mb-2 text-gray-500 transition-colors group-hover:text-[#4ade80]" /><span className="text-sm font-bold text-gray-500 text-center px-4">Glisser la maquette (MP3/WAV) ici</span></>
                        )}
                        <input type="file" accept="audio/mpeg, audio/wav" className="hidden" onChange={(e) => handleFileUpload(e, chanson.id)} disabled={uploadingId === chanson.id} />
                      </label>
                    ) : (
                      <div className="rounded-xl border border-gray-800 bg-black/50 p-4 text-center text-sm font-bold text-gray-500">
                        🎵 Maquette en cours de préparation au studio...
                      </div>
                    )
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-4">
                  <button onClick={() => toggleRetours(chanson)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${chanson.retours_artiste ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    <MessageSquare size={16} /> {chanson.retours_artiste ? 'Voir les retours' : 'Ajouter une note'}
                  </button>

                  {isAdmin && (
                    <button onClick={() => deleteChanson(chanson.id)} className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-500">
                      <XCircle size={14}/> Retirer le titre
                    </button>
                  )}
                </div>

                {activeRetoursId === chanson.id && (
                  <div className="mt-4 animate-in slide-in-from-top-2 rounded-xl bg-black p-4 border border-gray-800 shadow-inner">
                    <label className="mb-2 block text-xs font-bold text-gray-400 uppercase tracking-wider">Notes de mixage</label>
                    <textarea value={retoursText} onChange={(e) => setRetoursText(e.target.value)} rows={4} placeholder={isAdmin ? "Les notes du client apparaîtront ici..." : "Ex: 0:45 - Baisser un peu la charley..."} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm font-bold text-white focus:border-orange-500 focus:outline-none transition-colors" />
                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={() => setActiveRetoursId(null)} className="rounded-lg px-4 py-2 text-xs font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">Fermer</button>
                      <button onClick={() => saveRetours(chanson.id)} className="rounded-lg bg-orange-500 px-5 py-2 text-xs font-bold text-black transition-all hover:bg-orange-600">Enregistrer</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {activeProject?.chansons?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                <ListMusic size={40} className="mb-3 opacity-30" />
                <p className="font-bold">{isAdmin ? "La tracklist est vide. Ajoutez le premier titre." : "La tracklist n'a pas encore été créée."}</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
