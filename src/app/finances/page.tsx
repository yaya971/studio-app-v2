"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, Plus, Loader2, CalendarDays, DollarSign, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function FinancesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenus: 0, depenses: 0, balance: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income', // 'income' pour revenu, 'expense' pour dépense
  });

  useEffect(() => {
    fetchFinances();
  }, []);

  const fetchFinances = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      // VÉRIFICATION SÉCURITÉ : Est-ce bien l'Admin ?
      const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      if (artiste) {
        router.push('/'); // Si c'est un artiste, on l'éjecte vers l'accueil
        return;
      }
      setIsAdmin(true);

      // On récupère toutes les finances
      const { data, error } = await supabase.from('finances').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      if (data) {
        setTransactions(data);
        // Calcul des statistiques
        let totalRevenus = 0;
        let totalDepenses = 0;
        data.forEach(t => {
          if (t.type === 'income') totalRevenus += Number(t.amount);
          if (t.type === 'expense') totalDepenses += Number(t.amount);
        });
        setStats({ revenus: totalRevenus, depenses: totalDepenses, balance: totalRevenus - totalDepenses });
      }
    } catch (error) {
      console.error("Erreur de chargement des finances :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('finances').insert([{
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type
    }]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ description: '', amount: '', type: 'income' });
      fetchFinances();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer cette transaction ?")) {
      const { error } = await supabase.from('finances').delete().eq('id', id);
      if (!error) fetchFinances();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;
  if (!isAdmin) return null; // Sécurité invisible

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Trésorerie</h1>
          <p className="mt-2 text-gray-400 font-bold">Gardez un œil sur la santé financière du studio.</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90">
          <Plus size={20} /> Ajouter une transaction
        </button>
      </div>

      {/* LES 3 CARTES STATISTIQUES */}
      <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Revenus</h3>
            <div className="rounded-lg bg-[#4ade80]/10 p-2 text-[#4ade80]"><TrendingUp size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.revenus.toFixed(2)} €</p>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Dépenses</h3>
            <div className="rounded-lg bg-red-500/10 p-2 text-red-500"><TrendingDown size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.depenses.toFixed(2)} €</p>
        </div>

        <div className={`rounded-xl border p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${stats.balance >= 0 ? 'border-[#4ade80]/30 bg-[#4ade80]/5' : 'border-red-500/30 bg-red-500/5'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${stats.balance >= 0 ? 'text-[#4ade80]' : 'text-red-500'}`}>Bénéfice Net</h3>
            <div className={`rounded-lg p-2 ${stats.balance >= 0 ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-red-500/20 text-red-500'}`}><Wallet size={20} /></div>
          </div>
          <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-[#4ade80]' : 'text-red-500'}`}>{stats.balance.toFixed(2)} €</p>
        </div>
      </div>

      {/* L'HISTORIQUE DES TRANSACTIONS */}
      <div className="rounded-xl border border-gray-800 bg-black/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="border-b border-gray-800 bg-gray-900/50 p-4">
          <h2 className="font-bold text-white flex items-center gap-2"><CalendarDays size={18} className="text-[#4ade80]" /> Historique récent</h2>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold">Aucune transaction enregistrée.</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 transition-colors hover:bg-gray-900/30 group">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.type === 'income' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-red-500/10 text-red-500'}`}>
                    {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.description}</p>
                    <p className="text-xs font-bold text-gray-500">{formatDate(t.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${t.type === 'income' ? 'text-[#4ade80]' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} €
                  </span>
                  <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all rounded bg-gray-900/80">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL : NOUVELLE TRANSACTION */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Type d'opération *</label>
            <div className="flex gap-4">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 bg-black/50 py-3 font-bold transition-all has-[:checked]:border-[#4ade80] has-[:checked]:bg-[#4ade80]/10 has-[:checked]:text-[#4ade80]">
                <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} className="hidden" />
                <TrendingUp size={18} /> Entrée (+)
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 bg-black/50 py-3 font-bold transition-all has-[:checked]:border-red-500 has-[:checked]:bg-red-500/10 has-[:checked]:text-red-500">
                <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} className="hidden" />
                <TrendingDown size={18} /> Sortie (-)
              </label>
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Description *</label>
            <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" placeholder="Ex: Mixage Daft Punk, Achat Micro..." />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Montant (€) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="number" step="0.01" min="0" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 py-2 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-[#4ade80]" placeholder="0.00" />
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Valider'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
