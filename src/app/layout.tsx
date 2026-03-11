"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Folder, Mic2, LogOut, UserCircle, Wallet, CalendarDays, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

// On crée un composant "interne" pour pouvoir utiliser le traducteur
function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // On appelle notre dictionnaire et la fonction pour changer de langue
  const { t, lang, changeLang } = useLanguage();

  useEffect(() => {
    setIsClient(true);
    checkUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkUserRole();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('artistes').select('id').eq('user_id', session.user.id).maybeSingle();
      setIsAdmin(!data); 
    }
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // MENU TRADUIT AUTOMATIQUEMENT
  const navItems = [
    { name: t("menu.dashboard"), href: "/", icon: LayoutDashboard, role: "both" },
    { name: t("menu.reservations"), href: "/reservations", icon: CalendarDays, role: "artiste" },
    { name: t("menu.services"), href: "/services", icon: Store, role: "both" },
    { name: t("menu.projets"), href: "/projets", icon: Folder, role: "both" },
    { name: t("menu.sessions"), href: "/sessions", icon: Mic2, role: "both" },
    { name: t("menu.artistes"), href: "/artistes", icon: Users, role: "admin" },
    { name: t("menu.finances"), href: "/finances", icon: Wallet, role: "admin" },
    { name: t("menu.profil"), href: "/profil", icon: UserCircle, role: "both" },
  ].filter(item => {
    if (isAdmin && item.role === "artiste") return false; 
    if (!isAdmin && item.role === "admin") return false;  
    return true;
  });

  return (
    <>
      {isClient && !isAuthPage && (
        <>
          {/* 💻 MENU BUREAU */}
          <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-800 bg-black p-6 md:flex z-50">
            <div className="mb-12">
              <h1 className="text-2xl font-bold text-[#4ade80] tracking-wider">LACAV & me</h1>
            </div>
            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive ? "bg-[#4ade80]/10 text-[#4ade80]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                    <item.icon size={20} />
                    <span className="font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* BOUTONS DE LANGUES (BUREAU) */}
            <div className="mt-auto flex justify-center gap-2 border-t border-gray-800 p-4 pb-0 pt-4 mb-4">
              <button onClick={() => changeLang('fr')} className={`rounded px-2 py-1 text-xs font-bold transition-all ${lang === 'fr' ? 'bg-[#4ade80] text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>FR</button>
              <button onClick={() => changeLang('en')} className={`rounded px-2 py-1 text-xs font-bold transition-all ${lang === 'en' ? 'bg-[#4ade80] text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>EN</button>
              <button onClick={() => changeLang('pt')} className={`rounded px-2 py-1 text-xs font-bold transition-all ${lang === 'pt' ? 'bg-[#4ade80] text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>PT</button>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 border-t border-gray-800 pt-6">
              <LogOut size={20} />
              <span className="font-bold">Déconnexion</span>
            </button>
          </aside>

          {/* 📱 MENU MOBILE */}
          <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center px-4 overflow-x-auto border-t border-gray-800 bg-black/95 backdrop-blur-md md:hidden custom-scrollbar">
            <div className="flex w-full items-center justify-between gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 ${isActive ? "text-[#4ade80]" : "text-gray-500 hover:text-gray-300"}`}>
                    <item.icon size={20} />
                    <span className="text-[10px] font-bold">{item.name}</span>
                  </Link>
                );
              })}

              {/* BOUTONS DE LANGUES (MOBILE) */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800 ml-2">
                <button onClick={() => changeLang('fr')} className={`text-xs font-bold ${lang === 'fr' ? 'text-[#4ade80]' : 'text-gray-500'}`}>FR</button>
                <button onClick={() => changeLang('en')} className={`text-xs font-bold ${lang === 'en' ? 'text-[#4ade80]' : 'text-gray-500'}`}>EN</button>
                <button onClick={() => changeLang('pt')} className={`text-xs font-bold ${lang === 'pt' ? 'text-[#4ade80]' : 'text-gray-500'}`}>PT</button>
              </div>
            </div>
          </nav>
        </>
      )}

      <main className={`${isClient && !isAuthPage ? "md:ml-64" : ""} min-h-screen`}>
        {children}
      </main>
    </>
  );
}

// LE COMPOSANT PRINCIPAL QUI ENVELOPPE LE TOUT
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen pb-20 md:pb-0`}>
        {/* On charge le dictionnaire ici */}
        <LanguageProvider>
          <InnerLayout>{children}</InnerLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
