"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut, Loader2, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProfilPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();

      if (artiste) { setUserData({ ...artiste, email: session.user.email, role: 'Artiste' }); } 
      else { setUserData({ nom: 'Administrateur', email: session.user.email, role: 'Admin' }); }
      
      setLoading(false);
    }
    getUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('prof.title')}</h1><p className="mt-2 text-gray-400 font-bold">{t('prof.subtitle')}</p></div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 font-bold text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20"><LogOut size={20} /> {t('prof.logout')}</button>
      </div>

      <div className="rounded-xl border border-gray-800 bg-black/50 p-8 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4ade80]/10 border-2 border-[#4ade80]/30 text-[#4ade80]"><UserCircle size={64} /></div>
          <div><h2 className="text-2xl font-bold text-white mb-1">{userData?.nom}</h2><span className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-bold text-gray-300 uppercase">{userData?.role}</span></div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">{t('prof.info')}</h3>
          {userData ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800"><div className="flex items-center gap-2 mb-2 text-gray-400"><UserCircle size={16} /><span className="text-xs font-bold uppercase">{t('prof.name')}</span></div><p className="font-bold text-white">{userData.nom}</p></div>
              <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800"><div className="flex items-center gap-2 mb-2 text-gray-400"><Mail size={16} /><span className="text-xs font-bold uppercase">{t('prof.email')}</span></div><p className="font-bold text-white">{userData.email}</p></div>
              {userData.created_at && (
                <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800 sm:col-span-2"><div className="flex items-center gap-2 mb-2 text-gray-400"><Calendar size={16} /><span className="text-xs font-bold uppercase">{t('prof.member')}</span></div><p className="font-bold text-[#4ade80]">{formatDate(userData.created_at)}</p></div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 font-bold">{t('prof.no_info')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
