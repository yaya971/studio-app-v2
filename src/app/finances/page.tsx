"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Loader2, ArrowUpRight, ArrowDownRight, Edit, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'income',
    description: '',
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('finances')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setFormData({ amount: '', type: 'income', description: '', date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction: any) => {
    setFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().slice(0, 10)
    });
    setEditingId(transaction.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, description: string) => {
    if (window.confirm(`Supprimer la transaction "${description}" ?`)) {
      const { error } = await supabase.from('finances').delete().eq('id', id);
      if (!error) fetchTransactions();
      else alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSave = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    };
    
    if (editingId) {
      const { error } = await supabase.from('finances').update(dataToSave).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchTransactions(); }
      else alert("Erreur lors de la modification.");
    } else {
      const { error } = await supabase.from('finances').insert([dataToSave]);
      if (!error) { setIsModalOpen(false); fetchTransactions(); }
      else alert("Erreur lors de la création.");
    }
    setIsSubmitting(false);
  };

  const totalRevenus = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalDepenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const solde = totalRevenus - totalDepenses;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
            Finances
          </h1>
          <p className="mt-2 text-gray-400">Gérez vos revenus et dépenses du studio.</p>
        </div>
        
        <button 
          onClick={openNewModal} 
          className="flex items-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
        >
          <Plus size={20} />
          Nouvelle transaction
        </button>
      </div>

      {!loading && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-black/50 p-6">
            <p className="text-sm text-gray-400">Solde Total</p>
            <h2 className={`text-3xl font-bold ${solde >= 0 ? 'text-[#4ade80]' : 'text-red-500'}`}>{solde.toFixed(2)} €</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-black/50 p-6">
            <p className="text-sm text-gray-400">Revenus</p>
            <h2 className="text-3xl font-bold text-[#4ade80]">+{totalRevenus.toFixed(2)} €</h2>
          </div>
          <div className="rounded-xl border border-gray-800 bg-black/50 p-6">
            <p className="text-sm text-gray-400">Dépenses</p>
            <h2 className="text-3xl font-bold text-red-500">-{totalDepenses.toFixed(2)} €</h2>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin text-[#4ade80]" size={32} />
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-8 text-center shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <Wallet className="mx-auto mb-4 text-[#4ade80]/50" size={48} />
          <h3 className="mb-2 text-xl font-bold text-white">Aucune transaction</h3>
          <p className="text-gray-400">Votre historique financier apparaîtra ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="group relative flex items-center justify-between rounded-xl border border-gray-800 bg-black/50 p-4 transition-all hover:border-[#4ade80]/30">
              
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                  transaction.type === 'income' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-red-500/10 text-red-500'
                }`}>
                  {transaction.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-white">{transaction.description}</h3>
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Calendar size={14} /> {formatDate(transaction.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className={`text-xl font-bold ${transaction.type === 'income' ? 'text-[#4ade80]' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount} €
                </span>

                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleEditClick(transaction)} className="rounded p-2 text-gray-400 hover:bg-[#4ade80]/20 hover:text-[#4ade80]">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(transaction.id, transaction.description)} className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Modifier la transaction" : "Nouvelle Transaction"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Type d'opération *</label>
            <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [&>option]:bg-black">
              <option value="income">Revenu (+)</option>
              <option value="expense">Dépense (-)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Montant (€) *</label>
            <input type="number" step="0.01" min="0" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" placeholder="Ex: 150.00" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Description *</label>
            <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none" placeholder="Ex: Mixage EP ou Achat micro" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">Date *</label>
            <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border border-[#4ade80]/30 bg-black/50 px-4 py-2 text-white focus:border-[#4ade80] focus:outline-none [color-scheme:dark]" />
          </div>
          <button type="submit
