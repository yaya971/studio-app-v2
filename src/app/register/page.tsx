"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mic2, Loader2, User, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({ nom: '', email: '', password: '' });

  // Sécurité pour nettoyer le timer si le composant est détruit
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => router.push('/'), 2000);
    }
    return () => clearTimeout(timer);
  }, [success, router]);

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
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-black/80 p-8 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <Mic2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
          <p className="mt-2 text-gray-400 font-bold">Rejoignez le studio et suivez vos projets.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-center text-sm font-bold text-red-500 border border-red-500/20">
            Une erreur est survenue : {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 rounded-lg bg-[#4ade80]/10 p-6 text-center border border-[#4ade80]/30">
            <h3 className="text-xl font-bold text-[#4ade80] mb-2">Inscription réussie ! 🎉</h3>
            <p className="text-gray-300 font-bold">Votre espace artiste a été créé automatiquement.</p>
            <Loader2 className="animate-spin mx-auto mt-4 text-[#4ade80]" size={24} />
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Nom d'artiste</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" required
                  value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  placeholder="Ex: Daft Punk"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="email" required
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  placeholder="artiste@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="password" required minLength={6}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:border-[#4ade80] focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Créer mon espace"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm font-bold text-gray-400">
          Déjà un compte ? <Link href="/login" className="text-[#4ade80] hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
