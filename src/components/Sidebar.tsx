"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Mic2, 
  Wallet,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<'Admin' | 'Artiste' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        const userRole = user.email?.includes('admin') ? 'Admin' : 'Artiste';
        setRole(userRole);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['Admin', 'Artiste'] },
    { name: 'Artistes', icon: Users, href: '/artistes', roles: ['Admin'] },
    { name: 'Projets', icon: Briefcase, href: '/projets', roles: ['Admin', 'Artiste'] },
    { name: 'Sessions', icon: Mic2, href: '/sessions', roles: ['Admin', 'Artiste'] },
    { name: 'Finances', icon: Wallet, href: '/finances', roles: ['Admin'] },
  ];

  const filteredItems = menuItems.filter(item => !role || item.roles.includes(role));

  if (pathname === '/login') return null;

  return (
    <aside className="w-64 h-screen sticky top-0 bg-black border-r border-neon-green/30 p-6 flex flex-col gap-8 shadow-[5px_0_15px_-5px_rgba(74,222,128,0.2)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-neon-green neon-glow flex items-center justify-center">
          <span className="text-black font-bold text-xl">N</span>
        </div>
        <h1 className="text-xl font-bold neon-text tracking-widest">NEON DASH</h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
                ${isActive 
                  ? 'bg-neon-green/10 text-neon-green neon-border' 
                  : 'text-slate-400 hover:text-neon-green hover:bg-neon-green/5'
                }`}
            >
              <Icon size={20} className={`${isActive ? 'neon-text' : 'group-hover:neon-text'}`} />
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {userEmail && (
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-white font-medium truncate">{userEmail}</p>
              <p className="text-[10px] text-neon-green uppercase tracking-wider font-bold">{role}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="w-full py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
