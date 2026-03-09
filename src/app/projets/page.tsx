"use client";

import React, { useState, useEffect } from 'react';
import { Folder, Plus, Loader2, FileText, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ProjetsPage() {
  const [projets, setProjets] = useState<any[]>([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NOUVEAU : Gestion du mode édition
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
    const { data: projetsData } = await supabase
      .from('projets')
      .select('*, artistes(nom)')
      .order('created_at', { ascending: false });
      
    const { data: artistesData } = await supabase
      .from('artistes')
      .select('id, nom')
      .order('nom', { ascending: true });
    
    if (projetsData) setProjets(projetsData);
    if (artistesData) setArtistes(artistesData);
    
    setLoading(false);
  };

  const openNewModal = () => {
    setFormData({ title: '', description: '', artiste_id: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // NOUVEAU : Fonction pour ouvrir le modal de modification
  const handleEditClick = (projet: any) => {
    setFormData({
      title: projet.title,
      description: projet.description || '',
      artiste_id: projet.artiste_id || ''
    });
    setEditingId(projet.id);
    setIsModalOpen(true);
  };

  // NOUVEAU : Fonction pour supprimer
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${title}" ? \n⚠️ Les sessions associées seront aussi supprimées !`)) {
      const { error } = await supabase.from('projets').delete().eq('id', id);
      if (!error) fetchData();
      else alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (editingId) {
      // MODIFICATION
      const { error } = await supabase.from('projets').update(formData).eq('id', editingId);
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else alert("Erreur lors de la modification.");
    } else {
      // CRÉATION
      const { error } = await supabase.from('projets').insert([formData]);
      if (!error) {
        setIsModalOpen(false);
        fetchData();
      } else alert("Erreur lors de la création.");
    }
    setIsSubmitting(false);
  };

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
          <Plus size={20} />
          Nouveau projet
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-[#4ade80]" size={32} />
        </div>
      ) : projets.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <Folder className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucun projet</h3>
          <p className="text-gray-400">Commencez par créer un projet pour y associer des sessions.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projets.map((projet) => (
            <div key={projet.id} className="group relative rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              
              {/* Boutons cachés Edit / Delete */}
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => handleEditClick(projet)} className="rounded p-2 text-gray-400 hover:bg-[#4ade80]/20 hover:text-[#4ade80]">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(projet.id, projet.title)} className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4 flex items-center gap-3 pr-16">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4ade80]/20 text-[#4ade80]">
                  <Folder size={24} />
                </div>
                <div>
                  <h3 className="truncate text-xl font-bold text-white">{projet.title}</h3>
                  <span className="text-sm font-medium text-[#4ade80]">
                    {projet.artistes?.nom || 'Artiste inconnu'}
                  </span>
                </div>
              </div>
              {projet.description && (
                <div className="mt-4 flex gap-2 text-sm text-gray-400">
                  <FileText size={16} className="shrink-0 mt-0.5" /> 
                  <p className="line-clamp-3">{projet.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier le projet" : "Nouveau Projet"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Titre du projet *</label>
            <input 
              type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Artiste associé *</label>
            <select
              required value={formData.artiste_id} onChange={(e) => setFormData({...formData, artiste_id: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [&>option]:bg-black"
            >
              <option value="">Sélectionnez un artiste...</option>
              {artistes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Description</label>
            <textarea 
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" rows={3}
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Mettre à jour' : 'Créer le projet')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
