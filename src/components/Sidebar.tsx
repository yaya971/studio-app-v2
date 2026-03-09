"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Grid, Users, Folder, Mic2, Wallet, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);

  useEffect(() => {
    checkUserRole();

    // NOUVEAU : Le radar de Supabase qui écoute les changements de connexion
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      checkUserRole(); // On relance la vérification dès qu'il y a un changement !
    });

    // On éteint le radar si on quitte la page
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si personne n'est connecté, on vide le rôle
    if (!session) {
      setRole(null);
      return;
    }

    const { data: artiste } = await supabase
      .from('artistes')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (artiste) {
      setRole('ARTISTE');
    } else {
      setRole('ADMIN');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (!role) return <div className="flex h-screen w-64 flex-col border-r border-gray-800 bg-black/50 p-6" />;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Grid, allowed: ['ADMIN', 'ARTISTE'] },
    { name: 'Artistes', path: '/artistes', icon: Users, allowed: ['ADMIN'] },
    { name: 'Projets', path: '/projets', icon: Folder, allowed: ['ADMIN', 'ARTISTE'] },
    { name: 'Sessions', path: '/sessions', icon: Mic2, allowed: ['ADMIN', 'ARTISTE'] },
    { name: 'Finances', path: '/finances', icon: Wallet, allowed: ['ADMIN'] },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-800 bg-black/50 p-6">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#10b981] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          LACAV & me
        </h2>
        <div className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold border ${
          role === 'ADMIN' 
            ? 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10' 
            : 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10'
        }`}>
          {role}
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.filter(item => item.allowed.includes(role)).map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive 
                  ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout} 
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-500"
      >
        <LogOut size={20} />
        Déconnexion
      </button>
    </div>
  );
}
