"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Menu & Dashboard & Modal & PWA
    "menu.dashboard": "Dashboard", "menu.reservations": "Réserver", "menu.services": "Services", "menu.projets": "Projets", "menu.sessions": "Sessions", "menu.artistes": "Artistes", "menu.finances": "Finances", "menu.profil": "Profil",
    "dash.art.title": "Espace Artiste", "dash.art.welcome": "Bienvenue", "dash.art.proj_title": "Mes Projets en cours", "dash.art.no_proj": "Aucun projet en cours.", "dash.art.tracks": "Titres", "dash.art.sess_title": "Prochaines Sessions", "dash.art.no_sess": "Aucune session prévue.",
    "dash.adm.title": "Tableau de Bord", "dash.adm.subtitle": "Bienvenue dans votre interface de gestion globale.", "dash.adm.artists": "Artistes", "dash.adm.projects": "Projets", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenus", "dash.adm.recent_sess": "Sessions Récentes", "dash.adm.no_sess": "Aucune session.", "dash.adm.orders": "Commandes", "dash.adm.history": "Historique", "dash.adm.no_orders": "Aucune demande.", "dash.adm.process": "Traiter & Facturer", "dash.adm.returns": "Retours Mixage", "dash.adm.no_returns": "Aucun retour.", "dash.adm.unknown": "Inconnu",
    "modal.bill.title": "Facturer le service", "modal.bill.artist": "Artiste :", "modal.bill.service": "Service :", "modal.bill.amount": "Montant final facturé (€) *", "modal.bill.validate": "Valider & Encaisser", "modal.history.title": "Historique des Services", "modal.history.empty": "Aucun service traité pour le moment.",
    "pwa.title": "Astuce de Pro 📱", "pwa.desc": "Pour une expérience optimale, installe LACAV & me directement sur l'écran d'accueil de ton téléphone !", "pwa.apple": "🍎 Sur iPhone (Safari)", "pwa.android": "🤖 Sur Android (Chrome)", "pwa.btn": "J'AI COMPRIS",

    // Sessions & Services
    "sess.title": "Planning", "sess.subtitle": "Gérez les sessions d'enregistrement au studio.", "sess.new": "Nouvelle session", "sess.empty": "Aucune session", "sess.empty_desc": "Le planning est vide.", "sess.duration": "Durée : ", "sess.hours": " heure(s)", "sess.done": "Terminée", "sess.modal.edit": "Modifier la session", "sess.modal.new": "Nouvelle Session", "sess.modal.title_label": "Titre (ex: Enregistrement Voix) *", "sess.modal.artist": "Artiste *", "sess.modal.select_artist": "Sélectionnez un artiste...", "sess.modal.date": "Date et heure *", "sess.modal.duration_label": "Durée (heures) *", "sess.modal.update_btn": "Mettre à jour", "sess.modal.add_btn": "Programmer la session",
    "srv.title": "Services & Boutique", "srv.subtitle": "Pousse ton projet plus loin avec nos prestations sur-mesure.", "srv.add": "Ajouter un service", "srv.order": "Demander", "srv.modal.order_title": "Demande de prestation", "srv.modal.sent": "Demande envoyée !", "srv.modal.contact_soon": "L'équipe va te recontacter très vite.", "srv.modal.need": "Parle-nous de ton besoin :", "srv.modal.send_btn": "Envoyer la demande", "srv.modal.edit_title": "Modifier le service", "srv.modal.new_title": "Nouveau Service", "srv.modal.name_label": "Nom du service *", "srv.modal.desc_label": "Description *", "srv.modal.price_label": "Texte du Prix (Libre) *", "srv.modal.save_btn": "Enregistrer le service",

    // Finances
    "fin.title": "Trésorerie", "fin.subtitle": "Suivez les revenus et dépenses du studio.", "fin.balance": "Bilan Net", "fin.income": "Revenus", "fin.expense": "Dépenses", "fin.add": "Nouvelle Transaction", "fin.empty": "Aucune transaction.", "fin.col.date": "Date", "fin.col.desc": "Description", "fin.col.type": "Type", "fin.col.amount": "Montant", "fin.modal.title": "Ajouter une transaction", "fin.modal.desc": "Description (ex: Session mixage, Achat micro) *", "fin.modal.amount": "Montant (€) *", "fin.modal.type": "Type de transaction *", "fin.modal.type_in": "Revenu (+)", "fin.modal.type_out": "Dépense (-)", "fin.modal.date": "Date *", "fin.modal.btn": "Ajouter à la trésorerie",

    // Profil
    "prof.title": "Mon Profil", "prof.subtitle": "Gère tes informations personnelles.", "prof.logout": "Se déconnecter", "prof.info": "Mes Informations", "prof.name": "Nom d'artiste", "prof.email": "Email de contact", "prof.member": "Membre depuis le", "prof.no_info": "Informations non trouvées."
  },
  en: {
    // Menu & Dashboard & Modal & PWA
    "menu.dashboard": "Dashboard", "menu.reservations": "Book", "menu.services": "Services", "menu.projets": "Projects", "menu.sessions": "Sessions", "menu.artistes": "Artists", "menu.finances": "Finances", "menu.profil": "Profile",
    "dash.art.title": "Artist Area", "dash.art.welcome": "Welcome", "dash.art.proj_title": "My Active Projects", "dash.art.no_proj": "No active projects.", "dash.art.tracks": "Tracks", "dash.art.sess_title": "Upcoming Sessions", "dash.art.no_sess": "No upcoming sessions.",
    "dash.adm.title": "Dashboard", "dash.adm.subtitle": "Welcome to your global management interface.", "dash.adm.artists": "Artists", "dash.adm.projects": "Projects", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenue", "dash.adm.recent_sess": "Recent Sessions", "dash.adm.no_sess": "No sessions.", "dash.adm.orders": "Orders", "dash.adm.history": "History", "dash.adm.no_orders": "No orders.", "dash.adm.process": "Process & Bill", "dash.adm.returns": "Mix Feedback", "dash.adm.no_returns": "No feedback.", "dash.adm.unknown": "Unknown",
    "modal.bill.title": "Bill the service", "modal.bill.artist": "Artist:", "modal.bill.service": "Service:", "modal.bill.amount": "Final billed amount (€) *", "modal.bill.validate": "Validate & Cash in", "modal.history.title": "Services History", "modal.history.empty": "No services processed yet.",
    "pwa.title": "Pro Tip 📱", "pwa.desc": "For the best experience, install LACAV & me directly on your phone's home screen!", "pwa.apple": "🍎 On iPhone (Safari)", "pwa.android": "🤖 On Android (Chrome)", "pwa.btn": "GOT IT",

    // Sessions & Services
    "sess.title": "Schedule", "sess.subtitle": "Manage recording sessions at the studio.", "sess.new": "New session", "sess.empty": "No sessions", "sess.empty_desc": "The schedule is empty.", "sess.duration": "Duration: ", "sess.hours": " hour(s)", "sess.done": "Done", "sess.modal.edit": "Edit session", "sess.modal.new": "New Session", "sess.modal.title_label": "Title (ex: Voice Recording) *", "sess.modal.artist": "Artist *", "sess.modal.select_artist": "Select an artist...", "sess.modal.date": "Date and time *", "sess.modal.duration_label": "Duration (hours) *", "sess.modal.update_btn": "Update", "sess.modal.add_btn": "Schedule session",
    "srv.title": "Services & Shop", "srv.subtitle": "Take your project further with our custom services.", "srv.add": "Add a service", "srv.order": "Order", "srv.modal.order_title": "Service Request", "srv.modal.sent": "Request sent!", "srv.modal.contact_soon": "The team will contact you soon.", "srv.modal.need": "Tell us about your needs:", "srv.modal.send_btn": "Send request", "srv.modal.edit_title": "Edit service", "srv.modal.new_title": "New Service", "srv.modal.name_label": "Service name *", "srv.modal.desc_label": "Description *", "srv.modal.price_label": "Price Text (Free) *", "srv.modal.save_btn": "Save service",

    // Finances
    "fin.title": "Treasury", "fin.subtitle": "Track studio income and expenses.", "fin.balance": "Net Balance", "fin.income": "Income", "fin.expense": "Expenses", "fin.add": "New Transaction", "fin.empty": "No transactions.", "fin.col.date": "Date", "fin.col.desc": "Description", "fin.col.type": "Type", "fin.col.amount": "Amount", "fin.modal.title": "Add a transaction", "fin.modal.desc": "Description (ex: Mix session, Mic purchase) *", "fin.modal.amount": "Amount (€) *", "fin.modal.type": "Transaction type *", "fin.modal.type_in": "Income (+)", "fin.modal.type_out": "Expense (-)", "fin.modal.date": "Date *", "fin.modal.btn": "Add to treasury",

    // Profil
    "prof.title": "My Profile", "prof.subtitle": "Manage your personal information.", "prof.logout": "Log out", "prof.info": "My Information", "prof.name": "Artist name", "prof.email": "Contact email", "prof.member": "Member since", "prof.no_info": "Information not found."
  },
  pt: {
    // Menu & Dashboard & Modal & PWA
    "menu.dashboard": "Painel", "menu.reservations": "Reservar", "menu.services": "Serviços", "menu.projets": "Projetos", "menu.sessions": "Sessões", "menu.artistes": "Artistas", "menu.finances": "Finanças", "menu.profil": "Perfil",
    "dash.art.title": "Espaço Artista", "dash.art.welcome": "Bem-vindo", "dash.art.proj_title": "Meus Projetos Ativos", "dash.art.no_proj": "Nenhum projeto ativo.", "dash.art.tracks": "Faixas", "dash.art.sess_title": "Próximas Sessões", "dash.art.no_sess": "Nenhuma sessão agendada.",
    "dash.adm.title": "Painel de Controle", "dash.adm.subtitle": "Bem-vindo à sua interface de gestão global.", "dash.adm.artists": "Artistas", "dash.adm.projects": "Projetos", "dash.adm.sessions": "Sessões", "dash.adm.revenue": "Receitas", "dash.adm.recent_sess": "Sessões Recentes", "dash.adm.no_sess": "Nenhuma sessão.", "dash.adm.orders": "Pedidos", "dash.adm.history": "Histórico", "dash.adm.no_orders": "Nenhum pedido.", "dash.adm.process": "Processar e Faturar", "dash.adm.returns": "Feedback de Mixagem", "dash.adm.no_returns": "Nenhum feedback.", "dash.adm.unknown": "Desconhecido",
    "modal.bill.title": "Faturar o serviço", "modal.bill.artist": "Artista:", "modal.bill.service": "Serviço:", "modal.bill.amount": "Valor final faturado (€) *", "modal.bill.validate": "Validar e Receber", "modal.history.title": "Histórico de Serviços", "modal.history.empty": "Nenhum serviço processado ainda.",
    "pwa.title": "Dica de Ouro 📱", "pwa.desc": "Para a melhor experiência, instale o LACAV & me diretamente na tela inicial do seu celular!", "pwa.apple": "🍎 No iPhone (Safari)", "pwa.android": "🤖 No Android (Chrome)", "pwa.btn": "ENTENDI",

    // Sessions & Services
    "sess.title": "Agenda", "sess.subtitle": "Gerencie as sessões de gravação no estúdio.", "sess.new": "Nova sessão", "sess.empty": "Nenhuma sessão", "sess.empty_desc": "A agenda está vazia.", "sess.duration": "Duração: ", "sess.hours": " hora(s)", "sess.done": "Concluída", "sess.modal.edit": "Editar sessão", "sess.modal.new": "Nova Sessão", "sess.modal.title_label": "Título (ex: Gravação de Voz) *", "sess.modal.artist": "Artista *", "sess.modal.select_artist": "Selecione um artista...", "sess.modal.date": "Data e hora *", "sess.modal.duration_label": "Duração (horas) *", "sess.modal.update_btn": "Atualizar", "sess.modal.add_btn": "Agendar sessão",
    "srv.title": "Serviços e Loja", "srv.subtitle": "Leve seu projeto mais longe com nossos serviços.", "srv.add": "Adicionar um serviço", "srv.order": "Pedir", "srv.modal.order_title": "Pedido de Serviço", "srv.modal.sent": "Pedido enviado!", "srv.modal.contact_soon": "A equipe entrará em contato em breve.", "srv.modal.need": "Fale-nos sobre sua necessidade:", "srv.modal.send_btn": "Enviar pedido", "srv.modal.edit_title": "Editar serviço", "srv.modal.new_title": "Novo Serviço", "srv.modal.name_label": "Nome do serviço *", "srv.modal.desc_label": "Descrição *", "srv.modal.price_label": "Texto do Preço (Livre) *", "srv.modal.save_btn": "Salvar serviço",

    // Finances
    "fin.title": "Finanças", "fin.subtitle": "Acompanhe receitas e despesas do estúdio.", "fin.balance": "Saldo Líquido", "fin.income": "Receitas", "fin.expense": "Despesas", "fin.add": "Nova Transação", "fin.empty": "Nenhuma transação.", "fin.col.date": "Data", "fin.col.desc": "Descrição", "fin.col.type": "Tipo", "fin.col.amount": "Valor", "fin.modal.title": "Adicionar transação", "fin.modal.desc": "Descrição (ex: Sessão de mixagem, Compra de microfone) *", "fin.modal.amount": "Valor (€) *", "fin.modal.type": "Tipo de transação *", "fin.modal.type_in": "Receita (+)", "fin.modal.type_out": "Despesa (-)", "fin.modal.date": "Data *", "fin.modal.btn": "Adicionar às finanças",

    // Profil
    "prof.title": "Meu Perfil", "prof.subtitle": "Gerencie suas informações pessoais.", "prof.logout": "Sair", "prof.info": "Minhas Informações", "prof.name": "Nome do artista", "prof.email": "E-mail de contato", "prof.member": "Membro desde", "prof.no_info": "Informações não encontradas."
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
