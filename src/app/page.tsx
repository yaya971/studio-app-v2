"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Clock, Send, CreditCard, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);
  const [loading, setLoading] = useState(true);
  const [prixInput, setPrixInput] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Vérification du rôle
    const { data: artiste } = await supabase
      .from('artistes')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const currentRole = artiste ? 'ARTISTE' : 'ADMIN';
    setRole(currentRole);

    // Récupération des demandes
    let query = supabase.from('demandes_services').select('*').order('created_at', { ascending: false });
    
    // Filtre pour les artistes : on rassure TypeScript avec "&& artiste"
    if (currentRole === 'ARTISTE' && artiste) {
      query = query.eq('artiste_id', artiste.id);
    }

    const { data } = await query;
    if (data) setDemandes(data);
    
    setLoading(false);
  };

  // ADMIN PROPOSE UN PRIX
  const handleSendDevis = async (demandeId: string, title: string) => {
    const prix = prixInput[demandeId];
    if (!prix || isNaN(Number(prix))) {
      alert("Veuillez entrer un prix valide (chiffres uniquement).");
      return;
    }

    setIsProcessing(true);
    const { error } = await supabase
      .from('demandes_services')
      .update({ 
        prix_propose: Number(prix),
        statut: 'devis_envoye'
      })
      .eq('id', demandeId);

    setIsProcessing(false);

    if (error) {
      alert("Erreur lors de l'envoi du devis : " + error.message);
    } else {
      fetchDashboardData(); 
    }
  };

  // ARTISTE PAIE SON DEVIS
  const handlePayDevis = async (demandeId: string, title: string, amount: number) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: `Devis validé : ${title}`, 
          amount: amount * 100 // Stripe prend des centimes
        }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; 
      } else {
        alert("Erreur Stripe : " + data.error);
        setIsProcessing(false);
      }
    } catch (err) {
      alert("Erreur de connexion au paiement.");
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
          Tableau de bord
        </h1>
        <p className="mt-2 text-gray-400 font-bold">Bienvenue dans ton espace de gestion.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
          {role === 'ADMIN' ? 'Demandes de devis clients' : 'Mes devis en cours'}
        </h2>

        {demandes.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-black/50 p-8 text-center text-gray-500 font-bold">
            Aucune demande de service pour le moment.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {demandes.map((demande) => (
              <div key={demande.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg flex flex-col">
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-lg">{demande.service_title}</h3>
                  {demande.statut === 'en_attente' && <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20"><Clock size={12}/> En attente</span>}
                  {demande.statut === 'devis_envoye' && <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20"><Send size={12}/> Devis envoyé</span>}
                  {demande.statut === 'paye' && <span className="flex items-center gap-1 text-xs font-bold text-[#4ade80] bg-[#4ade80]/10 px-2 py-1 rounded border border-[#4ade80]/20"><CheckCircle size={12}/> Payé</span>}
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-gray-800 mb-4 flex-1">
                  <p className="text-sm text-gray-400 italic">"{demande.message}"</p>
                </div>

                {/* VUE ADMIN : FIXER LE PRIX */}
                {role === 'ADMIN' && demande.statut === 'en_attente' && (
                  <div className="mt-auto border-t border-gray-800 pt-4 flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Prix (€)" 
                      value={prixInput[demande.id] || ''}
                      onChange={(e) => setPrixInput({...prixInput, [demande.id]: e.target.value})}
                      className="w-1/2 rounded-lg border border-gray-700 bg-black px-3 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80]"
                    />
                    <button 
                      onClick={() => handleSendDevis(demande.id, demande.service_title)}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-2 font-bold text-black hover:bg-[#4ade80]/90 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Envoyer'}
                    </button>
                  </div>
                )}

                {/* VUE ARTISTE : PAYER LE PRIX */}
                {role === 'ARTISTE' && demande.statut === 'devis_envoye' && (
                  <div className="mt-auto border-t border-gray-800 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400 font-bold text-sm">Prix proposé :</span>
                      <span className="text-2xl font-bold text-[#4ade80]">{demande.prix_propose} €</span>
                    </div>
                    <button 
                      onClick={() => handlePayDevis(demande.id, demande.service_title, demande.prix_propose)}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><CreditCard size={18} /> Payer le devis</>}
                    </button>
                  </div>
                )}

                {/* VUE INFO : DEJA FIXÉ OU PAYÉ */}
                {role === 'ADMIN' && (demande.statut === 'devis_envoye' || demande.statut === 'paye') && (
                  <div className="mt-auto border-t border-gray-800 pt-4 text-center">
                    <span className="text-gray-400 font-bold text-sm">Devis proposé : <span className="text-[#4ade80]">{demande.prix_propose} €</span></span>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
