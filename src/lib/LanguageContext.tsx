"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Menu & Dashboard & PWA
    "menu.dashboard": "Dashboard", "menu.reservations": "Réserver", "menu.services": "Services", "menu.projets": "Projets", "menu.sessions": "Sessions", "menu.artistes": "Artistes", "menu.finances": "Finances", "menu.profil": "Profil",
    "dash.art.title": "Espace Artiste", "dash.art.welcome": "Bienvenue", "dash.art.proj_title": "Mes Projets en cours", "dash.art.no_proj": "Aucun projet en cours.", "dash.art.tracks": "Titres", "dash.art.sess_title": "Prochaines Sessions", "dash.art.no_sess": "Aucune session prévue.",
    "dash.adm.title": "Tableau de Bord", "dash.adm.subtitle": "Bienvenue dans votre interface de gestion globale.", "dash.adm.artists": "Artistes", "dash.adm.projects": "Projets", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenus", "dash.adm.recent_sess": "Sessions Récentes", "dash.adm.no_sess": "Aucune session.", "dash.adm.orders": "Commandes", "dash.adm.history": "Historique", "dash.adm.no_orders": "Aucune demande.", "dash.adm.process": "Traiter & Facturer", "dash.adm.returns": "Retours Mixage", "dash.adm.no_returns": "Aucun retour.", "dash.adm.unknown": "Inconnu",
    "pwa.title": "Astuce de Pro 📱", "pwa.desc": "Pour une expérience optimale, installe LACAV & me directement sur l'écran d'accueil de ton téléphone !", "pwa.apple": "🍎 Sur iPhone (Safari)", "pwa.android": "🤖 Sur Android (Chrome)", "pwa.btn": "J'AI COMPRIS",

    // Modals globaux (Historique, Facturation)
    "modal.bill.title": "Facturer le service", "modal.bill.artist": "Artiste :", "modal.bill.service": "Service :", "modal.bill.amount": "Montant final facturé (€) *", "modal.bill.validate": "Valider & Encaisser", 
    "modal.history.title": "Historique des Services", "modal.history.empty": "Aucun service traité pour le moment.",

    // Sessions & Services & Finances & Profil
    "sess.title": "Planning", "sess.subtitle": "Gérez les sessions d'enregistrement.", "sess.new": "Nouvelle session", "sess.empty": "Aucune session", "sess.empty_desc": "Le planning est vide.", "sess.duration": "Durée : ", "sess.hours": " heure(s)", "sess.done": "Terminée", "sess.modal.edit": "Modifier la session", "sess.modal.new": "Nouvelle Session", "sess.modal.title_label": "Titre *", "sess.modal.artist": "Artiste *", "sess.modal.select_artist": "Sélectionnez...", "sess.modal.date": "Date *", "sess.modal.duration_label": "Durée (h) *", "sess.modal.update_btn": "Mettre à jour", "sess.modal.add_btn": "Programmer",
    "srv.title": "Services", "srv.subtitle": "Prestations sur-mesure.", "srv.add": "Ajouter un service", "srv.order": "Demander", "srv.modal.order_title": "Demande", "srv.modal.sent": "Envoyée !", "srv.modal.contact_soon": "On te recontacte vite.", "srv.modal.need": "Ton besoin :", "srv.modal.send_btn": "Envoyer", "srv.modal.edit_title": "Modifier", "srv.modal.new_title": "Nouveau", "srv.modal.name_label": "Nom *", "srv.modal.desc_label": "Description *", "srv.modal.price_label": "Prix *", "srv.modal.save_btn": "Enregistrer",
    "fin.title": "Trésorerie", "fin.subtitle": "Revenus et dépenses.", "fin.balance": "Bilan Net", "fin.income": "Revenus", "fin.expense": "Dépenses", "fin.add": "Nouvelle Transaction", "fin.empty": "Aucune transaction.", "fin.col.date": "Date", "fin.col.desc": "Description", "fin.col.type": "Type", "fin.col.amount": "Montant", "fin.modal.title": "Ajouter", "fin.modal.desc": "Description *", "fin.modal.amount": "Montant *", "fin.modal.type": "Type *", "fin.modal.type_in": "Revenu (+)", "fin.modal.type_out": "Dépense (-)", "fin.modal.date": "Date *", "fin.modal.btn": "Ajouter",
    "prof.title": "Mon Profil", "prof.subtitle": "Gère tes infos.", "prof.logout": "Se déconnecter", "prof.info": "Mes Informations", "prof.name": "Nom", "prof.email": "Email", "prof.member": "Membre depuis le", "prof.no_info": "Non trouvé.",
    
    // Projets & Tracklist (Ce qui manquait sur ta capture d'écran)
    "proj.title": "Projets", "proj.subtitle": "Gérez les productions.", "proj.new": "Nouveau projet", "proj.empty": "Aucun projet", "proj.unknown_artist": "Inconnu", "proj.tracks": "Titre", "proj.tracks_pl": "Titres", "proj.open_tracklist": "Ouvrir",
    "proj.modal.edit": "Modifier le projet", "proj.modal.new": "Nouveau Projet", "proj.modal.title_label": "Titre du projet *", "proj.modal.artist_label": "Artiste *", "proj.modal.select_artist": "Sélectionnez un artiste...", "proj.modal.desc_label": "Description", "proj.modal.update_btn": "Mettre à jour", "proj.modal.create_btn": "Créer le projet",
    "proj.alert.no_artist": "Veuillez sélectionner un artiste !", "proj.alert.delete_proj": "Êtes-vous sûr de vouloir supprimer ce projet ? \n⚠️ Sessions et chansons seront perdues !", "proj.alert.delete_track": "Supprimer ce titre de la tracklist ?", "proj.alert.delete_audio": "Voulez-vous vraiment supprimer la maquette de ce titre ?", "proj.alert.upload_err": "Erreur d'upload : ",
    "proj.tracklist.title": "Tracklist : ", "proj.tracklist.add_placeholder": "Ajouter un titre (ex: Intro, Piste 1...)", "proj.tracklist.status.rec": "🔴 ENREGISTREMENT", "proj.tracklist.status.mix": "🎛️ MIXAGE", "proj.tracklist.status.wait": "⏳ EN ATTENTE DE RETOURS", "proj.tracklist.status.done": "✅ TERMINÉ", "proj.tracklist.delete_audio_title": "Supprimer l'audio", "proj.tracklist.pin_note": "Épingler une note ici", "proj.tracklist.uploading": "Envoi du mix...", "proj.tracklist.drag_drop": "Glisser la maquette (MP3/WAV) ici", "proj.tracklist.prep": "🎵 Maquette en cours de préparation au studio...", "proj.tracklist.see_notes": "Voir les retours", "proj.tracklist.add_note": "Ajouter une note", "proj.tracklist.remove_track": "Retirer le titre", "proj.tracklist.notes_label": "Notes de mixage", "proj.tracklist.notes_ph_admin": "Les notes du client apparaîtront ici...", "proj.tracklist.notes_ph_artist": "Ex: 0:45 - Baisser un peu la charley...", "proj.tracklist.close": "Fermer", "proj.tracklist.save": "Enregistrer", "proj.tracklist.empty_admin": "La tracklist est vide. Ajoutez le premier titre.", "proj.tracklist.empty_artist": "La tracklist n'a pas encore été créée.",

    // Auth
    "auth.login.title": "Connexion", "auth.login.subtitle": "Accède à ton espace.", "auth.email": "Adresse Email", "auth.password": "Mot de passe", "auth.btn.login": "Se connecter", "auth.no_account": "Pas encore de compte ?", "auth.create_one": "Créer un espace",
    "auth.reg.title": "Créer mon espace", "auth.reg.subtitle": "Rejoins le studio.", "auth.name": "Nom d'artiste", "auth.btn.register": "S'inscrire", "auth.has_account": "Déjà un compte ?", "auth.login_here": "Connecte-toi",
    "auth.check_email.title": "Vérifie tes emails ! ✉️", "auth.check_email.desc": "Un lien de confirmation a été envoyé à ton adresse.", "auth.check_email.btn": "Retour à l'accueil",
    "auth.forgot_pwd": "Mot de passe oublié ?", "auth.err_occurred": "Une erreur est survenue : ", "auth.err_invalid": "Email ou mot de passe incorrect.", "auth.err_confirm": "Veuillez confirmer votre adresse email avant de vous connecter.",

    // Reservations & Artistes
    "res.title": "Réservation", "res.subtitle": "Bloquez votre prochaine session studio, tournage ou mixage.",
    "art.title": "Artistes", "art.subtitle": "Gérez votre répertoire client et leurs profils.", "art.add": "Ajouter un client", "art.empty": "Aucun artiste", "art.empty_desc": "Commencez par ajouter votre premier client.", "art.no_email": "Aucun email", "art.alert.delete": "Êtes-vous sûr de vouloir supprimer cet artiste ? \n⚠️ Tous ses projets et sessions seront supprimés !", "art.alert.upload_err": "Erreur lors de l'upload : ", "art.modal.edit": "Modifier le client", "art.modal.new": "Nouveau Client", "art.modal.name": "Nom de scène *", "art.modal.email": "Email (optionnel)", "art.modal.phone": "Téléphone (optionnel)", "art.modal.update_btn": "Mettre à jour", "art.modal.save_btn": "Enregistrer"
  },
  en: {
    // Menu & Dashboard & PWA
    "menu.dashboard": "Dashboard", "menu.reservations": "Book", "menu.services": "Services", "menu.projets": "Projects", "menu.sessions": "Sessions", "menu.artistes": "Artists", "menu.finances": "Finances", "menu.profil": "Profile",
    "dash.art.title": "Artist Area", "dash.art.welcome": "Welcome", "dash.art.proj_title": "Active Projects", "dash.art.no_proj": "No active projects.", "dash.art.tracks": "Tracks", "dash.art.sess_title": "Upcoming Sessions", "dash.art.no_sess": "No sessions.",
    "dash.adm.title": "Dashboard", "dash.adm.subtitle": "Global management interface.", "dash.adm.artists": "Artists", "dash.adm.projects": "Projects", "dash.adm.sessions": "Sessions", "dash.adm.revenue": "Revenue", "dash.adm.recent_sess": "Recent Sessions", "dash.adm.no_sess": "No sessions.", "dash.adm.orders": "Orders", "dash.adm.history": "History", "dash.adm.no_orders": "No orders.", "dash.adm.process": "Process", "dash.adm.returns": "Feedback", "dash.adm.no_returns": "No feedback.", "dash.adm.unknown": "Unknown",
    "pwa.title": "Pro Tip 📱", "pwa.desc": "Install LACAV & me on your home screen!", "pwa.apple": "🍎 iPhone (Safari)", "pwa.android": "🤖 Android (Chrome)", "pwa.btn": "GOT IT",

    // Modals globaux (Historique, Facturation)
    "modal.bill.title": "Bill the service", "modal.bill.artist": "Artist:", "modal.bill.service": "Service:", "modal.bill.amount": "Final billed amount (€) *", "modal.bill.validate": "Validate & Cash in", 
    "modal.history.title": "Services History", "modal.history.empty": "No services processed yet.",

    // Sessions & Services & Finances & Profil
    "sess.title": "Schedule", "sess.subtitle": "Manage sessions.", "sess.new": "New session", "sess.empty": "No sessions", "sess.empty_desc": "Schedule is empty.", "sess.duration": "Duration: ", "sess.hours": " h", "sess.done": "Done", "sess.modal.edit": "Edit", "sess.modal.new": "New", "sess.modal.title_label": "Title *", "sess.modal.artist": "Artist *", "sess.modal.select_artist": "Select...", "sess.modal.date": "Date *", "sess.modal.duration_label": "Duration (h) *", "sess.modal.update_btn": "Update", "sess.modal.add_btn": "Schedule",
    "srv.title": "Services", "srv.subtitle": "Custom services.", "srv.add": "Add service", "srv.order": "Order", "srv.modal.order_title": "Request", "srv.modal.sent": "Sent!", "srv.modal.contact_soon": "We'll contact you.", "srv.modal.need": "Your needs:", "srv.modal.send_btn": "Send", "srv.modal.edit_title": "Edit", "srv.modal.new_title": "New", "srv.modal.name_label": "Name *", "srv.modal.desc_label": "Description *", "srv.modal.price_label": "Price *", "srv.modal.save_btn": "Save",
    "fin.title": "Treasury", "fin.subtitle": "Income and expenses.", "fin.balance": "Net Balance", "fin.income": "Income", "fin.expense": "Expenses", "fin.add": "New Transaction", "fin.empty": "No transactions.", "fin.col.date": "Date", "fin.col.desc": "Description", "fin.col.type": "Type", "fin.col.amount": "Amount", "fin.modal.title": "Add", "fin.modal.desc": "Description *", "fin.modal.amount": "Amount *", "fin.modal.type": "Type *", "fin.modal.type_in": "Income (+)", "fin.modal.type_out": "Expense (-)", "fin.modal.date": "Date *", "fin.modal.btn": "Add",
    "prof.title": "Profile", "prof.subtitle": "Manage info.", "prof.logout": "Log out", "prof.info": "My Info", "prof.name": "Name", "prof.email": "Email", "prof.member": "Member since", "prof.no_info": "Not found.",
    
    // Projets & Tracklist
    "proj.title": "Projects", "proj.subtitle": "Manage productions.", "proj.new": "New project", "proj.empty": "No projects", "proj.unknown_artist": "Unknown", "proj.tracks": "Track", "proj.tracks_pl": "Tracks", "proj.open_tracklist": "Open Tracklist",
    "proj.modal.edit": "Edit project", "proj.modal.new": "New Project", "proj.modal.title_label": "Project Title *", "proj.modal.artist_label": "Artist *", "proj.modal.select_artist": "Select an artist...", "proj.modal.desc_label": "Description", "proj.modal.update_btn": "Update", "proj.modal.create_btn": "Create project",
    "proj.alert.no_artist": "Please select an artist!", "proj.alert.delete_proj": "Are you sure you want to delete this project? \n⚠️ Sessions and songs will be lost!", "proj.alert.delete_track": "Remove this track from the tracklist?", "proj.alert.delete_audio": "Do you really want to delete the audio file for this track?", "proj.alert.upload_err": "Upload error: ",
    "proj.tracklist.title": "Tracklist: ", "proj.tracklist.add_placeholder": "Add a track (e.g., Intro, Track 1...)", "proj.tracklist.status.rec": "🔴 RECORDING", "proj.tracklist.status.mix": "🎛️ MIXING", "proj.tracklist.status.wait": "⏳ WAITING FOR FEEDBACK", "proj.tracklist.status.done": "✅ DONE", "proj.tracklist.delete_audio_title": "Delete audio", "proj.tracklist.pin_note": "Pin a note here", "proj.tracklist.uploading": "Uploading mix...", "proj.tracklist.drag_drop": "Drag the file (MP3/WAV) here", "proj.tracklist.prep": "🎵 Track is being prepared at the studio...", "proj.tracklist.see_notes": "See feedback", "proj.tracklist.add_note": "Add a note", "proj.tracklist.remove_track": "Remove track", "proj.tracklist.notes_label": "Mix notes", "proj.tracklist.notes_ph_admin": "Client notes will appear here...", "proj.tracklist.notes_ph_artist": "Ex: 0:45 - Lower the hi-hat slightly...", "proj.tracklist.close": "Close", "proj.tracklist.save": "Save", "proj.tracklist.empty_admin": "The tracklist is empty. Add the first track.", "proj.tracklist.empty_artist": "The tracklist hasn't been created yet.",

    // Auth
    "auth.login.title": "Log in", "auth.login.subtitle": "Access your account.", "auth.email": "Email", "auth.password": "Password", "auth.btn.login": "Sign in", "auth.no_account": "No account yet?", "auth.create_one": "Create one",
    "auth.reg.title": "Sign up", "auth.reg.subtitle": "Join the studio.", "auth.name": "Artist Name", "auth.btn.register": "Register", "auth.has_account": "Already have an account?", "auth.login_here": "Log in",
    "auth.check_email.title": "Check your email! ✉️", "auth.check_email.desc": "A confirmation link has been sent.", "auth.check_email.btn": "Back to home",
    "auth.forgot_pwd": "Forgot password?", "auth.err_occurred": "An error occurred: ", "auth.err_invalid": "Invalid email or password.", "auth.err_confirm": "Please confirm your email address before logging in.",

    // Reservations & Artistes
    "res.title": "Booking", "res.subtitle": "Book your next studio, video, or mixing session.",
    "art.title": "Artists", "art.subtitle": "Manage your client roster and profiles.", "art.add": "Add a client", "art.empty": "No artists", "art.empty_desc": "Start by adding your first client.", "art.no_email": "No email", "art.alert.delete": "Are you sure you want to delete this artist? \n⚠️ All their projects and sessions will be deleted!", "art.alert.upload_err": "Upload error: ", "art.modal.edit": "Edit client", "art.modal.new": "New Client", "art.modal.name": "Stage name *", "art.modal.email": "Email (optional)", "art.modal.phone": "Phone (optional)", "art.modal.update_btn": "Update", "art.modal.save_btn": "Save"
  },
  pt: {
    // Menu & Dashboard & PWA
    "menu.dashboard": "Painel", "menu.reservations": "Reservar", "menu.services": "Serviços", "menu.projets": "Projetos", "menu.sessions": "Sessões", "menu.artistes": "Artistas", "menu.finances": "Finanças", "menu.profil": "Perfil",
    "dash.art.title": "Espaço Artista", "dash.art.welcome": "Bem-vindo", "dash.art.proj_title": "Projetos Ativos", "dash.art.no_proj": "Nenhum projeto.", "dash.art.tracks": "Faixas", "dash.art.sess_title": "Próximas Sessões", "dash.art.no_sess": "Nenhuma sessão.",
    "dash.adm.title": "Painel", "dash.adm.subtitle": "Gestão global.", "dash.adm.artists": "Artistas", "dash.adm.projects": "Projetos", "dash.adm.sessions": "Sessões", "dash.adm.revenue": "Receitas", "dash.adm.recent_sess": "Sessões Recentes", "dash.adm.no_sess": "Nenhuma sessão.", "dash.adm.orders": "Pedidos", "dash.adm.history": "Histórico", "dash.adm.no_orders": "Nenhum pedido.", "dash.adm.process": "Processar", "dash.adm.returns": "Feedback", "dash.adm.no_returns": "Nenhum feedback.", "dash.adm.unknown": "Desconhecido",
    "pwa.title": "Dica 📱", "pwa.desc": "Instale o app na tela inicial!", "pwa.apple": "🍎 iPhone (Safari)", "pwa.android": "🤖 Android (Chrome)", "pwa.btn": "ENTENDI",

    // Modals globaux (Historique, Facturation)
    "modal.bill.title": "Faturar o serviço", "modal.bill.artist": "Artista:", "modal.bill.service": "Serviço:", "modal.bill.amount": "Valor final faturado (€) *", "modal.bill.validate": "Validar e Receber", 
    "modal.history.title": "Histórico de Serviços", "modal.history.empty": "Nenhum serviço processado ainda.",

    // Sessions & Services & Finances & Profil
    "sess.title": "Agenda", "sess.subtitle": "Gerencie as sessões.", "sess.new": "Nova", "sess.empty": "Nenhuma sessão", "sess.empty_desc": "Agenda vazia.", "sess.duration": "Duração: ", "sess.hours": " h", "sess.done": "Concluída", "sess.modal.edit": "Editar", "sess.modal.new": "Nova", "sess.modal.title_label": "Título *", "sess.modal.artist": "Artista *", "sess.modal.select_artist": "Selecione...", "sess.modal.date": "Data *", "sess.modal.duration_label": "Duração (h) *", "sess.modal.update_btn": "Atualizar", "sess.modal.add_btn": "Agendar",
    "srv.title": "Serviços", "srv.subtitle": "Nossos serviços.", "srv.add": "Adicionar", "srv.order": "Pedir", "srv.modal.order_title": "Pedido", "srv.modal.sent": "Enviado!", "srv.modal.contact_soon": "Entraremos em contato.", "srv.modal.need": "Sua necessidade:", "srv.modal.send_btn": "Enviar", "srv.modal.edit_title": "Editar", "srv.modal.new_title": "Novo", "srv.modal.name_label": "Nome *", "srv.modal.desc_label": "Descrição *", "srv.modal.price_label": "Preço *", "srv.modal.save_btn": "Salvar",
    "fin.title": "Finanças", "fin.subtitle": "Receitas e despesas.", "fin.balance": "Saldo Líquido", "fin.income": "Receitas", "fin.expense": "Despesas", "fin.add": "Nova Transação", "fin.empty": "Nenhuma transação.", "fin.col.date": "Data", "fin.col.desc": "Descrição", "fin.col.type": "Tipo", "fin.col.amount": "Valor", "fin.modal.title": "Adicionar", "fin.modal.desc": "Descrição *", "fin.modal.amount": "Valor *", "fin.modal.type": "Tipo *", "fin.modal.type_in": "Receita (+)", "fin.modal.type_out": "Despesa (-)", "fin.modal.date": "Data *", "fin.modal.btn": "Adicionar",
    "prof.title": "Perfil", "prof.subtitle": "Suas informações.", "prof.logout": "Sair", "prof.info": "Minhas Informações", "prof.name": "Nome", "prof.email": "Email", "prof.member": "Membro desde", "prof.no_info": "Não encontrado.",
    
    // Projets & Tracklist
    "proj.title": "Projetos", "proj.subtitle": "Gerencie produções.", "proj.new": "Novo projeto", "proj.empty": "Nenhum projeto", "proj.unknown_artist": "Desconhecido", "proj.tracks": "Faixa", "proj.tracks_pl": "Faixas", "proj.open_tracklist": "Abrir Tracklist",
    "proj.modal.edit": "Editar projeto", "proj.modal.new": "Novo Projeto", "proj.modal.title_label": "Título do projeto *", "proj.modal.artist_label": "Artista *", "proj.modal.select_artist": "Selecione um artista...", "proj.modal.desc_label": "Descrição", "proj.modal.update_btn": "Atualizar", "proj.modal.create_btn": "Criar projeto",
    "proj.alert.no_artist": "Por favor, selecione um artista!", "proj.alert.delete_proj": "Tem certeza que deseja excluir este projeto? \n⚠️ Sessões e músicas serão perdidas!", "proj.alert.delete_track": "Remover esta faixa da tracklist?", "proj.alert.delete_audio": "Deseja realmente excluir o áudio desta faixa?", "proj.alert.upload_err": "Erro no upload: ",
    "proj.tracklist.title": "Tracklist: ", "proj.tracklist.add_placeholder": "Adicionar uma faixa (ex: Intro, Faixa 1...)", "proj.tracklist.status.rec": "🔴 GRAVAÇÃO", "proj.tracklist.status.mix": "🎛️ MIXAGEM", "proj.tracklist.status.wait": "⏳ AGUARDANDO FEEDBACK", "proj.tracklist.status.done": "✅ CONCLUÍDO", "proj.tracklist.delete_audio_title": "Excluir áudio", "proj.tracklist.pin_note": "Fixar uma nota aqui", "proj.tracklist.uploading": "Enviando mix...", "proj.tracklist.drag_drop": "Arraste o arquivo (MP3/WAV) aqui", "proj.tracklist.prep": "🎵 A faixa está sendo preparada no estúdio...", "proj.tracklist.see_notes": "Ver feedbacks", "proj.tracklist.add_note": "Adicionar uma nota", "proj.tracklist.remove_track": "Remover faixa", "proj.tracklist.notes_label": "Notas de mixagem", "proj.tracklist.notes_ph_admin": "As notas do cliente aparecerão aqui...", "proj.tracklist.notes_ph_artist": "Ex: 0:45 - Abaixar um pouco o chimbal...", "proj.tracklist.close": "Fechar", "proj.tracklist.save": "Salvar", "proj.tracklist.empty_admin": "A tracklist está vazia. Adicione a primeira faixa.", "proj.tracklist.empty_artist": "A tracklist ainda não foi criada.",

    // Auth
    "auth.login.title": "Entrar", "auth.login.subtitle": "Acesse sua conta.", "auth.email": "E-mail", "auth.password": "Senha", "auth.btn.login": "Entrar", "auth.no_account": "Ainda não tem conta?", "auth.create_one": "Criar conta",
    "auth.reg.title": "Registar", "auth.reg.subtitle": "Junte-se ao estúdio.", "auth.name": "Nome do Artista", "auth.btn.register": "Inscrever-se", "auth.has_account": "Já tem uma conta?", "auth.login_here": "Entrar",
    "auth.check_email.title": "Verifique seu e-mail! ✉️", "auth.check_email.desc": "Um link de confirmação foi enviado.", "auth.check_email.btn": "Voltar ao início",
    "auth.forgot_pwd": "Esqueceu a senha?", "auth.err_occurred": "Ocorreu um erro: ", "auth.err_invalid": "E-mail ou senha incorretos.", "auth.err_confirm": "Por favor, confirme seu e-mail antes de entrar.",

    // Reservations & Artistes
    "res.title": "Reserva", "res.subtitle": "Agende sua próxima sessão de estúdio, vídeo ou mixagem.",
    "art.title": "Artistas", "art.subtitle": "Gerencie sua carteira de clientes e perfis.", "art.add": "Adicionar cliente", "art.empty": "Nenhum artista", "art.empty_desc": "Comece adicionando seu primeiro cliente.", "art.no_email": "Sem e-mail", "art.alert.delete": "Tem certeza que deseja excluir este artista? \n⚠️ Todos os seus projetos e sessões serão excluídos!", "art.alert.upload_err": "Erro no upload: ", "art.modal.edit": "Editar cliente", "art.modal.new": "Novo Cliente", "art.modal.name": "Nome artístico *", "art.modal.email": "E-mail (opcional)", "art.modal.phone": "Telefone (opcional)", "art.modal.update_btn": "Atualizar", "art.modal.save_btn": "Salvar"
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
