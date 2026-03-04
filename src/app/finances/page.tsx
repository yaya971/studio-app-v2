"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/lib/types';
import Modal from '@/components/Modal';
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<'Admin' | 'Artiste' | null>(null);

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Entrée' | 'Sortie'>('Entrée');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userRole = user.email?.includes('admin') ? 'Admin' : 'Artiste';
        setRole(userRole);
        
        if (userRole === 'Admin') {
          try {
            const data = await db.finances.getAll();
            setTransactions(data);
          } catch (err) {
            console.error(err);
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction = await db.finances.create({
        amount: parseFloat(amount),
        type,
        description,
        category,
        date: date || new Date().toISOString(),
      });
      setTransactions([newTransaction, ...transactions]);
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neon-green" size={48} /></div>;

  if (role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-red-500/20 rounded-2xl">
        <Wallet size={64} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Accès Restreint</h2>
        <p className="text-slate-400">Seuls les administrateurs peuvent consulter les finances.</p>
      </div>
    );
  }

  const balance = transactions.reduce((acc, t) => t.type === 'Entrée' ? acc + t.amount : acc - t.amount, 0);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Gestion <span className="neon-text">Financière</span>
          </h1>
          <p className="text-slate-400">Suivi des revenus et dépenses du studio.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-xl hover:neon-glow transition-all"
        >
          <Plus size={20} />
          Nouvelle Transaction
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-black border border-white/5 neon-border">
          <p className="text-slate-400 text-sm mb-1">Solde Total</p>
          <h2 className="text-4xl font-bold">{balance.toLocaleString()} €</h2>
        </div>
        <div className="p-8 rounded-2xl bg-black border border-white/5">
          <p className="text-slate-400 text-sm mb-1 text-neon-green">Total Entrées</p>
          <h2 className="text-3xl font-bold">+{transactions.filter(t => t.type === 'Entrée').reduce((acc, t) => acc + t.amount, 0).toLocaleString()} €</h2>
        </div>
        <div className="p-8 rounded-2xl bg-black border border-white/5">
          <p className="text-slate-400 text-sm mb-1 text-red-500">Total Sorties</p>
          <h2 className="text-3xl font-bold">-{transactions.filter(t => t.type === 'Sortie').reduce((acc, t) => acc + t.amount, 0).toLocaleString()} €</h2>
        </div>
      </div>

      <div className="bg-black border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Catégorie</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {t.type === 'Entrée' ? <ArrowUpRight className="text-neon-green" size={16} /> : <ArrowDownLeft className="text-red-500" size={16} />}
                    <span className="font-medium">{t.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-white/5 text-slate-400 text-xs">{t.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === 'Entrée' ? 'text-neon-green' : 'text-red-500'}`}>
                  {t.type === 'Entrée' ? '+' : '-'}{t.amount.toLocaleString()} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter une transaction">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Montant (€)</label>
              <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'Entrée' | 'Sortie')} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none">
                <option value="Entrée" className="bg-black">Entrée (+)</option>
                <option value="Sortie" className="bg-black">Sortie (-)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Catégorie</label>
            <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Studio, Matériel..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none" />
          </div>
          <button type="submit" className="w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:neon-glow-strong transition-all mt-4">Ajouter</button>
        </form>
      </Modal>
    </div>
  );
}
