"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, changeLang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setError(t('auth.err_confirm'));
      } else if (error.message.includes("rate limit")) {
        setError("Trop de tentatives. Veuillez patienter quelques instants.");
      } else {
        setError(error.message === "Invalid login credentials" ? t('auth.err_invalid') : error.message);
      }
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Veuillez saisir votre adresse email ci-dessus avant de cliquer.");
      return;
    }
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    setLoading(false);
    if (error) {
      if (error.message.includes("rate limit")) {
        setError("Sécurité anti-spam : Trop de tentatives. Veuillez réessayer dans une heure.");
      } else {
        setError(error.message);
      }
    } else {
      setMsg("Un email de réinitialisation a été envoyé à " + email);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative">
      
      <div className="absolute top-6 right-6 flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-2 backdrop-blur-md">
        <Globe size={16} className="text-gray-500" />
        <div className="flex gap-3 border-l border-gray-700 pl-3">
          <button onClick={() => changeLang('fr')} className={`text-xs font-bold transition-colors ${lang === 'fr' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>FR</button>
          <button onClick={() => changeLang('en')} className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>EN</button>
          <button onClick={() => changeLang('pt')} className={`text-xs font-bold transition-colors ${lang === 'pt' ? 'text-[#4ade80]' : 'text-gray-500 hover:text-white'}`}>PT</button>
        </div>
      </div>

      <div className="w-full max-w-md rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <h1 className="mb-2 text-center text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          LACAV & me
        </h1>
        <p className="mb-8 text-center text-gray-400 font-bold">{t('auth.login.subtitle')}</p>
        
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm font-bold text-red-500 text-center">
            {error}
          </div>
        )}

        {msg && (
          <div className="mb-6 rounded-lg border border-[#4ade80]/50 bg-[#4ade80]/10 p-3 text-sm font-bold text-[#4ade80] text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.btn.login')}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 text-sm font-bold text-gray-400">
          <button onClick={handleResetPassword} disabled={loading} className="hover:text-white transition-colors">
            {t('auth.forgot_pwd')}
          </button>
          
          <div className="w-full border-t border-gray-800 pt-6 text-center">
            {t('auth.no_account')} <br/>
            <Link href="/register" className="text-[#4ade80] hover:underline mt-2 inline-block text-base">
              {t('auth.create_one')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
