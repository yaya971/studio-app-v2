"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Folder, Mic2, Wallet, Loader2, Music, Clock, MessageSquare, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Admin States
  const [adminStats, setAdminStats] = useState({ artistes: 0, projets: 0, sessions: 0, revenus: 0 });
  const [adminRecentSessions, setAdminRecentSessions] = useState<any[]>([]);
  const [adminRetours, setAdminRetours] = useState<any[]>([]); // NOUVEAU : Les notifications de retours

  // Artiste States
  const [artisteData, setArtisteData] = useState({ nom: '', projets: [] as any[], prochainesSessions: [] as any[] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();

      if (artiste) {
        setRole('ARTISTE');
        const { data: projets } = await supabase.from('projets').select('*, chansons(*)').eq('artiste_id', artiste.id);
        const { data: sessions } = await supabase.from('sessions').select('*, projets!inner(artiste_id, title)').eq('projets.artiste_id', artiste.id).gte('date', new Date().toISOString()).order('date', { ascending: true }).limit(3);
        setArtisteData({ nom: artiste.nom, projets: projets || [], prochainesSessions: sessions || [] });
      } else {
        setRole('ADMIN');
        
        // Chiffres clés
        const { count: artistesCount } = await supabase.from('artistes').select('*', { count: 'exact', head: true });
        const { count: projetsCount } = await supabase.from('projets').select('*', { count: 'exact', head: true });
        const { count: sessionsCount, data: sessionsData } = await supabase.from('sessions').select('*, projets(title, artistes(nom))', { count: 'exact' }).order('date', { ascending: false }).limit(5);
        const { data: financesData } = await supabase.from('finances').select('amount, type');
        
        let totalRevenus = 0;
        if (financesData) {
          totalRevenus = financesData.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        }

        // NOUVEAU : On va chercher toutes les chansons qui ont des retours écrits !
        const { data: retoursData } = await supabase
          .from('chansons')
          .select('id, titre, retours_artiste, projets(title, artistes(nom))')
          .neq('retours_artiste', '') // Seulement celles où il y a du texte
          .not('retours_artiste', 'is', null);

        setAdminStats({ artistes: artistesCount || 0, projets: projetsCount || 0, sessions: sessionsCount || 0, revenus: totalRevenus });
        if (sessionsData) setAdminRecentSessions(sessionsData);
        if (retoursData) setAdminRetours(retoursData);
      }
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  // ==========================================
  // VUE 1 : L'ESPACE ARTISTE
  // ==========================================
  if (role === 'ARTISTE') {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">Espace Artiste</h1>
          <p className="mt-2 text-gray-400">Bienvenue <strong className="text-white">{artisteData.nom}</strong>. Voici l'avancée de vos projets.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Folder className="text-[#a855f7]" size={20}/> Mes Projets en cours</h2>
            
            {artisteData.projets.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-black/50 p-8 text-center text-gray-400">Aucun projet en cours.</div>
            ) : (
              artisteData.projets.map(projet => {
                const totalSongs = projet.chansons?.length || 0;
                const terminees = projet.chansons?.filter((c: any) => c.status === 'TERMINÉ').length || 0;
                const enMix = projet.chansons?.filter((c: any) => c.status === 'MIXAGE/MASTERING').length || 0;
                const enAttente = projet.chansons?.filter((c: any) => c.status === 'EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE').length || 0;
                const enEnregistrement = projet.chansons?.filter((c: any) => c.status === 'ENREGISTREMENT').length || 0;

                return (
                  <div key={projet.id} className="rounded-xl border border-[#a855f7]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">{projet.title}</h3>
                      <span className="text-gray-400 flex items-center gap-1 text-sm"><Music size={14} /> {totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-3 text-sm">
                      {totalSongs === 0 ? (
                        <p className="text-center text-gray-500 italic">Aucun titre ajouté pour le moment.</p>
                      ) : (
                        <>
                          {terminees > 0 && <div className="flex justify-between items-center"><span className="text-gray-400">Terminées</span><span className="text-[#4ade80] font-bold px-2 py-0.5 rounded bg-[#4ade80]/10">{terminees}</span></div>}
                          {enMix > 0 && <div className="flex justify-between items-center"><span className="text-gray-400">En Mix/Mastering</span><span className="text-yellow-500 font-bold px-2 py-0.5 rounded bg-yellow-500/10">{enMix}</span></div>}
                          {enAttente > 0 && <div className="flex justify-between items-center"><span className="text-gray-400">En attente de correction</span><span className="text-orange-500 font-bold px-2 py-0.5 rounded bg-orange-500/10">{enAttente}</span></div>}
                          {enEnregistrement > 0 && <div className="flex justify-between items-center"><span className="text-gray-400">Enregistrement</span><span className="text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-400/10">{enEnregistrement}</span></div>}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

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
  // VUE 2 : L'ESPACE ADMIN
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

      <div className="grid gap-8 lg:grid-cols-2">
        {/* COLONNE 1 : SESSIONS RÉCENTES */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <h3 className="mb-6 text-xl font-bold text-[#4ade80] flex items-center gap-2"><Clock size={24}/> Sessions Récentes</h3>
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

        {/* COLONNE 2 : NOTIFICATIONS DE RETOURS (NOUVEAU) */}
        <div className="rounded-xl border border-orange-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <h3 className="mb-6 text-xl font-bold text-orange-500 flex items-center gap-2">
            <Bell size={24} className="animate-pulse" /> Retours à traiter
          </h3>
          {adminRetours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Aucun retour en attente.</p>
              <p className="text-sm">Vos mixages sont parfaits !</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {adminRetours.map((retour) => (
                <div key={retour.id} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 transition-all hover:border-orange-500/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-bold text-white">{retour.titre}</h4>
                    <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                      {retour.projets?.artistes?.nom}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                    <Folder size={12} /> {retour.projets?.title}
                  </p>
                  <div className="rounded bg-black/50 p-3 text-sm text-gray-300 border border-gray-800">
                    <p className="whitespace-pre-wrap">{retour.retours_artiste}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
