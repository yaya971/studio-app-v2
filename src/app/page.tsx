"use client";
import React, { useEffect, useState } from 'react';
import { Users, Folder, Mic2, Wallet, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    artistes: 0,
    projets: 0,
    sessions: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // Compter les Artistes
      const { count: artistesCount } = await supabase
        .from('artistes')
        .select('*', { count: 'exact', head: true });

      // Compter les Projets
      const { count: projetsCount } = await supabase
        .from('projets')
        .select('*', { count: 'exact', head: true });

      // Compter les Sessions et récupérer les 5 dernières
      const { count: sessionsCount, data: sessionsData } = await supabase
        .from('sessions')
        .select('*, projets(title, artistes(nom))', { count: 'exact' })
        .order('date', { ascending: false })
        .limit(5);

      setStats({
        artistes: artistesCount || 0,
        projets: projetsCount || 0,
        sessions: sessionsCount || 0,
      });

      if (sessionsData) {
        setRecentSessions(sessionsData);
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <Loader2 className="animate-spin text-[#4ade80]" size={48} />
      </div>
    );
  }

  // Formatage propre de la date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          Tableau de Bord
        </h1>
        <p className="mt-2 text-gray-400">Bienvenue dans votre interface de gestion néon.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte Artistes */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)] transition-all hover:border-[#4ade80]/60">
          <div className="mb-4 flex items-center justify-between">
            <Users className="text-[#4ade80]" size={24} />
          </div>
          <p className="text-sm text-gray-400">Artistes Actifs</p>
          <h2 className="text-3xl font-bold text-white">{stats.artistes}</h2>
        </div>

        {/* Carte Projets */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)] transition-all hover:border-[#4ade80]/60">
          <div className="mb-4 flex items-center justify-between">
            <Folder className="text-[#4ade80]" size={24} />
          </div>
          <p className="text-sm text-gray-400">Projets en cours</p>
          <h2 className="text-3xl font-bold text-white">{stats.projets}</h2>
        </div>

        {/* Carte Sessions */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)] transition-all hover:border-[#4ade80]/60">
          <div className="mb-4 flex items-center justify-between">
            <Mic2 className="text-[#4ade80]" size={24} />
          </div>
          <p className="text-sm text-gray-400">Sessions enregistrées</p>
          <h2 className="text-3xl font-bold text-white">{stats.sessions}</h2>
        </div>

        {/* Carte Finances (En attente) */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 opacity-50 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <div className="mb-4 flex items-center justify-between">
            <Wallet className="text-[#4ade80]" size={24} />
          </div>
          <p className="text-sm text-gray-400">Revenus (Bientôt)</p>
          <h2 className="text-3xl font-bold text-white">0 €</h2>
        </div>
      </div>

      {/* Sessions récentes */}
      <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <h3 className="mb-6 text-xl font-bold text-[#4ade80]">Sessions Récentes</h3>
        {recentSessions.length === 0 ? (
          <p className="text-gray-400">Aucune session pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-[#4ade80]/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80]">
                    <Mic2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{session.title}</h4>
                    {/* Ici on affiche clairement le projet ET l'artiste ! */}
                    <p className="text-sm font-medium text-[#4ade80]">
                      {session.projets?.artistes?.nom || 'Artiste inconnu'} • <span className="text-gray-400">{session.projets?.title}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {formatDate(session.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
