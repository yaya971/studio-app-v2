"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Erreur : Identifiants incorrects.");
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email d'abord.");
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      setError("Erreur lors de l'envoi de l'email.");
    } else {
      setMessage("Un email de réinitialisation a été envoyé ! Vérifiez vos spams.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#4ade80] bg-black p-8 shadow-[0_0_30px_rgba(74,222,128,0.15)]">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          STUDIO LOGIN
        </h1>
        
        {error && <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-[#4ade80] bg-[#4ade80]/10 p-3 text-sm text-[#4ade80]">{message}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 py-2 pl-10 pr-4 text-white focus:border-[#4ade80] focus:outline-none" required />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm text-gray-400">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 py-2 pl-10 pr-4 text-white focus:border-[#4ade80] focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Connexion'}
          </button>
        </form>

        <button onClick={handleResetPassword} disabled={loading} className="mt-4 w-full text-center text-sm text-gray-500 hover:text-[#4ade80] underline">
          Mot de passe oublié ?
        </button>
      </div>
    </div>
  );
}
