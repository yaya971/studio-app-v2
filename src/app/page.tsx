"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Folder, Mic2, Wallet, Loader2, Music, Clock, MessageSquare, Bell, Store, CheckCircle, ShoppingCart, History, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ADMIN' | 'ARTISTE' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [adminStats, setAdminStats] = useState({ artistes: 0, projets: 0, sessions: 0, revenus: 0 });
  const [adminRecentSessions, setAdminRecentSessions] = useState<any[]>([]);
  const [adminRetours, setAdminRetours] = useState<any[]>([]);
  const [adminDemandes, setAdminDemandes] = useState<any[]>([]);
  const [adminHistorique, setAdminHistorique] = useState<any[]>([]); 

  const [artisteData, setArtisteData] = useState({ nom: '', projets: [] as any[], prochainesSessions: [] as any[] });

  // Modals
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [demandeToValidate, setDemandeToValidate] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();

      if (artiste) {
        setRole('ARTISTE');
        const { data: projets } = await supabase.from('projets').select('*, chansons(*)').eq('artiste_id', artiste.id);
        
        // CORRECTION : On cherche directement les sessions via l'artiste_id
        const { data: upcomingSessions } = await supabase.from('sessions')
          .select('*, artistes(nom)')
          .eq('artiste_id', artiste.id)
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);

        setArtisteData({ nom: artiste.nom, projets: projets || [], prochainesSessions: upcomingSessions || [] });
      } else {
        setRole('ADMIN');
        const { count: artistesCount } = await supabase.from('artistes').select('*', { count: 'exact', head: true });
        const { count: projetsCount } = await supabase.from('projets').select('*', { count: 'exact', head: true });
        
        // CORRECTION : On récupère les sessions avec le bon lien "artistes(nom)"
        const { count: sessionsCount, data: sessionsData } = await supabase.from('sessions')
          .select('*, artistes(nom)', { count: 'exact' })
          .order('date', { ascending: false })
          .limit(5);
          
        const { data: financesData } = await supabase.from('finances').select('amount, type');
        
        let totalRevenus = 0;
        if (financesData) { totalRevenus = financesData.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0); }

        const { data: retoursData } = await supabase.from('chansons').select('id, titre, retours_artiste, projets(title, artistes(nom))').neq('retours_artiste', '').not('retours_artiste', 'is', null);
        const { data: demandesAttente } = await supabase.from('demandes_services').select('id, service_title, message, created_at, artistes(nom)').eq('status', 'EN ATTENTE').order('created_at', { ascending: false });
        const { data: demandesTraitees } = await supabase.from('demandes_services').select('id, service_title, message, prix_final, created_at, artistes(nom)').eq('status', 'TRAITÉ').order('created_at', { ascending: false });

        setAdminStats({ artistes: artistesCount || 0, projets: projetsCount || 0, sessions: sessionsCount || 0, revenus: totalRevenus });
        if (sessionsData) setAdminRecentSessions(sessionsData);
        if (retoursData) setAdminRetours(retoursData);
        if (demandesAttente) setAdminDemandes(demandesAttente);
        if (demandesTraitees) setAdminHistorique(demandesTraitees);
      }
    } catch (error) { console.error("Erreur :", error); } 
    finally { setLoading(false); }
  }

  const openValidateModal = (demande: any) => {
    setDemandeToValidate(demande);
    setFinalPrice('');
    setIsValidateModalOpen(true);
  };

  const validerEtFacturer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const price = parseFloat(finalPrice);

    if (isNaN(price) || price < 0) {
      alert("Montant invalide.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.from('demandes_services').update({ status: 'TRAITÉ', prix_final: price }).eq('id', demandeToValidate.id);
      if (updateError) throw new Error("Erreur mise à jour commande: " + updateError.message);

      let nomArtiste = 'Client Boutique';
      if (demandeToValidate.artistes) {
        nomArtiste = Array.isArray(demandeToValidate.artistes) ? demandeToValidate.artistes[0]?.nom : demandeToValidate.artistes.nom;
      }

      if (price > 0) {
        const { error: financeError } = await supabase.from('finances').insert([{
          description: `Boutique : ${demandeToValidate.service_title} (${nomArtiste})`,
          amount: price,
          type: 'income',
          date: new Date().toISOString()
        }]);
        if (financeError) throw new Error("Erreur ajout finances: " + financeError.message);
      }

      setIsValidateModalOpen(false);
      fetchDashboardData(); 

    } catch (err: any) { alert(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  if (role === 'ARTISTE') {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">Espace Artiste</h1><p className="mt-2 text-gray-400">Bienvenue <strong className="text-white">{artisteData.nom}</strong>.</p></div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Folder className="text-[#a855f7]" size={20}/> Mes Projets en cours</h2>
            {artisteData.projets.length === 0 ? <div className="rounded-xl border border-gray-800 bg-black/50 p-8 text-center text-gray-400">Aucun projet en cours.</div> : artisteData.projets.map(projet => (
              <div key={projet.id} className="rounded-xl border border-[#a855f7]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <div className="mb-4 flex items-center justify-between"><h3 className="text-2xl font-bold text-white">{projet.title}</h3><span className="text-gray-400 flex items-center gap-1 text-sm font-bold"><Music size={14} /> {projet.chansons?.length || 0} Titres</span></div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Clock className="text-[#a855f7]" size={20}/> Prochaines Sessions</h2>
            <div className="rounded-xl border border-[#a855f7]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              {artisteData.prochainesSessions.length === 0 ? (
                <p className="text-gray-400 text-center text-sm py-4 font-bold">Aucune session prévue.</p>
              ) : (
                <div className="space-y-4">
                  {artisteData.prochainesSessions.map(session => (
                    <div key={session.id} className="border-b border-gray-800 pb-4 mb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-white">{session.title}</h4>
                      <span className="text-xs text-gray-400 font-bold">{formatDate(session.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==== VUE ADMIN ====
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Tableau de Bord</h1><p className="mt-2 text-gray-400 font-bold">Bienvenue dans votre interface de gestion globale.</p></div>

      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6"><Users className="text-[#4ade80] mb-2" size={24} /><p className="text-sm text-gray-400 font-bold">Artistes</p><h2 className="text-3xl font-bold text-white">{adminStats.artistes}</h2></div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6"><Folder className="text-[#4ade80] mb-2" size={24} /><p className="text-sm text-gray-400 font-bold">Projets</p><h2 className="text-3xl font-bold text-white">{adminStats.projets}</h2></div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6"><Mic2 className="text-[#4ade80] mb-2" size={24} /><p className="text-sm text-gray-400 font-bold">Sessions</p><h2 className="text-3xl font-bold text-white">{adminStats.sessions}</h2></div>
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6"><Wallet className="text-[#4ade80] mb-2" size={24} /><p className="text-sm text-gray-400 font-bold">Revenus</p><h2 className="text-3xl font-bold text-[#4ade80]">{adminStats.revenus.toFixed(2)} €</h2></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* COLONNE 1 : SESSIONS */}
        <div className="rounded-xl border border-[#4ade80]/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
          <h3 className="mb-6 text-xl font-bold text-[#4ade80] flex items-center gap-2"><Clock size={24}/> Sessions Récentes</h3>
          <div className="space-y-4">
            {adminRecentSessions.length === 0 ? <p className="text-gray-400 font-bold">Aucune session.</p> : adminRecentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <div className="min-w-0"><h4 className="font-bold text-white truncate">{session.title}</h4><p className="text-sm font-bold text-[#4ade80] truncate">{session.artistes?.nom || 'Artiste inconnu'}</p></div>
                <div className="text-xs text-gray-400 font-bold shrink-0 ml-2">{formatDate(session.date)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE 2 : COMMANDES SERVICES */}
        <div className="rounded-xl border border-blue-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2"><Store size={24} /> Commandes</h3>
            <button onClick={() => setIsHistoryModalOpen(true)} className="text-xs font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded"><History size={14}/> Historique</button>
          </div>
          
          {adminDemandes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500"><ShoppingCart size={48} className="mb-4 opacity-20" /><p className="font-bold">Aucune demande.</p></div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {adminDemandes.map((demande) => (
                <div key={demande.id} className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="mb-2"><span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded uppercase">{demande.artistes?.nom}</span><h4 className="font-bold text-white text-sm mt-2">{demande.service_title}</h4></div>
                  <div className="rounded bg-black/50 p-3 text-xs text-gray-300 border border-gray-800 font-bold mb-3"><p>{demande.message}</p></div>
                  <button onClick={() => openValidateModal(demande)} className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 hover:bg-blue-400 py-2 text-xs font-bold text-black transition-all">
                    <CheckCircle size={14} /> Traiter & Facturer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLONNE 3 : RETOURS MIXAGE */}
        <div className="rounded-xl border border-orange-500/30 bg-black/50 p-6 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <h3 className="mb-6 text-xl font-bold text-orange-500 flex items-center gap-2"><Bell size={24} className="animate-pulse" /> Retours Mixage</h3>
          <div className="space-y-4">
            {adminRetours.length === 0 ? <div className="flex flex-col items-center justify-center py-8 text-gray-500"><MessageSquare size={48} className="mb-4 opacity-20" /><p className="font-bold">Aucun retour.</p></div> : adminRetours.map((retour) => (
              <div key={retour.id} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <h4 className="font-bold text-white text-sm">{retour.titre}</h4><span className="text-xs font-bold text-orange-500">{retour.projets?.artistes?.nom}</span>
                <div className="rounded bg-black/50 p-3 text-xs text-gray-300 mt-2 border border-gray-800 font-bold"><p>{retour.retours_artiste}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL : VALIDER UNE COMMANDE */}
      <Modal isOpen={isValidateModalOpen} onClose={() => setIsValidateModalOpen(false)} title="Facturer le service">
        <form onSubmit={validerEtFacturer} className="space-y-4">
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4 mb-4">
            <p className="text-sm text-gray-300 font-bold">Artiste : <span className="text-white">{demandeToValidate?.artistes?.nom || 'Inconnu'}</span></p>
            <p className="text-sm text-gray-300 font-bold">Service : <span className="text-white">{demandeToValidate?.service_title}</span></p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-400">Montant final facturé (€) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="number" step="0.01" min="0" required value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/50 py-3 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-[#4ade80]" placeholder="ex: 150" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Valider & Encaisser"}
          </button>
        </form>
      </Modal>

      {/* MODAL : HISTORIQUE DES COMMANDES */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Historique des Services">
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {adminHistorique.length === 0 ? (
            <p className="text-center text-gray-500 font-bold py-6">Aucun service traité pour le moment.</p>
          ) : (
            adminHistorique.map(dem => (
              <div key={dem.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{dem.service_title}</h4>
                  <p className="text-xs text-gray-400 font-bold">{dem.artistes?.nom || 'Client'} • {formatDate(dem.created_at)}</p>
                </div>
                <div className="font-bold text-[#4ade80] bg-[#4ade80]/10 px-3 py-1 rounded-lg">
                  +{dem.prix_final} €
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

    </div>
  );
}
