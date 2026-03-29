"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, Clock, Send, CreditCard, CheckCircle, 
  XCircle, PlayCircle, CheckSquare, Euro, AlertCircle 
} from 'lucide-react';

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

    const { data: artiste } = await supabase
      .from('artistes')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    const currentRole = artiste ? 'ARTISTE' : 'ADMIN';
    setRole(currentRole);

    let query = supabase.from('demandes_services').select('*').order('created_at', { ascending: false });
    
    if (currentRole === 'ARTISTE' && artiste) {
      query = query.eq('artiste_id', artiste.id);
    }

    const { data } = await query;
    if (data) setDemandes(data);
    
    setLoading(false);
  };

  // --- ACTIONS ADMIN ---

  const handleUpdateStatut = async (demandeId: string, newStatut: string) => {
    setIsProcessing(true);
    await supabase.from('demandes_services').update({ statut: newStatut }).eq('id', demandeId);
    await fetchDashboardData();
    setIsProcessing(false);
  };

  const handleTogglePaiement = async (demandeId: string, currentPaiementStatut: string) => {
    setIsProcessing(true);
    const nouveauStatut = currentPaiementStatut === 'paye' ? 'non_paye' : 'paye';
    await supabase.from('demandes_services').update({ paiement_statut: nouveauStatut }).eq('id', demandeId);
    await fetchDashboardData();
    setIsProcessing(false);
  };

  const handleSendPaymentLink = async (demandeId: string) => {
    const prix = prixInput[demandeId];
    if (!prix || isNaN(Number(prix)) || Number(prix) <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    setIsProcessing(true);
    await supabase
      .from('demandes_services')
      .update({ 
        prix_propose: Number(prix),
        statut: 'en_cours' // On passe automatiquement en cours quand on demande le paiement
      })
      .eq('id', demandeId);

    alert("Le lien de paiement a été envoyé à l'artiste !");
    await fetchDashboardData();
    setIsProcessing(false);
  };

  // --- ACTIONS ARTISTE ---

  const handlePayDevis = async (title: string, amount: number) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: `Paiement pour : ${title}`, 
          amount: amount * 100 
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

  // --- DESIGN DES BADGES ---
  const getStatutBadge = (statut: string) => {
    switch(statut) {
      case 'valide': return <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20"><CheckSquare size={12}/> Validé</span>;
      case 'en_cours': return <span className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded border border-purple-400/20"><PlayCircle size={12}/> En cours</span>;
      case 'termine': return <span className="flex items-center gap-1 text-xs font-bold text-[#4ade80] bg-[#4ade80]/10 px-2 py-1 rounded border border-[#4ade80]/20"><CheckCircle size={12}/> Terminé</span>;
      case 'annule': return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20"><XCircle size={12}/> Annulé</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20"><Clock size={12}/> En attente</span>;
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
          {role === 'ADMIN' ? 'Toutes les commandes et demandes' : 'Mes projets en cours'}
        </h2>

        {demandes.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-black/50 p-8 text-center text-gray-500 font-bold">
            Aucune demande pour le moment.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {demandes.map((demande) => (
              <div key={demande.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-lg flex flex-col relative overflow-hidden">
                
                {/* Liseré vert si payé */}
                {demande.paiement_statut === 'paye' && <div className="absolute top-0 left-0 w-full h-1 bg-[#4ade80]"></div>}

                <div className="flex justify-between items-start mb-4 mt-2">
                  <h3 className="font-bold text-white text-lg pr-2">{demande.service_title}</h3>
                  {getStatutBadge(demande.statut)}
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-gray-800 mb-6 flex-1">
                  <p className="text-sm text-gray-400 italic">"{demande.message}"</p>
                </div>

                {/* --- CONTRÔLES ADMIN --- */}
                {role === 'ADMIN' && (
                  <div className="mt-auto space-y-4 border-t border-gray-800 pt-4">
                    
                    {/* Gestion Avancement & Paiement */}
                    <div className="flex gap-2">
                      <select 
                        value={demande.statut || 'en_attente'} 
                        onChange={(e) => handleUpdateStatut(demande.id, e.target.value)}
                        disabled={isProcessing}
                        className="flex-1 bg-black border border-gray-700 text-xs text-white rounded p-2 outline-none focus:border-[#4ade80]"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="valide">Valider la demande</option>
                        <option value="en_cours">Mettre En cours</option>
                        <option value="termine">Marquer Terminé</option>
                        <option value="annule">Annuler</option>
                      </select>

                      <button 
                        onClick={() => handleTogglePaiement(demande.id, demande.paiement_statut)}
                        disabled={isProcessing}
                        className={`px-3 py-2 text-xs font-bold rounded border transition-all ${
                          demande.paiement_statut === 'paye' 
                            ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]' 
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-white'
                        }`}
                      >
                        {demande.paiement_statut === 'paye' ? 'Payé ✅' : 'Non payé'}
                      </button>
                    </div>

                    {/* Envoi de lien de paiement */}
                    {demande.paiement_statut !== 'paye' && (
                      <div className="flex gap-2 bg-black/40 p-2 rounded border border-gray-800">
                        <input 
                          type="number" 
                          placeholder="Montant (€)" 
                          value={prixInput[demande.id] || ''}
                          onChange={(e) => setPrixInput({...prixInput, [demande.id]: e.target.value})}
                          className="w-24 bg-transparent text-sm text-white px-2 outline-none"
                        />
                        <button 
                          onClick={() => handleSendPaymentLink(demande.id)}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#4ade80] text-black text-xs font-bold rounded py-2 hover:bg-[#4ade80]/90 transition-all"
                        >
                          <Euro size={14} /> Envoyer le lien
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* --- VUE ARTISTE --- */}
                {role === 'ARTISTE' && (
                  <div className="mt-auto border-t border-gray-800 pt-4 space-y-3">
                    
                    {/* Statut du paiement */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Paiement :</span>
                      {demande.paiement_statut === 'paye' ? (
                        <span className="text-[#4ade80] font-bold flex items-center gap-1"><CheckCircle size={14}/> Réglé</span>
                      ) : (
                        <span className="text-orange-400 font-bold flex items-center gap-1"><AlertCircle size={14}/> En attente</span>
                      )}
                    </div>

                    {/* Bouton de paiement si un prix a été fixé et non payé */}
                    {demande.paiement_statut !== 'paye' && demande.prix_propose > 0 && (
                      <button 
                        onClick={() => handlePayDevis(demande.service_title, demande.prix_propose)}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <><CreditCard size={18} /> Payer {demande.prix_propose} €</>}
                      </button>
                    )}
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
