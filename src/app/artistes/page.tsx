"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader2, Mail, Phone, User, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ArtistesPage() {
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NOUVEAU : On garde en mémoire l'ID de l'artiste qu'on est en train de modifier
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    fetchArtistes();
  }, []);

  const fetchArtistes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artistes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setArtistes(data);
    }
    setLoading(false);
  };

  // NOUVEAU : Fonction pour ouvrir le modal en mode "Modification"
  const handleEditClick = (artiste: any) => {
    setFormData({
      nom: artiste.nom,
      email: artiste.email || '',
      telephone: artiste.telephone || ''
    });
    setEditingId(artiste.id);
    setIsModalOpen(true);
  };

  // NOUVEAU : Fonction pour supprimer un artiste
  const handleDelete = async (id: string, nom: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${nom} ? \n⚠️ Attention : Cela supprimera aussi tous ses projets et sessions !`)) {
      const { error } = await supabase
        .from('artistes')
        .delete()
        .eq('id', id);
        
      if (!error) {
        fetchArtistes(); // On rafraîchit la liste
      } else {
        alert("Erreur lors de la suppression.");
      }
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
      // MODE MODIFICATION
      const { error } = await supabase
        .from('artistes')
        .update(formData)
        .eq('id', editingId);

      if (!error) {
        setIsModalOpen(false);
        fetchArtistes();
      } else {
        alert("Erreur lors de la modification.");
      }
    } else {
      // MODE CRÉATION (L'ancien code)
      const { error } = await supabase
        .from('artistes')
        .insert([formData]);

      if (!error) {
        setIsModalOpen(false);
        fetchArtistes();
      } else {
        alert("Erreur lors de l'ajout.");
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Artistes
          </h1>
          <p className="mt-2 text-gray-400">Gérez votre répertoire d'artistes.</p>
        </div>
        
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
        >
          <Plus size={20} />
          Ajouter un artiste
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-[#4ade80]" size={32} />
        </div>
      ) : artistes.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <Users className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucun artiste pour le moment</h3>
          <p className="text-gray-400">Cliquez sur le bouton en haut à droite pour ajouter votre premier artiste.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {artistes.map((artiste) => (
            <div key={artiste.id} className="group relative rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              
              {/* NOUVEAU : Les boutons d'action cachés qui apparaissent au survol */}
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEditClick(artiste)} className="rounded p-2 text-gray-400 hover:bg-[#4ade80]/20 hover:text-[#4ade80]">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(artiste.id, artiste.nom)} className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-3 pr-16">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4ade80]/20 text-[#4ade80]">
                  <User size={24} />
                </div>
                <h3 className="truncate text-xl font-bold text-white">{artiste.nom}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                {artiste.email && (
                  <div className="flex items-center gap-2"><Mail size={16} /> <span className="truncate">{artiste.email}</span></div>
                )}
                {artiste.telephone && (
                  <div className="flex items-center gap-2"><Phone size={16} /> {artiste.telephone}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Le Modal intelligent (Création ou Modification) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier l'artiste" : "Nouvel Artiste"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Nom de l'artiste *</label>
            <input 
              type="text" 
              required
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
              placeholder="Ex: Neon Band"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
              placeholder="contact@neonband.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Téléphone</label>
            <input 
              type="tel" 
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
              placeholder="06 12 34 56 78"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
