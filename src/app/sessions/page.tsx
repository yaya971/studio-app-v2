"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Mic2, Plus, Loader2, Edit, Trash2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentArtiste, setCurrentArtiste] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    duree: '2',
    artiste_id: '' // C'EST MAINTENANT L'ARTISTE QU'ON SÉLECTIONNE
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artisteLoggue } = await supabase.from('artistes').select('id, nom').eq('user_id', session.user.id).maybeSingle();
      setCurrentArtiste(artisteLoggue);

      // On récupère les sessions liées aux artistes
      let sessionsQuery = supabase.from('sessions').select('*, artistes(id, nom)').order('date', { ascending: true });
      let artistesQuery = supabase.from('artistes').select('id, nom').order('nom', { ascending: true });

      if (artisteLoggue) {
        sessionsQuery = sessionsQuery.eq('artiste_id', artisteLoggue.id);
      }

      const [sessionsRes, artistesRes] = await Promise.all([sessionsQuery, artistesQuery]);
      
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (artistesRes.data) setArtistes(artistesRes.data);

    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setFormData({ title: '', date: '', duree: '2', artiste_id: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (session: any) => {
    const formattedDate = new Date(session.date).toISOString().slice(0, 16);
    setFormData({ 
      title: session.title, 
      date: formattedDate, 
      duree: session.duree.toString(), 
      artiste_id: session.artiste_id || '' 
    });
    setEditingId(session.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Voulez-vous vraiment annuler la session "${title}" ?`)) {
      const { error } = await supabase.from('sessions').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  // LE BOUTON NE TOURNERA PLUS DANS LE VIDE !
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.artiste_id) {
      alert("Veuillez sélectionner un artiste !");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('sessions').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sessions').insert([formData]);
        if (error) throw error;
      }
      setIsModalOpen(false); 
      fetchData();
    } catch (error: any) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options).replace(':', 'h');
  };

  const isAdmin = !currentArtiste;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Planning</h1>
          <p className="mt-2 text-gray-400 font-bold">Gérez les sessions d'enregistrement au studio.</p>
        </div>
        
        {isAdmin && (
          <button onClick={openNewModal} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90">
            <Plus size={20} /> Nouvelle session
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center">
          <Calendar className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucune session</h3>
          <p className="text-gray-400 font-bold">Le planning est vide.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div key={session.id} className="group relative rounded-xl border border-gray-800 bg-black/50 p-6 transition-all hover:border-[#4ade80]/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              
              {isAdmin && (
                <div className="absolute right-4 top-4 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100 z-10">
                  <button onClick={() => handleEditClick(session)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-[#4ade80] border border-gray-700"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(session.id, session.title)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-red-500 border border-gray-700"><Trash2 size={16} /></button>
                </div>
              )}

              <div className="mb-4 flex items-center gap-4 pr-16">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30">
                  <Mic2 size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-white">{session.title}</h3>
                  <span className="block text-sm font-bold text-[#4ade80] capitalize mt-1">
                    {formatDate(session.date)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-2.5 rounded-lg font-bold">
                  <User size={16} className="text-[#4ade80]" />
                  <span className="truncate">{session.artistes?.nom || 'Artiste inconnu'}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 px-2 mt-4 font-bold">
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> 
                    <span>Durée : {session.duree} heure(s)</span>
                  </div>
                  {new Date(session.date) < new Date() && (
                    <span className="text-xs font-bold text-gray-500 uppercase">Terminée</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier la session" : "Nouvelle Session"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Titre (ex: Enregistrement Voix) *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Artiste *</label>
            <select required value={formData.artiste_id} onChange={(e) => setFormData({...formData, artiste_id: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] [&>option]:bg-black">
              <option value="">Sélectionnez un artiste...</option>
              {artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Date et heure *</label>
              <input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] [color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Durée (heures) *</label>
              <input type="number" min="1" required value={formData.duree} onChange={(e) => setFormData({...formData, duree: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Programmer la session')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
