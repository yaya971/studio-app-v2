"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Video, Globe, Zap, ShoppingCart, CheckCircle, X } from 'lucide-react';
import Modal from '@/components/Modal';

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const services = [
    {
      id: 1,
      title: "Création de Cover",
      description: "Une pochette sur-mesure pour ton prochain single ou projet. Direction artistique, retouches et déclinaisons réseaux sociaux incluses.",
      price: "À partir de 50€",
      icon: ImageIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/30"
    },
    {
      id: 2,
      title: "Réalisation Clip Vidéo",
      description: "Donne une dimension visuelle à ton titre. Tournage en studio ou en extérieur, montage dynamique et étalonnage pro.",
      price: "Sur devis",
      icon: Video,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/30"
    },
    {
      id: 3,
      title: "Distribution Plateformes",
      description: "On s'occupe de tout l'administratif. Envoi de ton master sur Spotify, Apple Music, Deezer, TikTok et gestion des codes ISRC.",
      price: "Forfait 30€ / Titre",
      icon: Globe,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/30"
    },
    {
      id: 4,
      title: "Mixage Express (Fast Pass)",
      description: "Tu es pressé ? Coupe la file d'attente et reçois ton mixage final dans les 48h ouvrées après ta session d'enregistrement.",
      price: "+ 40€",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30"
    }
  ];

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setIsSent(false);
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on simulera l'envoi d'un email à l'admin ou la création d'une commande
    console.log(`Commande pour ${selectedService.title} : ${message}`);
    setIsSent(true);
    setTimeout(() => setIsModalOpen(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Services & Boutique</h1>
          <p className="mt-2 text-gray-400 font-bold">Pousse ton projet plus loin avec nos prestations sur-mesure.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col justify-between rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all hover:border-[#4ade80]/50 hover:bg-black/80 group">
            <div>
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.bgColor} ${service.borderColor} border`}>
                <service.icon size={28} className={service.color} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{service.title}</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">
                {service.description}
              </p>
            </div>
            
            <div className="mt-auto border-t border-gray-800 pt-5">
              <div className="mb-4 text-lg font-bold text-white">
                {service.price}
              </div>
              <button 
                onClick={() => handleOpenModal(service)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-bold text-white transition-all hover:bg-[#4ade80] hover:text-black border border-gray-800 hover:border-[#4ade80]"
              >
                <ShoppingCart size={18} /> Demander
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE COMMANDE */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Demande de prestation">
        {isSent ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-[#4ade80] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Demande envoyée !</h3>
            <p className="text-gray-400 font-bold">L'équipe du studio va te recontacter très vite pour valider les détails et le paiement.</p>
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
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedService?.id === 1 ? "J'aimerais une cover un peu sombre, style Drill, avec ces couleurs..." : "Donne-nous un maximum de détails..."}
                className="w-full rounded-lg border border-gray-700 bg-black/50 p-4 text-white font-bold focus:outline-none focus:border-[#4ade80] min-h-[120px]" 
              />
            </div>
            
            <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all hover:scale-[1.02]">
              Envoyer la demande
            </button>
          </form>
        )}
      </Modal>

    </div>
  );
}
