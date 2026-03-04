import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity 
} from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Revenus Mensuels', value: '12 450 €', icon: TrendingUp, change: '+12.5%' },
    { label: 'Artistes Actifs', value: '48', icon: Users, change: '+3' },
    { label: 'Sessions Prévues', value: '12', icon: Calendar, change: 'Aujourd\'hui' },
    { label: 'Heures Studio', value: '156h', icon: Activity, change: '+24h' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Tableau de <span className="neon-text">Bord</span>
        </h1>
        <p className="text-slate-400">Bienvenue dans votre interface de gestion néon.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl bg-black border border-white/5 hover:neon-border transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                <stat.icon size={24} className="neon-text" />
              </div>
              <span className="text-xs font-medium text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-2xl bg-black border border-white/5 neon-glow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Projets Récents</h2>
            <button className="text-neon-green text-sm hover:underline">Voir tout</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-green/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green/20 to-transparent flex items-center justify-center border border-neon-green/20">
                    <span className="text-neon-green font-bold">P{i}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Album &quot;Neon Nights&quot; - Artiste {i}</h4>
                    <p className="text-xs text-slate-500 italic">Dernière modification: il y a 2h</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-neon-green neon-glow animate-pulse self-center mr-2"></div>
                   <span className="text-xs text-neon-green">En cours</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-black border border-neon-green/20">
          <h2 className="text-xl font-bold mb-6 neon-text">Activités</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-neon-green neon-glow z-10 relative"></div>
                  {i !== 4 && <div className="absolute top-3 left-1.5 w-0.5 h-12 bg-neon-green/20 -translate-x-1/2"></div>}
                </div>
                <div>
                  <p className="text-sm text-slate-300">Session de mixage terminée</p>
                  <p className="text-xs text-slate-500">14:30 · Studio A</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
