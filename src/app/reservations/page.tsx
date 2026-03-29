"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Loader2, Edit, Save, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function ReservationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Vérifier si Admin
      const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      setIsAdmin(!artiste);

      // Récupérer le lien Calendly dans les paramètres
      const { data: params } = await supabase.from('parametres').select('valeur').eq('id', 'calendly_url').maybeSingle();
      if (params && params.valeur) {
        setCalendlyUrl(params.valeur);
      }
      setLoading(false);
    }
    init();
  }, [router]);

  const handleSaveUrl = async () => {
    setSaving(true);
    // On met à jour (ou on insère si ça n'existait pas)
    await supabase.from('parametres').upsert([{ id: 'calendly_url', valeur: calendlyUrl }]);
    setSaving(false);
    setIsEditing(false);
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('res.title')}</h1>
          <p className="mt-2 text-gray-400 font-bold">{t('res.subtitle')}</p>
        </div>
        
        {/* BOUTON D'ÉDITION POUR L'ADMIN */}
        {isAdmin && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 font-bold text-gray-300 hover:text-white hover:border-[#4ade80] transition-all">
            <Edit size={16} /> Modifier le lien du calendrier
          </button>
        )}
      </div>

      {/* MODE ÉDITION ADMIN */}
      {isAdmin && isEditing && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/10 p-4">
          <input 
            type="text" 
            value={calendlyUrl} 
            onChange={(e) => setCalendlyUrl(e.target.value)} 
            placeholder="Ex: https://calendly.com/mon-studio"
            className="flex-1 rounded-lg border border-gray-700 bg-black px-4 py-2 text-white font-bold focus:border-[#4ade80] focus:outline-none"
          />
          <button onClick={handleSaveUrl} disabled={saving} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-6 py-2 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Enregistrer</>}
          </button>
        </div>
      )}

      {/* LECTEUR DU CALENDRIER */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-800 bg-black shadow-[0_0_20px_rgba(0,0,0,0.5)] relative">
        {calendlyUrl ? (
          <iframe 
            src={calendlyUrl} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            className="absolute inset-0 w-full h-full bg-transparent"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-8">
            <Calendar size={64} className="text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Aucun calendrier configuré</h3>
            {isAdmin && <p className="text-gray-500 mt-2">Clique sur le bouton "Modifier le lien" en haut pour ajouter ton calendrier.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
