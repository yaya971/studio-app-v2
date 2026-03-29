"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Grid, Users, Folder, Mic2, Wallet, LogOut, Calendar, ShoppingCart, UserCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);

  useEffect(() => {
    checkUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      checkUserRole(); 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setRole(null);
      return;
    }

    const { data: artiste } = await supabase
      .from('artistes')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

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

  // LISTE BLINDÉE AVEC TEXTES DE SECOURS
  const navItems = [
    { name: t('menu.dashboard') || 'Dashboard', path: '/', icon: Grid, allowed: ['ADMIN', 'ARTISTE'] },
    { name: t('menu.reservations') || 'Réservations', path: '/reservations', icon: Calendar, allowed: ['ADMIN', 'ARTISTE'] },
    { name: t('menu.services') || 'Services', path: '/services', icon: ShoppingCart, allowed: ['ADMIN', 'ARTISTE'] },
    { name: t('menu.projets') || 'Projets', path: '/projets', icon: Folder, allowed: ['ADMIN', 'ARTISTE'] },
    { name: t('menu.sessions') || 'Sessions', path: '/sessions', icon: Mic2, allowed: ['ADMIN', 'ARTISTE'] },
    { name: t('menu.artistes') || 'Artistes', path: '/artistes', icon: Users, allowed: ['ADMIN'] },
    { name: t('menu.finances') || 'Finances', path: '/finances', icon: Wallet, allowed: ['ADMIN'] },
    { name: t('menu.profil') || 'Profil', path: '/profil', icon: UserCircle, allowed: ['ADMIN', 'ARTISTE'] },
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

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-hide">
        {navItems.filter(item => item.allowed.includes(role)).map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-bold transition-all ${
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

      {/* SECTION DU BAS : LANGUES + DÉCONNEXION */}
      <div className="mt-auto border-t border-gray-800 pt-6">
        <div className="flex justify-center gap-6 mb-6">
          <button onClick={() => changeLang('fr')} className={`text-xs font-bold transition-all ${lang === 'fr' ? 'bg-[#4ade80] text-black px-2 py-0.5 rounded' : 'text-gray-500 hover:text-white'}`}>FR</button>
          <button onClick={() => changeLang('en')} className={`text-xs font-bold transition-all ${lang === 'en' ? 'bg-[#4ade80] text-black px-2 py-0.5 rounded' : 'text-gray-500 hover:text-white'}`}>EN</button>
          <button onClick={() => changeLang('pt')} className={`text-xs font-bold transition-all ${lang === 'pt' ? 'bg-[#4ade80] text-black px-2 py-0.5 rounded' : 'text-gray-500 hover:text-white'}`}>PT</button>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-bold text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/30"
        >
          <LogOut size={20} />
          {t('prof.logout') || 'Déconnexion'}
        </button>
      </div>
    </div>
  );
}
