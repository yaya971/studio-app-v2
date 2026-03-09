"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Loader2, Mail, Phone, User, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ArtistesPage() {
  const router = useRouter();
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '' });

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: isArtiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).single();
    
    // LE CADENAS EST ICI : 
    if (isArtiste) {
      router.push('/'); // Si c'est un artiste, on le jette dehors vers l'accueil !
      return;
    }

    const { data, error } = await supabase.from('artistes').select('*').order('created_at', { ascending: false });
    if (!error && data) setArtistes(data);
    setLoading(false);
  };

  const handleEditClick = (artiste: any) => {
    setFormData({ nom: artiste.nom, email: artiste.email || '', telephone: artiste.telephone || '' });
    setEditingId(artiste.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, nom: string) => {
    if (window.confirm(`Supprimer ${nom} et ses projets ?`)) {
      const { error } = await supabase.from('artistes').delete().eq('id', id);
      if (!error) checkAccessAndFetch();
    }
  };

  const openNewModal = () => {
    setFormData({ nom: '', email: '', telephone: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingId) {
      const { error } = await supabase.from('artistes').update(formData).eq('id', editingId);
      if (!error) { setIsModalOpen(false); checkAccessAndFetch(); }
    } else {
      const { error } = await supabase.from('artistes').insert([formData]);
      if (!error) { setIsModalOpen(false); checkAccessAndFetch(); }
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center p-8"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Artistes</h1>
          <p className="mt-2 text-gray-400">Gérez votre répertoire d'artistes.</p>
        </div>
        <button onClick={openNewModal} className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black hover:bg-[#4ade80]/90">
          <Plus size={20} /> Ajouter un artiste
        </button>
      </div>

      {artistes.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center"><Users className="mx-auto mb-4 text-[#4ade80]/50" size={48} /><h3 className="mb-2 text-xl font-bold text-white">Aucun artiste</h3></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {artistes.map((artiste) => (
            <div key={artiste.id} className="group relative rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80">
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEditClick(artiste)} className="rounded p-2 text-gray-400 hover:text-[#4ade80]"><Edit size={16} /></button>
                <button onClick={() => handleDelete(artiste.id, artiste.nom)} className="rounded p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              <div className="mb-4 flex items-center gap-3 pr-16">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4ade80]/20 text-[#4ade80]"><User size={24} /></div>
                <h3 className="truncate text-xl font-bold text-white">{artiste.nom}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                {artiste.email && <div className="flex items-center gap-2"><Mail size={16} /> <span className="truncate">{artiste.email}</span></div>}
                {artiste.telephone && <div className="flex items-center gap-2"><Phone size={16} /> {artiste.telephone}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'artiste" : "Nouvel Artiste"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Nom de l'artiste *</label>
            <input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Téléphone</label>
            <input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:outline-none focus:border-[#4ade80]" />
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black hover:bg-[#4ade80]/90">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
