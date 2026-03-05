"use client";

import React, { useState, useEffect } from 'react';
import { Mic2, Plus, Loader2, Calendar, FileText, Folder } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [projets, setProjets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    notes: '',
    project_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // On récupère les sessions
    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false });
      
    // On récupère les projets pour la liste déroulante
    const { data: projetsData } = await supabase
      .from('projets')
      .select('id, title')
      .order('title', { ascending: true });
    
    if (sessionsData) setSessions(sessionsData);
    if (projetsData) setProjets(projetsData);
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // On convertit la date locale pour Supabase
    const sessionDataToInsert = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };
    
    const { error } = await supabase
      .from('sessions')
      .insert([sessionDataToInsert]);

    if (!error) {
      setFormData({ title: '', date: '', notes: '', project_id: '' });
      setIsModalOpen(false);
      fetchData();
    } else {
      alert("Erreur lors de la création de la session.");
    }
    setIsSubmitting(false);
  };

  // Petite fonction pour retrouver le nom du projet via son ID
  const getProjectName = (projectId: string) => {
    const projet = projets.find(p => p.id === projectId);
    return projet ? projet.title : 'Projet inconnu';
  };

  // Formatage de la date pour un affichage propre (ex: 12 Mars 2024 - 14:30)
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Sessions
          </h1>
          <p className="mt-2 text-gray-400">Gérez vos heures d'enregistrement et de mixage.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
        >
          <Plus size={20} />
          Nouvelle session
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-[#4ade80]" size={32} />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <Mic2 className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucune session prévue</h3>
          <p className="text-gray-400">Planifiez votre première session de studio.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 transition-all hover:border-[#4ade80]/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4ade80]/20 text-[#4ade80]">
                  <Mic2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{session.title}</h3>
                  <span className="flex items-center gap-1 text-sm font-medium text-[#4ade80]">
                    <Folder size={14} /> {getProjectName(session.project_id)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar size={16} className="text-[#4ade80]" /> 
                  <span>{formatDate(session.date)}</span>
                </div>
                
                {session.notes && (
                  <div className="rounded border border-gray-800 bg-gray-900/50 p-3 text-sm text-gray-400">
                    <div className="mb-1 flex items-center gap-2 text-gray-500">
                      <FileText size={14} /> Notes:
                    </div>
                    {session.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Le Formulaire de Session */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Session">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Titre de la session *</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
              placeholder="Ex: Prises voix Lead"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm text-gray-400">Projet associé *</label>
            <select
              required
              value={formData.project_id}
              onChange={(e) => setFormData({...formData, project_id: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [&>option]:bg-black"
            >
              <option value="">Sélectionnez un projet...</option>
              {projets.map(projet => (
                <option key={projet.id} value={projet.id}>
                  {projet.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Date et Heure *</label>
            <input 
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Notes (Optionnel)</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none"
              placeholder="Matériel utilisé, réglages, intentions..."
              rows={3}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Planifier la session'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
