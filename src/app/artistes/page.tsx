"use client";

import React from 'react';
import { Users, Plus } from 'lucide-react';

export default function ArtistesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Artistes
          </h1>
          <p className="mt-2 text-gray-400">Gérez votre répertoire d'artistes.</p>
        </div>
        
        <button className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]">
          <Plus size={20} />
          Ajouter un artiste
        </button>
      </div>

      <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <Users className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
        <h3 className="mb-2 text-xl font-bold text-white">Aucun artiste pour le moment</h3>
        <p className="text-gray-400">Cliquez sur le bouton en haut à droite pour ajouter votre premier artiste.</p>
      </div>
    </div>
  );
}
