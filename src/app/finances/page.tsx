"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, Plus, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { useLanguage } from '@/lib/LanguageContext';

export default function FinancesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ description: '', amount: '', type: 'income', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => { checkAdminAndFetch(); }, []);

  const checkAdminAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }

    const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
    if (artiste) { router.push('/'); return; }

    fetchTransactions();
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase.from('finances').select('*').order('date', { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    const amountNum = parseFloat(formData.amount);
    
    try {
      await supabase.from('finances').insert([{ description: formData.description, amount: amountNum, type: formData.type, date: formData.date }]);
      setIsModalOpen(false); setFormData({ description: '', amount: '', type: 'income', date: new Date().toISOString().slice(0, 10) });
      fetchTransactions();
    } catch (error) { console.error(error); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Supprimer cette transaction ?")) {
      await supabase.from('finances').delete().eq('id', id); fetchTransactions();
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('fin.title')}</h1><p className="mt-2 text-gray-400 font-bold">{t('fin.subtitle')}</p></div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black transition-all hover:bg-[#4ade80]/90"><Plus size={20} /> {t('fin.add')}</button>
      </div>

      <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]"><div className="flex items-center gap-3 mb-2"><Wallet className="text-[#4ade80]" size={24} /><h3 className="text-gray-400 font-bold">{t('fin.balance')}</h3></div><p className="text-3xl font-bold text-white">{balance.toFixed(2)} €</p></div>
        <div className="rounded-xl border border-blue-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]"><div className="flex items-center gap-3 mb-2"><TrendingUp className="text-blue-400" size={24} /><h3 className="text-gray-400 font-bold">{t('fin.income')}</h3></div><p className="text-3xl font-bold text-white">+{totalIncome.toFixed(2)} €</p></div>
        <div className="rounded-xl border border-red-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]"><div className="flex items-center gap-3 mb-2"><TrendingDown className="text-red-500" size={24} /><h3 className="text-gray-400 font-bold">{t('fin.expense')}</h3></div><p className="text-3xl font-bold text-white">-{totalExpense.toFixed(2)} €</p></div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-black/50 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="border-b border-gray-800 text-xs uppercase text-gray-500 font-bold">
              <tr><th className="px-4 py-3">{t('fin.col.date')}</th><th className="px-4 py-3">{t('fin.col.desc')}</th><th className="px-4 py-3">{t('fin.col.type')}</th><th className="px-4 py-3 text-right">{t('fin.col.amount')}</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center font-bold text-gray-500">{t('fin.empty')}</td></tr>
              ) : (
                transactions.map((tItem) => (
                  <tr key={tItem.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors font-bold">
                    <td className="px-4 py-4 text-white whitespace-nowrap">{formatDate(tItem.date)}</td>
                    <td className="px-4 py-4 text-white">{tItem.description}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs ${tItem.type === 'income' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                        {tItem.type === 'income' ? t('fin.income') : t('fin.expense')}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-right font-bold ${tItem.type === 'income' ? 'text-blue-400' : 'text-red-400'}`}>
                      {tItem.type === 'income' ? '+' : '-'}{Number(tItem.amount).toFixed(2)} €
                    </td>
                    <td className="px-4 py-4 text-right"><button onClick={() => handleDelete(tItem.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('fin.modal.title')}>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div><label className="mb-1 block text-sm font-bold text-gray-400">{t('fin.modal.desc')}</label><input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
          <div><label className="mb-1 block text-sm font-bold text-gray-400">{t('fin.modal.amount')}</label><input type="number" step="0.01" min="0" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
          <div><label className="mb-1 block text-sm font-bold text-gray-400">{t('fin.modal.type')}</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] [&>option]:bg-black"><option value="income">{t('fin.modal.type_in')}</option><option value="expense">{t('fin.modal.type_out')}</option></select></div>
          <div><label className="mb-1 block text-sm font-bold text-gray-400">{t('fin.modal.date')}</label><input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] [color-scheme:dark]" /></div>
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('fin.modal.btn')}</button>
        </form>
      </Modal>
    </div>
  );
}
