"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Menu
    "menu.dashboard": "Dashboard", "menu.reservations": "Réserver", "menu.services": "Services", "menu.projets": "Projets", "menu.sessions": "Sessions", "menu.artistes": "Artistes", "menu.finances": "Finances", "menu.profil": "Profil",
    
    // Dashboard Artiste
    "dash.art.title": "Espace Artiste", "dash.art.welcome": "Bienvenue",
    "dash.art.proj_title": "Mes Projets en cours", "dash.art.no_proj": "Aucun projet en cours.", "dash.art.tracks": "Titres",
    "dash.art.sess_title": "Prochaines Sessions", "dash.art.no_sess": "Aucune session prévue.",
    
    // Dashboard Admin
    "dash.adm.title": "Tableau de Bord", "dash.adm.subtitle": "Bienvenue dans votre interface de gestion globale.",
    "dash.adm.artists": "Artistes", "dash.adm.projects": "Projets", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenus",
    "dash.adm.recent_sess": "Sessions Récentes", "dash.adm.no_sess": "Aucune session.",
    "dash.adm.orders": "Commandes", "dash.adm.history": "Historique", "dash.adm.no_orders": "Aucune demande.", "dash.adm.process": "Traiter & Facturer",
    "dash.adm.returns": "Retours Mixage", "dash.adm.no_returns": "Aucun retour.", "dash.adm.unknown": "Inconnu",
    
    // Modals & Pop-ups
    "modal.bill.title": "Facturer le service", "modal.bill.artist": "Artiste :", "modal.bill.service": "Service :", "modal.bill.amount": "Montant final facturé (€) *", "modal.bill.validate": "Valider & Encaisser",
    "modal.history.title": "Historique des Services", "modal.history.empty": "Aucun service traité pour le moment.",
    "pwa.title": "Astuce de Pro 📱", "pwa.desc": "Pour une expérience optimale, installe LACAV & me directement sur l'écran d'accueil de ton téléphone !", "pwa.apple": "🍎 Sur iPhone (Safari)", "pwa.android": "🤖 Sur Android (Chrome)", "pwa.btn": "J'AI COMPRIS",
  },
  en: {
    // Menu
    "menu.dashboard": "Dashboard", "menu.reservations": "Book", "menu.services": "Services", "menu.projets": "Projects", "menu.sessions": "Sessions", "menu.artistes": "Artists", "menu.finances": "Finances", "menu.profil": "Profile",
    
    // Dashboard Artiste
    "dash.art.title": "Artist Area", "dash.art.welcome": "Welcome",
    "dash.art.proj_title": "My Active Projects", "dash.art.no_proj": "No active projects.", "dash.art.tracks": "Tracks",
    "dash.art.sess_title": "Upcoming Sessions", "dash.art.no_sess": "No upcoming sessions.",
    
    // Dashboard Admin
    "dash.adm.title": "Dashboard", "dash.adm.subtitle": "Welcome to your global management interface.",
    "dash.adm.artists": "Artists", "dash.adm.projects": "Projects", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenue",
    "dash.adm.recent_sess": "Recent Sessions", "dash.adm.no_sess": "No sessions.",
    "dash.adm.orders": "Orders", "dash.adm.history": "History", "dash.adm.no_orders": "No orders.", "dash.adm.process": "Process & Bill",
    "dash.adm.returns": "Mix Feedback", "dash.adm.no_returns": "No feedback.", "dash.adm.unknown": "Unknown",
    
    // Modals & Pop-ups
    "modal.bill.title": "Bill the service", "modal.bill.artist": "Artist:", "modal.bill.service": "Service:", "modal.bill.amount": "Final billed amount (€) *", "modal.bill.validate": "Validate & Cash in",
    "modal.history.title": "Services History", "modal.history.empty": "No services processed yet.",
    "pwa.title": "Pro Tip 📱", "pwa.desc": "For the best experience, install LACAV & me directly on your phone's home screen!", "pwa.apple": "🍎 On iPhone (Safari)", "pwa.android": "🤖 On Android (Chrome)", "pwa.btn": "GOT IT",
  },
  pt: {
    // Menu
    "menu.dashboard": "Painel", "menu.reservations": "Reservar", "menu.services": "Serviços", "menu.projets": "Projetos", "menu.sessions": "Sessões", "menu.artistes": "Artistas", "menu.finances": "Finanças", "menu.profil": "Perfil",
    
    // Dashboard Artiste
    "dash.art.title": "Espaço Artista", "dash.art.welcome": "Bem-vindo",
    "dash.art.proj_title": "Meus Projetos Ativos", "dash.art.no_proj": "Nenhum projeto ativo.", "dash.art.tracks": "Faixas",
    "dash.art.sess_title": "Próximas Sessões", "dash.art.no_sess": "Nenhuma sessão agendada.",
    
    // Dashboard Admin
    "dash.adm.title": "Painel de Controle", "dash.adm.subtitle": "Bem-vindo à sua interface de gestão global.",
    "dash.adm.artists": "Artistas", "dash.adm.projects": "Projetos", "dash.adm.sessions": "Sessões", "dash.adm.revenue": "Receitas",
    "dash.adm.recent_sess": "Sessões Recentes", "dash.adm.no_sess": "Nenhuma sessão.",
    "dash.adm.orders": "Pedidos", "dash.adm.history": "Histórico", "dash.adm.no_orders": "Nenhum pedido.", "dash.adm.process": "Processar e Faturar",
    "dash.adm.returns": "Feedback de Mixagem", "dash.adm.no_returns": "Nenhum feedback.", "dash.adm.unknown": "Desconhecido",
    
    // Modals & Pop-ups
    "modal.bill.title": "Faturar o serviço", "modal.bill.artist": "Artista:", "modal.bill.service": "Serviço:", "modal.bill.amount": "Valor final faturado (€) *", "modal.bill.validate": "Validar e Receber",
    "modal.history.title": "Histórico de Serviços", "modal.history.empty": "Nenhum serviço processado ainda.",
    "pwa.title": "Dica de Ouro 📱", "pwa.desc": "Para a melhor experiência, instale o LACAV & me diretamente na tela inicial do seu celular!", "pwa.apple": "🍎 No iPhone (Safari)", "pwa.android": "🤖 No Android (Chrome)", "pwa.btn": "ENTENDI",
  }
};

type Language = 'fr' | 'en' | 'pt';

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    setMounted(true);
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
  };

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['fr']] || key;
  };

  if (!mounted) return <div className="bg-black min-h-screen"></div>;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
