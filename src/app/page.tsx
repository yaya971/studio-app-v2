"use client";
import React, { useEffect, useState } from 'react';
import { Users, Folder, Mic2, Wallet, Loader2, Music, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Données pour l'Admin
  const [adminStats, setAdminStats] = useState({ artistes: 0, projets: 0, sessions: 0, revenus: 0 });
  const [adminRecentSessions, setAdminRecentSessions] = useState<any[]>([]);

  // Données pour l'Artiste
  const [artisteData, setArtisteData] = useState({ nom: '', projets: [] as any[], prochainesSessions: [] as any[] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // On vérifie si c'est un artiste
    const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).single();

    if (artiste) {
      setRole('ARTISTE');
      // --- CHARGEMENT DES DONNÉES ARTISTE ---
      // 1. Ses projets avec les chansons liées
      const { data: projets } = await supabase.from('projets').select('*, chansons(*)').eq('artiste_id', artiste.id);
      
      // 2. Ses sessions futures uniquement
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*, projets!inner(artiste_id, title)')
        .eq('projets.artiste_id', artiste.id)
        .gte('date', new Date().toISOString()) // Uniquement les sessions à venir
        .order('date', { ascending: true })
        .limit(3);

      setArtisteData({ nom: artiste.nom, projets: projets || [], prochainesSessions: sessions || [] });

    } else {
      setRole('ADMIN');
      // --- CHARGEMENT DES DONNÉES ADMIN --- (Ton ancien code)
      const { count: artistesCount } = await supabase.from('artistes').select('*', { count: 'exact', head: true });
      const { count: projetsCount } = await supabase.from('projets').select('*', { count: 'exact', head: true });
      const { count: sessionsCount, data: sessionsData } = await supabase.from('sessions').select('*, projets(title, artistes(nom))', { count: 'exact' }).order('date', { ascending: false }).limit(5);
      const { data: financesData } = await supabase.from('finances').select('amount, type');
      
      let totalRevenus = 0;
      if (financesData) {
        totalRevenus = financesData.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
      }

      setAdminStats({ artistes: artistesCount || 0, projets: projetsCount || 0, sessions: sessionsCount || 0, revenus: totalRevenus });
      if (sessionsData) setAdminRecentSessions(sessionsData);
    }
    setLoading(false);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;
  }

  // ==========================================
  // VUE 1 : L'ESPACE ARTISTE (Le suivi de projet)
  // ==========================================
  if (role === 'ARTISTE') {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
            Espace Artiste
          </h1>
          <p className="mt-2 text-gray-400">Bienvenue <strong className="text-white">{artisteData.nom}</strong>. Voici l'avancée de vos projets.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne Gauche : Les Projets (2/3 de l'espace) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Folder className="text-[#a855f7]" size={20}/> Mes Projets en cours</h2>
            
            {artisteData.projets.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-black/50 p-8 text-center text-gray-400">Aucun projet en cours.</div>
            ) : (
              artisteData.projets.map(projet => {
                const totalSongs = projet.chansons?.length || 0;
                const completedSongs = projet.chansons?.filter((c: any) => c.status === 'Terminé').length || 0;
                const progressPercentage = totalSongs === 0 ? 0 : Math.round((completedSongs / totalSongs) * 100);

                return (
                  <div key={projet.id} className="rounded-xl border border-[#a855f7]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{projet.title}</h3>
                      <span className="text-[#a855f7] font-bold">{progressPercentage}%</span>
                    </div>
                    
                    {/* La Barre de progression Néon */}
                    <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                      <div className="h-full bg-[#a855f7] shadow-[0_0_10px_#a855f7] transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Music size={14} /> {totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={14} /> {completedSongs} Terminé{completedSongs > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Colonne Droite : Les prochaines sessions (1/3 de l'espace) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="text-[#a855f7]" size={20}/> Prochaines Sessions</h2>
            
            <div className="rounded-xl border border-[#a855f7]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              {artisteData.prochainesSessions.length === 0 ? (
                <p className="text-gray-400 text-center text-sm py-4">Aucune session prévue prochainement.</p>
              ) : (
                <div className="space-y-4">
                  {artisteData.prochainesSessions.map(session => (
                    <div key={session.id} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-white">{session.title}</h4>
                      <p className="text-sm text-[#a855f7] mb-1">{session.projets?.title}</p>
                      <span className="text-xs text-gray-400">{formatDate(session.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VUE 2 : L'ESPACE ADMIN (Le code que tu avais déjà)
  // ==========================================
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Tableau de Bord</h1>
        <p className="mt-2 text-gray-400">Bienvenue dans votre interface de gestion globale.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="mb-4 flex justify-between"><Users className="text-[#4ade80]" size={24} /></div>
          <p className="text-sm text-gray-400">Artistes Actifs</p><h2 className="text-3xl font-bold text-white">{adminStats.artistes}</h2>
        </div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="mb-4 flex justify-between"><Folder className="text-[#4ade80]" size={24} /></div>
          <p className="text-sm text-gray-400">Projets en cours</p><h2 className="text-3xl font-bold text-white">{adminStats.projets}</h2>
        </div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="mb-4 flex justify-between"><Mic2 className="text-[#4ade80]" size={24} /></div>
          <p className="text-sm text-gray-400">Sessions enregistrées</p><h2 className="text-3xl font-bold text-white">{adminStats.sessions}</h2>
        </div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="mb-4 flex justify-between"><Wallet className="text-[#4ade80]" size={24} /></div>
          <p className="text-sm text-gray-400">Revenus Totaux</p><h2 className="text-3xl font-bold text-[#4ade80]">{adminStats.revenus.toFixed(2)} €</h2>
        </div>
      </div>

      <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <h3 className="mb-6 text-xl font-bold text-[#4ade80]">Sessions Récentes</h3>
        {adminRecentSessions.length === 0 ? <p className="text-gray-400">Aucune session.</p> : (
          <div className="space-y-4">
            {adminRecentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80]"><Mic2 size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">{session.title}</h4>
                    <p className="text-sm font-medium text-[#4ade80]">{session.projets?.artistes?.nom} • <span className="text-gray-400">{session.projets?.title}</span></p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">{formatDate(session.date)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
