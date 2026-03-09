"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Loader2, Edit, Trash2, Mail, Phone, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ArtistesPage() {
  const router = useRouter();
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: checkArtiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      if (checkArtiste) { router.push('/'); return; }

      const { data, error } = await supabase.from('artistes').select('*').order('nom', { ascending: true });
      if (error) throw error;
      if (data) setArtistes(data);
    } catch (error) { console.error("Erreur :", error); } 
    finally { setLoading(false); }
  };

  const openNewModal = () => { setFormData({ nom: '', email: '', telephone: '' }); setEditingId(null); setIsModalOpen(true); };
  const handleEditClick = (artiste: any) => { setFormData({ nom: artiste.nom, email: artiste.email || '', telephone: artiste.telephone || '' }); setEditingId(artiste.id); setIsModalOpen(true); };

  const handleDelete = async (id: string, nom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${nom} ? \n⚠️ Tous ses projets et sessions seront supprimés !`)) {
      const { error } = await supabase.from('artistes').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingId) {
      const { error } = await supabase.from('artistes').update(formData).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchData(); }
    } else {
      const { error } = await supabase.from('artistes').insert([formData]);
      if (!error) { setIsModalOpen(false); fetchData(); }
    }
    setIsSubmitting(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>, artisteId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingId(artisteId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profil_${artisteId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const { error: updateError } = await supabase.from('artistes').update({ avatar_url: publicUrl }).eq('id', artisteId);
      if (updateError) throw updateError;
      fetchData(); 
    } catch (error: any) { alert("Erreur lors de l'upload : " + error.message); } 
    finally { setUploadingId(null); }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white tracking-wide">Artistes</h1>
          <p className="mt-2 text-zinc-400 font-light">Gérez votre répertoire client et leurs profils.</p>
        </div>
        
        <button onClick={openNewModal} className="flex items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 font-medium text-black transition-all hover:bg-[#10b981]/90 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Plus size={20} /> Ajouter un client
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#10b981]" size={32} /></div>
      ) : artistes.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-12 text-center backdrop-blur-md">
          <Users className="mx-auto mb-4 text-[#10b981]/40" size={48} />
          <h3 className="mb-2 text-xl font-medium text-white">Aucun artiste</h3>
          <p className="text-zinc-500 font-light">Commencez par ajouter votre premier client.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artistes.map((artiste) => (
            <div key={artiste.id} className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-6 text-center backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-[#10b981]/30">
              
              <div className="absolute right-3 top-3 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEditClick(artiste)} className="rounded-lg bg-zinc-900/80 p-2 text-zinc-400 hover:text-[#10b981] border border-zinc-800 transition-colors"><Edit size={14} /></button>
                <button onClick={() => handleDelete(artiste.id, artiste.nom)} className="rounded-lg bg-zinc-900/80 p-2 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"><Trash2 size={14} /></button>
              </div>

              <div className="relative mb-5 mt-2 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900 shadow-inner group-hover:border-[#10b981]/50 transition-colors">
                {artiste.avatar_url ? (
                  <img src={artiste.avatar_url} alt={artiste.nom} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <Users size={32} className="text-zinc-600" />
                )}
                
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity hover:opacity-100 backdrop-blur-sm">
                  {uploadingId === artiste.id ? (
                    <Loader2 size={24} className="animate-spin text-[#10b981]" />
                  ) : (
                    <Camera size={24} className="text-white drop-shadow-md" />
                  )}
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={(e) => handleAvatarUpload(e, artiste.id)} disabled={uploadingId === artiste.id} />
                </label>
              </div>

              <h3 className="mb-1 text-xl font-medium text-white tracking-wide">{artiste.nom}</h3>
              <div className="mt-3 flex w-full flex-col gap-2 rounded-xl bg-zinc-900/50 p-3 text-sm border border-zinc-800/50 font-light">
                <div className="flex items-center justify-center gap-2 text-zinc-400 truncate">
                  <Mail size={14} className="shrink-0 text-[#10b981]/70" /> 
                  <span className="truncate">{artiste.email || 'Aucun email'}</span>
                </div>
                {artiste.telephone && (
                  <div className="flex items-center justify-center gap-2 text-zinc-400">
                    <Phone size={14} className="shrink-0 text-[#10b981]/70" /> 
                    {artiste.telephone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL : Ajouter / Modifier un artiste */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier le client" : "Nouveau Client"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="mb-1.5 block text-sm font-light text-zinc-400">Nom de scène *</label><input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white font-light focus:outline-none focus:border-[#10b981] transition-colors" placeholder="Ex: Daft Punk" /></div>
          <div><label className="mb-1.5 block text-sm font-light text-zinc-400">Email (optionnel)</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white font-light focus:outline-none focus:border-[#10b981] transition-colors" placeholder="contact@artiste.com" /></div>
          <div><label className="mb-1.5 block text-sm font-light text-zinc-400">Téléphone (optionnel)</label><input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white font-light focus:outline-none focus:border-[#10b981] transition-colors" placeholder="06 12 34 56 78" /></div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] py-3.5 font-medium text-black transition-all hover:bg-[#10b981]/90">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>

    </div>
  );
}
