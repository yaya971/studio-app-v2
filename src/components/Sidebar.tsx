"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Folder, Mic2, Wallet, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier le rôle de l'utilisateur à la connexion
  useEffect(() => {
    async function getUserRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // On va chercher le rôle dans notre table 'users'
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setRole(data?.role || 'artiste'); // Par défaut on est artiste
      }
      setLoading(false);
    }
    getUserRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // On affiche un chargeur pendant qu'on vérifie l'identité
  if (loading) {
    return (
      <div className="flex h-screen w-64 flex-col items-center justify-center border-r border-[#4ade80]/30 bg-black">
        <Loader2 className="animate-spin text-[#4ade80]" size={32} />
      </div>
    );
  }

  // Le menu de base que tout le monde peut voir
  const baseMenu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projets', path: '/projets', icon: Folder },
    { name: 'Sessions', path: '/sessions', icon: Mic2 },
  ];

  // Le menu secret réservé à l'Admin
  const adminMenu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Artistes', path: '/artistes', icon: Users },
    { name: 'Projets', path: '/projets', icon: Folder },
    { name: 'Sessions', path: '/sessions', icon: Mic2 },
    { name: 'Finances', path: '/finances', icon: Wallet },
  ];

  // On choisit le bon menu selon le rôle
  const menuToDisplay = role === 'admin' ? adminMenu : baseMenu;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-[#4ade80]/30 bg-black p-4 shadow-[4px_0_24px_rgba(74,222,128,0.1)]">
      <div className="mb-8 p-2">
        <h1 className="text-2xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          STUDIO V2
        </h1>
        {/* Petit badge pour indiquer le rôle */}
        <span className="mt-1 inline-block rounded-full border border-[#4ade80]/50 bg-[#4ade80]/10 px-2 py-0.5 text-xs text-[#4ade80] uppercase tracking-wider">
          {role}
        </span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuToDisplay.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                isActive 
                  ? 'bg-[#4ade80]/10 text-[#4ade80] shadow-[inset_0_0_10px_rgba(74,222,128,0.2)]' 
                  : 'text-gray-400 hover:bg-[#4ade80]/5 hover:text-[#4ade80]'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-500"
      >
        <LogOut size={20} />
        <span>Déconnexion</span>
      </button>
    </div>
  );
}
