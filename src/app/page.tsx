"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, Clock, Send, CreditCard, CheckCircle, 
  PlayCircle, Euro, AlertCircle, Users, Wallet, ListTodo, Folder
} from 'lucide-react';

export default function Dashboard() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [stats, setStats] = useState({ artistes: 0, ca: 0, projetsActifs: 0 });
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

    const { data: artiste } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
    const currentRole = artiste ? 'ARTISTE' : 'ADMIN';
    setRole(currentRole);

    // 1. Récupération des demandes
    let query = supabase.from('demandes_services').select('*').order('created_at', { ascending: false });
    if (currentRole === 'ARTISTE' && artiste) {
      query = query.eq('artiste_id', artiste.id);
    }
    const { data: demandesData } = await query;
    if (demandesData) setDemandes(demandesData);

    // 2. Récupération des Statistiques (ADMIN SEULEMENT)
    if (currentRole === 'ADMIN') {
      try {
        // Compter les artistes
        const { count: artistesCount } = await supabase.from('artistes').select('*', { count: 'exact', head: true });
        
        // Calculer le Chiffre d'Affaires (Finances) - ADAPTÉ À TA BASE (amount)
        const { data: financesData } = await supabase.from('finances').select('amount').eq('type', 'ENTREE');
        const caTotal = financesData ? financesData.reduce((acc, curr) => acc + (curr.amount || 0), 0) : 0;

        // Compter les projets en cours
        const projetsEnCours = demandesData ? demandesData.filter(d => d.statut === 'en_cours').length : 0;

        setStats({ 
          artistes: artistesCount || 0, 
          ca: caTotal, 
          projetsActifs: projetsEnCours 
        });
      } catch (e) {
        console.error("Erreur stats", e);
      }
    }
    setLoading(false);
  };

  // --- ACTIONS ADMIN ---

  const handleUpdateStatut = async (demandeId: string, newStatut: string) => {
    setIsProcessing(true);
    await supabase.from('demandes_services').update({ statut: newStatut }).eq('id', demandeId);
    await fetchDashboardData();
    setIsProcessing(false);
  };

  // FIXER LE PRIX (DEVIS) - TOTALEMENT INDÉPENDANT POUR CHAQUE CARTE
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
        statut: 'devis_envoye' 
      })
      .eq('id', demandeId);

    alert("Le devis a été envoyé à l'artiste !");
    setPrixInput({...prixInput, [demandeId]: ''}); // On vide la case après envoi
    await fetchDashboardData();
    setIsProcessing(false);
  };

  // MARQUER COMME PAYÉ (IRRÉVERSIBLE + AJOUT FINANCES)
  const handleMarkAsPaid = async (demande: any) => {
    if (!window.confirm(`Confirmer le paiement de ${demande.prix_propose} € ? Cela sera ajouté à tes Finances. Cette action est irréversible.`)) return;

    setIsProcessing(true);
    
    // 1. On bloque la commande en "Payé"
    await supabase.from('demandes_services').update({ paiement_statut: 'paye', statut: 'en_cours' }).eq('id', demande.id);
    
    // 2. On injecte l'argent dans les Finances - ADAPTÉ À TA BASE (description et amount)
    await supabase.from('finances').insert([{
      description: `Paiement: ${demande.service_title}`,
      amount: demande.prix_propose,
      type: 'ENTREE'
    }]);

    alert("Paiement validé et ajouté aux finances !");
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
        body: JSON.stringify({ title: `Devis validé : ${title}`, amount: amount * 100 }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url; 
      else { alert("Erreur Stripe"); setIsProcessing(false); }
    } catch (err) {
      alert("Erreur de connexion au paiement.");
      setIsProcessing(false);
    }
  };

  // --- FILTRES POUR L'AFFICHAGE ---
  const todoList = demandes.filter(d => d.statut === 'en_attente');
  const projetsEnCours = demandes.filter(d => d.statut !== 'en_attente');

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* EN-TÊTE DU TABLEAU DE BORD */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Vue d'ensemble</h1>
        <p className="mt-2 text-gray-400 font-bold">Bienvenue dans ton centre de contrôle.</p>
      </div>

      {/* STATISTIQUES (ADMIN UNIQUEMENT) */}
      {role === 'ADMIN' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-black/50 border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><Wallet size={20}/> <span className="font-bold">Chiffre d'Affaires</span></div>
            <div className="text-3xl font-bold text-white">{stats.ca} €</div>
          </div>
          <div className="bg-black/50 border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><ListTodo size={20}/> <span className="font-bold">Demandes en attente</span></div>
            <div className="text-3xl font-bold text-orange-400">{todoList.length}</div>
          </div>
          <div className="bg-black/50 border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><Folder size={20}/> <span className="font-bold">Projets Actifs</span></div>
            <div className="text-3xl font-bold text-blue-400">{stats.projetsActifs}</div>
          </div>
          <div className="bg-black/50 border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 text-gray-400 mb-2"><Users size={20}/> <span className="font-bold">Artistes Inscrits</span></div>
            <div className="text-3xl font-bold text-purple-400">{stats.artistes}</div>
          </div>
        </div>
      )}

      {/* --- VUE ADMIN : LAYOUT EN DEUX COLONNES --- */}
      {role === 'ADMIN' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : TO-DO LIST (Demandes à chiffrer) */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3"><Clock className="text-orange-400"/> To-Do List (Nouveaux)</h2>
            {todoList.length === 0 ? (
              <p className="text-gray-500 font-bold p-4 bg-black/30 rounded-lg border border-gray-800 text-center">Aucune nouvelle demande.</p>
            ) : (
              todoList.map(demande => (
                <div key={demande.id} className="bg-orange-400/5 border border-orange-400/20 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                  <h3 className="font-bold text-white mb-2 ml-2">{demande.service_title}</h3>
                  <p className="text-sm text-gray-400 italic mb-4 ml-2">"{demande.message}"</p>
                  
                  {/* Saisir le prix pour ce devis spécifique */}
                  <div className="flex gap-2 ml-2">
                    <input 
                      type="number" 
                      placeholder="Prix (€)" 
                      value={prixInput[demande.id] || ''}
                      onChange={(e) => setPrixInput({...prixInput, [demande.id]: e.target.value})}
                      className="w-24 bg-black border border-gray-700 text-sm text-white px-3 py-2 rounded focus:outline-none focus:border-orange-400"
                    />
                    <button 
                      onClick={() => handleSendPaymentLink(demande.id)}
                      disabled={isProcessing}
                      className="flex-1 bg-orange-400 text-black text-sm font-bold rounded py-2 hover:bg-orange-500 transition-all"
                    >
                      Proposer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COLONNE DROITE : PROJETS EN COURS & PAIEMENTS */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3"><PlayCircle className="text-blue-400"/> Gestion des Projets</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projetsEnCours.length === 0 ? (
                <p className="text-gray-500 font-bold md:col-span-2">Aucun projet en cours.</p>
              ) : (
                projetsEnCours.map(demande => (
                  <div key={demande.id} className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate pr-2">{demande.service_title}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${demande.paiement_statut === 'paye' ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {demande.paiement_statut === 'paye' ? 'PAYÉ ✅' : 'NON PAYÉ'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2">Prix fixé : <span className="text-[#4ade80] font-bold">{demande.prix_propose} €</span></p>

                    <div className="mt-auto pt-4 border-t border-gray-800 space-y-3">
                      {/* Selecteur d'avancement */}
                      <select 
                        value={demande.statut} 
                        onChange={(e) => handleUpdateStatut(demande.id, e.target.value)}
                        className="w-full bg-black border border-gray-700 text-xs font-bold text-white rounded p-2 focus:border-[#4ade80] outline-none"
                      >
                        <option value="devis_envoye">Devis envoyé (Attente client)</option>
                        <option value="en_cours">Projet En Cours</option>
                        <option value="termine">Projet Terminé</option>
                        <option value="annule">Projet Annulé</option>
                      </select>

                      {/* Bouton Payé (Irréversible) */}
                      {demande.paiement_statut !== 'paye' && (
                        <button 
                          onClick={() => handleMarkAsPaid(demande)}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center gap-2 bg-black border border-gray-700 text-gray-400 text-xs font-bold rounded py-2 hover:border-[#4ade80] hover:text-[#4ade80] transition-all"
                        >
                          <CheckCircle size={14}/> Marquer comme encaissé
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* --- VUE ARTISTE --- */
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3">Mes Commandes et Devis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandes.length === 0 ? (
              <p className="text-gray-500 font-bold">Tu n'as aucune commande en cours.</p>
            ) : (
              demandes.map(demande => (
                <div key={demande.id} className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg">{demande.service_title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 italic mb-6">"{demande.message}"</p>

                  <div className="mt-auto border-t border-gray-800 pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Paiement :</span>
                      {demande.paiement_statut === 'paye' ? (
                        <span className="text-[#4ade80] font-bold flex items-center gap-1"><CheckCircle size={14}/> Réglé</span>
                      ) : (
                        <span className="text-orange-400 font-bold flex items-center gap-1"><AlertCircle size={14}/> En attente</span>
                      )}
                    </div>

                    {/* Si le devis a un prix ET n'est pas payé, on affiche le bouton */}
                    {demande.paiement_statut !== 'paye' && demande.prix_propose > 0 ? (
                      <button 
                        onClick={() => handlePayDevis(demande.service_title, demande.prix_propose)}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        <CreditCard size={18} /> Payer {demande.prix_propose} €
                      </button>
                    ) : (
                      demande.paiement_statut !== 'paye' && <p className="text-xs text-center text-gray-500 font-bold bg-black/50 py-2 rounded">Devis en cours de création...</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
