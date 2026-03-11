"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Video, Globe, Zap, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function ServicesPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentArtisteId, setCurrentArtisteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      if (artiste) setCurrentArtisteId(artiste.id);
    };
    fetchUser();
  }, [router]);

  const services = [
    { id: 1, title: "Création de Cover", description: "Une pochette sur-mesure pour ton prochain single ou projet. Direction artistique, retouches incluses.", price: "À partir de 50€", icon: ImageIcon, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/30" },
    { id: 2, title: "Réalisation Clip Vidéo", description: "Tournage en studio ou extérieur, montage dynamique et étalonnage pro.", price: "Sur devis", icon: Video, color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/30" },
    { id: 3, title: "Distribution Plateformes", description: "Envoi de ton master sur Spotify, Apple Music, TikTok et gestion des codes ISRC.", price: "Forfait 30€ / Titre", icon: Globe, color: "text-orange-400", bgColor: "bg-orange-400/10", borderColor: "border-orange-400/30" },
    { id: 4, title: "Mixage Express (Fast Pass)", description: "Coupe la file d'attente et reçois ton mixage final dans les 48h ouvrées.", price: "+ 40€", icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" }
  ];

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsSent(false);
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArtisteId) return alert("Vous devez être un artiste enregistré pour faire une demande.");
    
    setIsSubmitting(true);
    const { error } = await supabase.from('demandes_services').insert([{
      artiste_id: currentArtisteId,
      service_title: selectedService.title,
      message: message
    }]);

    setIsSubmitting(false);
    
    if (!error) {
      setIsSent(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } else {
      alert("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Services & Boutique</h1>
        <p className="mt-2 text-gray-400 font-bold">Pousse ton projet plus loin avec nos prestations sur-mesure.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:border-[#4ade80]/50 hover:bg-black/80">
            <div>
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.bgColor} ${service.borderColor} border`}>
                <service.icon size={28} className={service.color} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{service.title}</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">{service.description}</p>
            </div>
            
            <div className="mt-auto border-t border-gray-800 pt-5">
              <div className="mb-4 text-lg font-bold text-white">{service.price}</div>
              <button onClick={() => handleOpenModal(service)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-bold text-white transition-all hover:bg-[#4ade80] hover:text-black border border-gray-800 hover:border-[#4ade80]">
                <ShoppingCart size={18} /> Demander
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Demande de prestation">
        {isSent ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-[#4ade80] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
            <p className="text-gray-400 font-bold">L'équipe du studio va te recontacter très vite pour valider les détails.</p>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className={`mb-6 flex items-center gap-4 rounded-xl ${selectedService?.bgColor} p-4 border ${selectedService?.borderColor}`}>
              {selectedService && <selectedService.icon size={32} className={selectedService.color} />}
              <div>
                <h4 className="font-bold text-white">{selectedService?.title}</h4>
                <p className="text-sm font-bold text-gray-300">{selectedService?.price}</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-400">Parle-nous de ton besoin :</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Donne-nous un maximum de détails..." className="w-full rounded-lg border border-gray-700 bg-black/50 p-4 text-white font-bold focus:outline-none focus:border-[#4ade80] min-h-[120px]" />
            </div>
            
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all hover:scale-[1.02] disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Envoyer la demande"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
