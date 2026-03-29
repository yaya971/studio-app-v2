"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Video, Globe, Zap, ShoppingCart, CheckCircle, Loader2, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { useLanguage } from '@/lib/LanguageContext';

export default function ServicesPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentArtisteId, setCurrentArtisteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formTab, setFormTab] = useState<'fr' | 'en' | 'pt'>('fr');
  
  const [serviceForm, setServiceForm] = useState({ 
    title: '', description: '', price: '',
    title_en: '', description_en: '', price_en: '',
    title_pt: '', description_pt: '', price_pt: ''
  });

  const serviceStyles = [
    { icon: ImageIcon, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30" },
    { icon: Video, color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30" },
    { icon: Globe, color: "text-orange-400", bgColor: "bg-orange-400/10", borderColor: "border-orange-400/30" },
    { icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" },
    { icon: ShoppingCart, color: "text-[#4ade80]", bgColor: "bg-[#4ade80]/10", borderColor: "border-[#4ade80]/30" },
  ];

  useEffect(() => { fetchData(); }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }

    const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
    if (artiste) { setCurrentArtisteId(artiste.id); setIsAdmin(false); } 
    else { setIsAdmin(true); }

    const { data } = await supabase.from('services_boutique').select('*').order('created_at', { ascending: true });
    if (data) setServices(data);
    setLoading(false);
  };

  const getLocalizedField = (service: any, field: string) => {
    if (lang === 'en' && service[`${field}_en`]) return service[`${field}_en`];
    if (lang === 'pt' && service[`${field}_pt`]) return service[`${field}_pt`];
    return service[field] || '';
  };

  const handleOpenOrderModal = (service: any) => { setSelectedService(service); setIsSent(false); setMessage(''); setIsOrderModalOpen(true); };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault(); if (!currentArtisteId) return;
    setIsSubmitting(true);
    const serviceTitle = getLocalizedField(selectedService, 'title');
    const { error } = await supabase.from('demandes_services').insert([{ artiste_id: currentArtisteId, service_title: serviceTitle, message: message }]);
    setIsSubmitting(false);
    if (!error) { setIsSent(true); setTimeout(() => setIsOrderModalOpen(false), 3000); }
  };

  const openEditModal = (service: any = null) => {
    setEditingService(service);
    setFormTab('fr');
    setServiceForm(service ? { 
      title: service.title || '', description: service.description || '', price: service.price || '',
      title_en: service.title_en || '', description_en: service.description_en || '', price_en: service.price_en || '',
      title_pt: service.title_pt || '', description_pt: service.description_pt || '', price_pt: service.price_pt || ''
    } : { 
      title: '', description: '', price: '',
      title_en: '', description_en: '', price_en: '',
      title_pt: '', description_pt: '', price_pt: ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    
    let error;
    if (editingService) { 
      const result = await supabase.from('services_boutique').update(serviceForm).eq('id', editingService.id); 
      error = result.error;
    } 
    else { 
      const result = await supabase.from('services_boutique').insert([serviceForm]); 
      error = result.error;
    }
    
    setIsSubmitting(false); 
    
    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
    } else {
      setIsEditModalOpen(false); 
      fetchData();
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Retirer ce service de la boutique ?")) {
      await supabase.from('services_boutique').delete().eq('id', id); fetchData();
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('srv.title')}</h1><p className="mt-2 text-gray-400 font-bold">{t('srv.subtitle')}</p></div>
        {isAdmin && (<button onClick={() => openEditModal()} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black hover:bg-[#4ade80]/90 transition-all"><Plus size={20} /> {t('srv.add')}</button>)}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const style = serviceStyles[index % serviceStyles.length];
          const Icon = style.icon;
          const displayTitle = getLocalizedField(service, 'title');
          const displayDesc = getLocalizedField(service, 'description');
          const displayPrice = getLocalizedField(service, 'price');

          return (
            <div key={service.id} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:border-[#4ade80]/50 hover:bg-black/80 group relative">
              {isAdmin && (
                <div className="absolute right-3 top-3 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100 z-10">
                  <button onClick={() => openEditModal(service)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-[#4ade80] border border-gray-700"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteService(service.id)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-red-500 border border-gray-700"><Trash2 size={14} /></button>
                </div>
              )}
              <div>
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${style.bgColor} ${style.borderColor} border`}><Icon size={28} className={style.color} /></div>
                <h3 className="mb-2 text-xl font-bold text-white pr-12">{displayTitle}</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">{displayDesc}</p>
              </div>
              <div className="mt-auto border-t border-gray-800 pt-5">
                <div className="mb-4 text-lg font-bold text-white">{displayPrice}</div>
                {!isAdmin && (<button onClick={() => handleOpenOrderModal(service)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-bold text-white transition-all hover:bg-[#4ade80] hover:text-black border border-gray-800 hover:border-[#4ade80]"><ShoppingCart size={18} /> {t('srv.order')}</button>)}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={t('srv.modal.order_title')}>
        {isSent ? (
          <div className="py-8 text-center flex flex-col items-center"><CheckCircle size={64} className="text-[#4ade80] mb-4" /><h3 className="text-xl font-bold text-white mb-2">{t('srv.modal.sent')}</h3><p className="text-gray-400 font-bold">{t('srv.modal.contact_soon')}</p></div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-900/50 p-4 border border-gray-800">
              <div><h4 className="font-bold text-white">{selectedService ? getLocalizedField(selectedService, 'title') : ''}</h4><p className="text-sm font-bold text-[#4ade80]">{selectedService ? getLocalizedField(selectedService, 'price') : ''}</p></div>
            </div>
            <div><label className="mb-2 block text-sm font-bold text-gray-400">{t('srv.modal.need')}</label><textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/50 p-4 text-white font-bold focus:outline-none focus:border-[#4ade80] min-h-[120px]" /></div>
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all disabled:opacity-50">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('srv.modal.send_btn')}</button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingService ? t('srv.modal.edit_title') : t('srv.modal.new_title')}>
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button type="button" onClick={() => setFormTab('fr')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'fr' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇫🇷 Français</button>
          <button type="button" onClick={() => setFormTab('en')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'en' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇬🇧 English</button>
          <button type="button" onClick={() => setFormTab('pt')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'pt' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇵🇹 Português</button>
        </div>

        <form onSubmit={handleSaveService} className="space-y-4">
          
          {/* CHAMPS FRANÇAIS */}
          <div className={formTab === 'fr' ? 'space-y-4 block' : 'hidden'}>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Titre (FR) *</label>
              <input type="text" required={formTab === 'fr'} value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Description (FR) *</label>
              <textarea required={formTab === 'fr'} value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Prix (FR) *</label>
              <input type="text" required={formTab === 'fr'} value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
          </div>

          {/* CHAMPS ANGLAIS */}
          <div className={formTab === 'en' ? 'space-y-4 block' : 'hidden'}>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Titre (EN)</label>
              <input type="text" value={serviceForm.title_en} onChange={(e) => setServiceForm({...serviceForm, title_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Description (EN)</label>
              <textarea value={serviceForm.description_en} onChange={(e) => setServiceForm({...serviceForm, description_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Prix (EN)</label>
              <input type="text" value={serviceForm.price_en} onChange={(e) => setServiceForm({...serviceForm, price_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
          </div>

          {/* CHAMPS PORTUGAIS */}
          <div className={formTab === 'pt' ? 'space-y-4 block' : 'hidden'}>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Titre (PT)</label>
              <input type="text" value={serviceForm.title_pt} onChange={(e) => setServiceForm({...serviceForm, title_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Description (PT)</label>
              <textarea value={serviceForm.description_pt} onChange={(e) => setServiceForm({...serviceForm, description_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-400">Prix (PT)</label>
              <input type="text" value={serviceForm.price_pt} onChange={(e) => setServiceForm({...serviceForm, price_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" />
            </div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('srv.modal.save_btn')}
          </button>
        </form>
      </Modal>

    </div>
  );
}
