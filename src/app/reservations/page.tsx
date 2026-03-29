"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Loader2, Save, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function ReservationsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // Vérifier si c'est l'Admin
      const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      setIsAdmin(!artiste);

      // Récupérer le lien
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
    await supabase.from('parametres').upsert([{ id: 'calendly_url', valeur: calendlyUrl }]);
    setSaving(false);
    alert("Lien du calendrier mis à jour !");
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('res.title')}</h1>
        <p className="mt-2 text-gray-400 font-bold">{t('res.subtitle')}</p>
      </div>

      {/* GROS BLOC DE CONFIGURATION - VISIBLE UNIQUEMENT PAR L'ADMIN */}
      {isAdmin && (
        <div className="mb-8 rounded-xl border-2 border-[#4ade80]/50 bg-black/80 p-6 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
          <div className="flex items-center gap-3 mb-4 text-[#4ade80]">
            <Settings size={24} />
            <h2 className="text-xl font-bold">Configuration du calendrier (Admin)</h2>
          </div>
          <p className="text-gray-400 text-sm font-bold mb-4">
            Colle ici le lien de ton calendrier (Calendly, Cal.com, etc.). Les artistes verront le calendrier s'afficher juste en dessous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={calendlyUrl} 
              onChange={(e) => setCalendlyUrl(e.target.value)} 
              placeholder="Ex: https://calendly.com/ton-lien"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white font-bold focus:border-[#4ade80] focus:outline-none"
            />
            <button onClick={handleSaveUrl} disabled={saving} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-8 py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Enregistrer</>}
            </button>
          </div>
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
            {isAdmin && <p className="text-[#4ade80] mt-2 font-bold">Utilise la case juste au-dessus pour ajouter ton lien !</p>}
          </div>
        )}
      </div>
    </div>
  );
}
