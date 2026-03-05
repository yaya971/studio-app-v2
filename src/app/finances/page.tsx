"use client";
import React from 'react';
import { Wallet, Plus } from 'lucide-react';

export default function FinancesPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Finances
          </h1>
          <p className="mt-2 text-gray-400">Gérez vos revenus et dépenses du studio.</p>
        </div>
        
        <button className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]">
          <Plus size={20} />
          Ajouter une transaction
        </button>
      </div>

      <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
        <Wallet className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
        <h3 className="mb-2 text-xl font-bold text-white">Aucune transaction</h3>
        <p className="text-gray-400">Votre historique financier apparaîtra ici.</p>
      </div>
    </div>
  );
}
