"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Folder, Mic2, Wallet, Loader2, Music, Clock, MessageSquare, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [adminStats, setAdminStats] = useState({ artistes: 0, projets: 0, sessions: 0, revenus: 0 });
  const [adminRecentSessions, setAdminRecentSessions] = useState<any[]>([]);
  const [adminRetours, setAdminRetours] = useState<any[]>([]);

  const [artisteData, setArtisteData] = useState({ nom: '', projets: [] as any[], prochainesSessions: [] as any[] });

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();

      if (artiste) {
        setRole('ARTISTE');
        const { data: projets } = await supabase.from('projets').select('*, chansons(*)').eq('artiste_id', artiste.id);
        const { data: sessions } = await supabase.from('sessions').select('*, projets!inner(artiste_id, title)').eq('projets.artiste_id', artiste.id).gte('date', new Date().toISOString()).order('date', { ascending: true }).limit(3);
        setArtisteData({ nom: artiste.nom, projets: projets || [], prochainesSessions: sessions || [] });
      } else {
        setRole('ADMIN');
        const { count: artistesCount } = await supabase.from('artistes').select('*', { count: 'exact', head: true });
        const { count: projetsCount } = await supabase.from('projets').select('*', { count: 'exact', head: true });
        const { count: sessionsCount, data: sessionsData } = await supabase.from('sessions').select('*, projets(title, artistes(nom))', { count: 'exact' }).order('date', { ascending: false }).limit(5);
        const { data: financesData } = await supabase.from('finances').select('amount, type');
        
        let totalRevenus = 0;
        if (financesData) {
          totalRevenus = financesData.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
        }

        const { data: retoursData } = await supabase
          .from('chansons')
          .select('id, titre, retours_artiste, projets(title, artistes(nom))')
          .neq('retours_artiste', '')
          .not('retours_artiste', 'is', null);

        setAdminStats({ artistes: artistesCount || 0, projets: projetsCount || 0, sessions: sessionsCount || 0, revenus: totalRevenus });
        if (sessionsData) setAdminRecentSessions(sessionsData);
        if (retoursData) setAdminRetours(retoursData);
      }
    } catch (error) { console.error("Erreur de chargement :", error); } 
    finally { setLoading(false); }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#10b981]" size={48} /></div>;

  // ==========================================
  // VUE 1 : L'ESPACE ARTISTE (Épuré)
  // ==========================================
  if (role === 'ARTISTE') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-light text-white tracking-wide">Bonjour, <span className="font-bold text-[#10b981]">{artisteData.nom}</span></h1>
          <p className="mt-2 text-zinc-400 font-light">Bienvenue sur votre espace personnel LACAV & me.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-zinc-300 flex items-center gap-2"><Folder className="text-[#10b981]" size={18}/> Projets en cours</h2>
            
            {artisteData.projets.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/20 p-8 text-center text-zinc-500 font-light">Aucun projet en cours pour le moment.</div>
            ) : (
              artisteData.projets.map(projet => {
                const totalSongs = projet.chansons?.length || 0;
                const terminees = projet.chansons?.filter((c: any) => c.status === 'TERMINÉ').length || 0;
                const enMix = projet.chansons?.filter((c: any) => c.status === 'MIXAGE/MASTERING').length || 0;
                const enAttente = projet.chansons?.filter((c: any) => c.status === 'EN ATTENTE DE CORRECTION DE LA PART DE LARTISTE').length || 0;
                const enEnregistrement = projet.chansons?.filter((c: any) => c.status === 'ENREGISTREMENT').length || 0;

                return (
                  <div key={projet.id} className="rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:bg-white/[0.04]">
                    <div className="mb-5 flex items-center justify-between border-b border-zinc-800/50 pb-4">
                      <h3 className="text-xl font-medium text-white">{projet.title}</h3>
                      <span className="text-zinc-400 flex items-center gap-1.5 text-sm font-light px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800"><Music size={14} /> {totalSongs} Titre{totalSongs > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="space-y-3 text-sm font-light">
                      {totalSongs === 0 ? (
                        <p className="text-center text-zinc-600 italic py-2">Aucun titre ajouté.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {terminees > 0 && <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"><span className="text-zinc-400 text-xs uppercase tracking-wider">Terminées</span><span className="text-[#10b981] font-medium text-lg">{terminees}</span></div>}
                          {enMix > 0 && <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"><span className="text-zinc-400 text-xs uppercase tracking-wider">En Mix</span><span className="text-white font-medium text-lg">{enMix}</span></div>}
                          {enAttente > 0 && <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"><span className="text-zinc-400 text-xs uppercase tracking-wider">En attente</span><span className="text-orange-400 font-medium text-lg">{enAttente}</span></div>}
                          {enEnregistrement > 0 && <div className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50"><span className="text-zinc-400 text-xs uppercase tracking-wider">Enregistrement</span><span className="text-blue-400 font-medium text-lg">{enEnregistrement}</span></div>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-zinc-300 flex items-center gap-2"><Clock className="text-[#10b981]" size={18}/> Prochaines Sessions</h2>
            <div className="rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-6 backdrop-blur-md">
              {artisteData.prochainesSessions.length === 0 ? (
                <p className="text-zinc-500 text-center text-sm font-light py-4">Aucune session prévue.</p>
              ) : (
                <div className="space-y-5">
                  {artisteData.prochainesSessions.map(session => (
                    <div key={session.id} className="relative pl-4 border-l-2 border-[#10b981]/30">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#10b981]"></div>
                      <h4 className="font-medium text-white">{session.title}</h4>
                      <p className="text-sm text-zinc-400 font-light mt-0.5">{session.projets?.title}</p>
                      <span className="inline-block mt-2 rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-300 border border-zinc-800">{formatDate(session.date)}</span>
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
  // VUE 2 : L'ESPACE ADMIN (Épuré)
  // ==========================================
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-light text-white tracking-wide">Vue d'ensemble</h1>
        <p className="mt-2 text-zinc-400 font-light">Gérez votre studio avec précision.</p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Artistes Actifs", value: adminStats.artistes, icon: Users },
          { label: "Projets en cours", value: adminStats.projets, icon: Folder },
          { label: "Sessions", value: adminStats.sessions, icon: Mic2 },
          { label: "Revenus", value: `${adminStats.revenus.toFixed(2)} €`, icon: Wallet, highlight: true }
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:bg-white/[0.04]">
            <div className="mb-4 flex items-center justify-between">
              <stat.icon className="text-[#10b981]" size={22} />
            </div>
            <p className="text-sm text-zinc-400 font-light mb-1">{stat.label}</p>
            <h2 className={`text-3xl font-medium ${stat.highlight ? 'text-[#10b981]' : 'text-white'}`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* COLONNE 1 : SESSIONS RÉCENTES */}
        <div className="rounded-2xl border border-zinc-800/50 bg-white/[0.02] p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-medium text-zinc-200 flex items-center gap-2"><Clock size={18} className="text-[#10b981]" /> Sessions Récentes</h3>
          {adminRecentSessions.length === 0 ? <p className="text-zinc-500 font-light text-center py-6">Aucune session.</p> : (
            <div className="space-y-3">
              {adminRecentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-xl border border-zinc-800/30 bg-zinc-900/30 p-4 transition-colors hover:bg-zinc-900/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]"><Mic2 size={18} /></div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-white truncate">{session.title}</h4>
                      <p className="text-sm text-zinc-400 font-light truncate">{session.projets?.artistes?.nom} • {session.projets?.title}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-zinc-500 font-light bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">{formatDate(session.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE 2 : NOTIFICATIONS DE RETOURS */}
        <div className="rounded-2xl border border-orange-900/30 bg-gradient-to-b from-orange-500/[0.03] to-transparent p-6 backdrop-blur-md">
          <h3 className="mb-6 text-lg font-medium text-orange-400 flex items-center gap-2">
            <Bell size={18} className="animate-pulse" /> Retours à traiter
          </h3>
          {adminRetours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
              <MessageSquare size={32} className="mb-3 opacity-30" />
              <p className="font-light">Aucun retour en attente.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {adminRetours.map((retour) => (
                <div key={retour.id} className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 transition-all hover:border-orange-500/40">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white">{retour.titre}</h4>
                      <p className="text-xs text-zinc-400 font-light flex items-center gap-1 mt-1">
                        <Folder size={12} /> {retour.projets?.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                      {retour.projets?.artistes?.nom}
                    </span>
                  </div>
                  <div className="rounded-lg bg-black/40 p-3.5 text-sm text-zinc-300 border border-zinc-800/80 font-light leading-relaxed">
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
