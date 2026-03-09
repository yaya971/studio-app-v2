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

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: ''
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

      // Sécurité : On vérifie si c'est bien l'Admin
      const { data: checkArtiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      if (checkArtiste) {
        router.push('/'); // Si c'est un artiste, on le renvoie à l'accueil
        return;
      }

      const { data, error } = await supabase.from('artistes').select('*').order('nom', { ascending: true });
      if (error) throw error;
      if (data) setArtistes(data);
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setFormData({ nom: '', email: '', telephone: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (artiste: any) => {
    setFormData({ nom: artiste.nom, email: artiste.email || '', telephone: artiste.telephone || '' });
    setEditingId(artiste.id);
    setIsModalOpen(true);
  };

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

  // NOUVEAU : Fonction pour envoyer la photo de profil
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

      fetchData(); // On rafraîchit pour afficher la nouvelle photo
    } catch (error: any) {
      alert("Erreur lors de l'upload : " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Artistes</h1>
          <p className="mt-2 text-gray-400">Gérez votre répertoire client et leurs profils.</p>
        </div>
        
        <button onClick={openNewModal} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90">
          <Plus size={20} /> Ajouter un artiste
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>
      ) : artistes.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center">
          <Users className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucun artiste</h3>
          <p className="text-gray-400">Commencez par ajouter votre premier client.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artistes.map((artiste) => (
            <div key={artiste.id} className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black p-6 text-center shadow-xl transition-all hover:border-[#4ade80]/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.1)]">
              
              {/* BOUTONS ACTIONS (Cachés par défaut, apparaissent au survol) */}
              <div className="absolute right-3 top-3 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEditClick(artiste)} className="rounded-lg bg-black/60 p-2 text-gray-400 hover:text-[#4ade80] border border-gray-700 transition-colors"><Edit size={14} /></button>
                <button onClick={() => handleDelete(artiste.id, artiste.nom)} className="rounded-lg bg-black/60 p-2 text-gray-400 hover:text-red-500 border border-gray-700 transition-colors"><Trash2 size={14} /></button>
              </div>

              {/* LA PHOTO DE PROFIL (AVATAR) */}
              <div className="relative mb-5 mt-2 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-900 shadow-inner group-hover:border-[#4ade80]/50 transition-colors">
                {artiste.avatar_url ? (
                  <img src={artiste.avatar_url} alt={artiste.nom} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <Users size={32} className="text-gray-600" />
                )}
                
                {/* L'overlay cliquable pour modifier la photo */}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                  {uploadingId === artiste.id ? (
                    <Loader2 size={24} className="animate-spin text-[#4ade80]" />
                  ) : (
                    <Camera size={24} className="text-white drop-shadow-md" />
                  )}
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={(e) => handleAvatarUpload(e, artiste.id)} disabled={uploadingId === artiste.id} />
                </label>
              </div>

              {/* INFOS DE L'ARTISTE */}
              <h3 className="mb-1 text-xl font-bold text-white">{artiste.nom}</h3>
              <div className="mt-2 flex w-full flex-col gap-2 rounded-xl bg-black/40 p-3 text-sm border border-gray-800/50">
                <div className="flex items-center justify-center gap-2 text-gray-400 truncate">
                  <Mail size={14} className="shrink-0 text-[#4ade80]/70" /> 
                  <span className="truncate">{artiste.email || 'Aucun email'}</span>
                </div>
                {artiste.telephone && (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Phone size={14} className="shrink-0 text-[#4ade80]/70" /> 
                    {artiste.telephone}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL : Ajouter / Modifier un artiste */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'artiste" : "Nouvel Artiste"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium text-gray-400">Nom de scène *</label><input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]" placeholder="Ex: Daft Punk" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-400">Email (optionnel)</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]" placeholder="contact@artiste.com" /></div>
          <div><label className="mb-1 block text-sm font-medium text-gray-400">Téléphone (optionnel)</label><input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]" placeholder="06 12 34 56 78" /></div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>

    </div>
  );
}
