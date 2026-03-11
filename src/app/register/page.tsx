"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic2, Loader2, User, Mail, Lock, MailCheck, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({ nom: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { nom: formData.nom }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative">
      
      {/* SÉLECTEUR DE LANGUE EN HAUT À DROITE */}
      <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-md">
        <Globe size={16} className="text-gray-500" />
        <div className="flex gap-3 border-l border-gray-700 pl-3">
          <button onClick={() => changeLang('fr')} className={`text-xs font-bold transition-colors ${lang === 'fr' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>FR</button>
          <button onClick={() => changeLang('en')} className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>EN</button>
          <button onClick={() => changeLang('pt')} className={`text-xs font-bold transition-colors ${lang === 'pt' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>PT</button>
        </div>
      </div>

      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black/80 p-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        
        {success ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80] border-2 border-[#4ade80]/30 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
              <MailCheck size={40} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{t('auth.check_email.title')}</h1>
            <p className="text-gray-400 font-bold mb-8 leading-relaxed">
              {t('auth.check_email.desc')} <br/>
              <span className="text-white mt-2 inline-block">{formData.email}</span>
            </p>
            <button onClick={() => router.push('/')} className="w-full rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90">
              {t('auth.check_email.btn')}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                <Mic2 size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white">{t('auth.reg.title')}</h1>
              <p className="mt-2 text-gray-400 font-bold">{t('auth.reg.subtitle')}</p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-center text-sm font-bold text-red-500 border border-red-500/20">
                {t('auth.err_occurred')} {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-400">{t('auth.name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="text" required
                    value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-400">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="email" required
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-400">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input 
                    type="password" required minLength={6}
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="mt-6 w-full rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : t('auth.btn.register')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-bold text-gray-400">
              {t('auth.has_account')} <Link href="/login" className="text-[#4ade80] hover:underline">{t('auth.login_here')}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
