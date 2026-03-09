"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
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
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <h1 className="mb-6 text-center text-2xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          STUDIO LOGIN
        </h1>
        
        {error && (
          <div className="mb-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white focus:border-[#4ade80] focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white focus:border-[#4ade80] focus:outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-gray-400">
          <button className="hover:text-white hover:underline transition-colors">Mot de passe oublié ?</button>
          
          <div className="mt-2 border-t border-gray-800 w-full pt-4 text-center">
            Pas encore de compte ? <br/>
            {/* LE FAMEUX LIEN VERS LA PAGE REGISTER */}
            <Link href="/register" className="text-[#a855f7] font-bold hover:underline mt-1 inline-block text-base">
              Créer mon espace Artiste
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
