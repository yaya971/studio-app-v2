"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader2, Mail, Phone, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ArtistesPage() {
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('artistes')
      .insert([formData]);

    if (!error) {
      setFormData({ nom: '', email: '', telephone: '' });
      setIsModalOpen(false);
      fetchArtistes();
    } else {
      alert("Erreur lors de l'ajout de l'artiste. Vérifiez votre connexion.");
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
          onClick={() => setIsModalOpen(true)}
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
            <div key={artiste.id} className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4ade80]/20 text-[#4ade80]">
                  <User size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">{artiste.nom}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                {artiste.email && (
                  <div className="flex items-center gap-2"><Mail size={16} /> {artiste.email}</div>
                )}
                {artiste.telephone && (
                  <div className="flex items-center gap-2"><Phone size={16} /> {artiste.telephone}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvel Artiste">
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
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Enregistrer'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
