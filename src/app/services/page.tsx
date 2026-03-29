"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, Video, Globe, Zap, ShoppingCart, 
  CheckCircle, Loader2, Edit, Trash2, Plus, Music, Mic, Headphones, Star, CreditCard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { useLanguage } from '@/lib/LanguageContext';

const AVAILABLE_ICONS = [
  { id: 'image', component: ImageIcon }, { id: 'video', component: Video },
  { id: 'globe', component: Globe }, { id: 'zap', component: Zap },
  { id: 'cart', component: ShoppingCart }, { id: 'music', component: Music },
  { id: 'mic', component: Mic }, { id: 'headphones', component: Headphones },
  { id: 'star', component: Star }
];

const colorStyles = [
  { color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30" },
  { color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30" },
  { color: "text-orange-400", bgColor: "bg-orange-400/10", borderColor: "border-orange-400/30" },
  { color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" },
  { color: "text-[#4ade80]", bgColor: "bg-[#4ade80]/10", borderColor: "border-[#4ade80]/30" },
];

export default function ServicesPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentArtisteId, setCurrentArtisteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [paymentStatus, setPaymentStatus] = useState<'success' | 'canceled' | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formTab, setFormTab] = useState<'fr' | 'en' | 'pt'>('fr');
  
  const [serviceForm, setServiceForm] = useState({ 
    icon: 'image',
    title: '', description: '', price: '',
    title_en: '', description_en: '', price_en: '',
    title_pt: '', description_pt: '', price_pt: ''
  });

  useEffect(() => { 
    fetchData(); 
    
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) setPaymentStatus('success');
    if (query.get('canceled')) setPaymentStatus('canceled');
  }, [router]);

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

  const handleOpenOrderModal = (service: any) => { 
    setSelectedService(service); 
    setIsSent(false); 
    setMessage(''); 
    setIsOrderModalOpen(true); 
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!currentArtisteId || !selectedService) return;
    
    setIsSubmitting(true); // On lance le chargement

    try {
      const serviceTitle = getLocalizedField(selectedService, 'title');
      const servicePriceStr = getLocalizedField(selectedService, 'price');

      // 1. Sauvegarde dans la base de données
      const { error: dbError } = await supabase.from('demandes_services').insert([{ 
        artiste_id: currentArtisteId, 
        service_title: serviceTitle, 
        message: message 
      }]);

      if (dbError) {
        alert("Erreur de la base de données : " + dbError.message);
        setIsSubmitting(false);
        return;
      }

      // 2. Détection du prix
      const priceMatch = String(servicePriceStr).match(/\d+/);
      const amountInEuros = priceMatch ? parseInt(priceMatch[0], 10) : 0;

      // 3. Paiement Stripe OU Devis
      if (amountInEuros > 0) {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: serviceTitle, 
            amount: amountInEuros * 100 
          }),
        });
        
        const data = await res.json();
        
        if (data.url) {
          window.location.href = data.url; 
        } else {
          alert("Erreur Stripe : " + data.error);
          setIsSubmitting(false);
        }
      } else {
        // 4. C'est un Devis -> On arrête le chargement et on affiche le message de succès
        setIsSubmitting(false);
        setIsSent(true);
        setTimeout(() => {
          setIsOrderModalOpen(false);
          setIsSent(false); // On nettoie pour la prochaine fois
        }, 3000);
      }
    } catch (err: any) {
      alert("Une erreur inattendue est survenue : " + err.message);
      setIsSubmitting(false);
    }
  };

  const openEditModal = (service: any = null) => {
    setEditingService(service);
    setFormTab('fr');
    setServiceForm(service ? { 
      icon: service.icon || 'image',
      title: service.title || '', description: service.description || '', price: service.price || '',
      title_en: service.title_en || '', description_en: service.description_en || '', price_en: service.price_en || '',
      title_pt: service.title_pt || '', description_pt: service.description_pt || '', price_pt: service.price_pt || ''
    } : { 
      icon: 'image',
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
    } else { 
      const result = await supabase.from('services_boutique').insert([serviceForm]); 
      error = result.error;
    }
    setIsSubmitting(false); 
    if (error) { alert("Erreur lors de la sauvegarde : " + error.message); } 
    else { setIsEditModalOpen(false); fetchData(); }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Retirer ce service de la boutique ?")) {
      await supabase.from('services_boutique').delete().eq('id', id); fetchData();
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={32} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {paymentStatus === 'success' && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-[#4ade80]/50 bg-[#4ade80]/10 p-4 text-[#4ade80]">
          <CheckCircle size={24} />
          <div>
            <h3 className="font-bold">Paiement validé avec succès !</h3>
            <p className="text-sm">Merci pour ta commande. Nous avons bien reçu ta demande et ton paiement.</p>
          </div>
        </div>
      )}

      {paymentStatus === 'canceled' && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-orange-500/50 bg-orange-500/10 p-4 text-orange-500">
          <div>
            <h3 className="font-bold">Paiement annulé</h3>
            <p className="text-sm">Tu as annulé la transaction. N'hésite pas à revenir quand tu seras prêt.</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('srv.title') || 'Services'}</h1><p className="mt-2 text-gray-400 font-bold">{t('srv.subtitle') || 'Découvre nos services'}</p></div>
        {isAdmin && (<button onClick={() => openEditModal()} className="flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] px-4 py-2 font-bold text-black hover:bg-[#4ade80]/90 transition-all"><Plus size={20} /> {t('srv.add') || 'Ajouter'}</button>)}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => {
          const style = colorStyles[index % colorStyles.length];
          const iconObj = AVAILABLE_ICONS.find(i => i.id === service.icon) || AVAILABLE_ICONS[0];
          const IconComponent = iconObj.component;
          
          return (
            <div key={service.id} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:border-[#4ade80]/50 hover:bg-black/80 group relative">
              {isAdmin && (
                <div className="absolute right-3 top-3 flex gap-2 opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100 z-10">
                  <button onClick={() => openEditModal(service)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-[#4ade80] border border-gray-700"><Edit size={14} /></button>
                  <button onClick={() => handleDeleteService(service.id)} className="rounded bg-black/80 p-2 text-gray-400 hover:text-red-500 border border-gray-700"><Trash2 size={14} /></button>
                </div>
              )}
              <div>
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${style.bgColor} ${style.borderColor} border`}><IconComponent size={28} className={style.color} /></div>
                <h3 className="mb-2 text-xl font-bold text-white pr-12">{getLocalizedField(service, 'title')}</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">{getLocalizedField(service, 'description')}</p>
              </div>
              <div className="mt-auto border-t border-gray-800 pt-5">
                <div className="mb-4 text-lg font-bold text-white">{getLocalizedField(service, 'price')}</div>
                {!isAdmin && (<button onClick={() => handleOpenOrderModal(service)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-bold text-white transition-all hover:bg-[#4ade80] hover:text-black border border-gray-800 hover:border-[#4ade80]"><ShoppingCart size={18} /> {t('srv.order') || 'Commander'}</button>)}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={t('srv.modal.order_title') || 'Commande'}>
        {isSent ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-[#4ade80] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
            <p className="text-gray-400 font-bold">Nous te ferons une proposition très rapidement.</p>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-900/50 p-4 border border-gray-800">
              <div><h4 className="font-bold text-white">{selectedService ? getLocalizedField(selectedService, 'title') : ''}</h4><p className="text-sm font-bold text-[#4ade80]">{selectedService ? getLocalizedField(selectedService, 'price') : ''}</p></div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400">{t('srv.modal.need') || 'Ton besoin :'}</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Décris ton projet ici..." className="w-full rounded-lg border border-gray-700 bg-black/50 p-4 text-white font-bold focus:outline-none focus:border-[#4ade80] min-h-[120px]" />
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                String(selectedService?.price).match(/\d+/) ? <><CreditCard size={20} /> Payer en toute sécurité</> : (t('srv.modal.send_btn') || 'Envoyer')
              )}
            </button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editingService ? (t('srv.modal.edit_title') || 'Modifier') : (t('srv.modal.new_title') || 'Nouveau')}>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-gray-400">Icône du service</label>
          <div className="flex flex-wrap gap-3 pb-2">
            {AVAILABLE_ICONS.map((iconObj) => {
              const Icon = iconObj.component;
              const isSelected = serviceForm.icon === iconObj.id;
              return (
                <button key={iconObj.id} type="button" onClick={() => setServiceForm({...serviceForm, icon: iconObj.id})} className={`flex shrink-0 items-center justify-center h-12 w-12 rounded-lg border transition-all ${isSelected ? 'border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80] scale-110 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'border-gray-700 bg-black/50 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                  <Icon size={24} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button type="button" onClick={() => setFormTab('fr')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'fr' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇫🇷 Français</button>
          <button type="button" onClick={() => setFormTab('en')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'en' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇬🇧 English</button>
          <button type="button" onClick={() => setFormTab('pt')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formTab === 'pt' ? 'bg-[#4ade80] text-black' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'}`}>🇵🇹 Português</button>
        </div>

        <form onSubmit={handleSaveService} className="space-y-4">
          <div className={formTab === 'fr' ? 'space-y-4 block' : 'hidden'}>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Titre (FR) *</label><input type="text" required={formTab === 'fr'} value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Description (FR) *</label><textarea required={formTab === 'fr'} value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Prix (FR) *</label><input type="text" required={formTab === 'fr'} value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" placeholder="Ex: 50€ ou Sur devis" /></div>
          </div>
          <div className={formTab === 'en' ? 'space-y-4 block' : 'hidden'}>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Titre (EN)</label><input type="text" value={serviceForm.title_en} onChange={(e) => setServiceForm({...serviceForm, title_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Description (EN)</label><textarea value={serviceForm.description_en} onChange={(e) => setServiceForm({...serviceForm, description_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Prix (EN)</label><input type="text" value={serviceForm.price_en} onChange={(e) => setServiceForm({...serviceForm, price_en: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
          </div>
          <div className={formTab === 'pt' ? 'space-y-4 block' : 'hidden'}>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Titre (PT)</label><input type="text" value={serviceForm.title_pt} onChange={(e) => setServiceForm({...serviceForm, title_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Description (PT)</label><textarea value={serviceForm.description_pt} onChange={(e) => setServiceForm({...serviceForm, description_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" rows={3} /></div>
            <div><label className="mb-1 block text-sm font-bold text-gray-400">Prix (PT)</label><input type="text" value={serviceForm.price_pt} onChange={(e) => setServiceForm({...serviceForm, price_pt: e.target.value})} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]" /></div>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (t('srv.modal.save_btn') || 'Enregistrer')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
