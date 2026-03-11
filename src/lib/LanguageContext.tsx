"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// NOTRE DICTIONNAIRE
const translations = {
  fr: {
    "menu.dashboard": "Dashboard",
    "menu.reservations": "Réserver",
    "menu.services": "Services",
    "menu.projets": "Projets",
    "menu.sessions": "Sessions",
    "menu.artistes": "Artistes",
    "menu.finances": "Finances",
    "menu.profil": "Profil",
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.pt": "PT",
  },
  en: {
    "menu.dashboard": "Dashboard",
    "menu.reservations": "Book",
    "menu.services": "Services",
    "menu.projets": "Projects",
    "menu.sessions": "Sessions",
    "menu.artistes": "Artists",
    "menu.finances": "Finances",
    "menu.profil": "Profile",
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.pt": "PT",
  },
  pt: {
    "menu.dashboard": "Painel",
    "menu.reservations": "Reservar",
    "menu.services": "Serviços",
    "menu.projets": "Projetos",
    "menu.sessions": "Sessões",
    "menu.artistes": "Artistas",
    "menu.finances": "Finanças",
    "menu.profil": "Perfil",
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.pt": "PT",
  }
};

type Language = 'fr' | 'en' | 'pt';

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur avait déjà choisi une langue avant
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

  // Empêche les bugs d'affichage avant le chargement de la langue
  if (!mounted) return <div className="bg-black min-h-screen"></div>;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
