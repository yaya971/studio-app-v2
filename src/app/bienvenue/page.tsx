"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function BienvenuePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-xl border border-[#4ade80]/30 bg-black/80 p-8 text-center shadow-[0_0_20px_rgba(74,222,128,0.1)] animate-in fade-in zoom-in duration-500">
        
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#4ade80]/10 text-[#4ade80] border-2 border-[#4ade80]/30 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-white">Compte confirmé ! 🎉</h1>
        
        <p className="mb-8 text-gray-400 font-bold leading-relaxed">
          Ton adresse email a bien été vérifiée. Tu es maintenant connecté(e) et tu peux accéder à ton espace artiste pour gérer tes projets.
        </p>
        
        <Link href="/" className="inline-flex w-full items-center justify-center rounded-lg bg-[#4ade80] py-3 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:scale-[1.02]">
          Aller sur mon Tableau de Bord
        </Link>
        
      </div>
    </div>
  );
}
