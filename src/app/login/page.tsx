"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setError("Veuillez confirmer votre adresse email avant de vous connecter.");
      } else {
        setError(error.message === "Invalid login credentials" ? "Email ou mot de passe incorrect." : error.message);
      }
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
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
              required
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
          <button className="hover:text-white transition-colors">Mot de passe oublié ?</button>
          
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
