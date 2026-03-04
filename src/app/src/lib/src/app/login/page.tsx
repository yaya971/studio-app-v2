src/app/login/page.tsx

"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl neon-border bg-black relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-green/10 rounded-full blur-3xl group-hover:bg-neon-green/20 transition-all"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green neon-glow mb-4">
            <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Connexion <span className="neon-text">Néon</span>
          </h2>
          <p className="mt-2 text-slate-400">Entrez vos accès pour continuer</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6 relative z-10">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-green transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-green transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neon-green text-black font-bold rounded-xl hover:neon-glow-strong transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <a href="#" className="text-slate-500 hover:text-neon-green transition-colors">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
}
