"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Folder, Mic2, LogOut, UserCircle, Wallet, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // NOUVEAU MENU COMPLET : Avec Réservation et Finances
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, adminOnly: false },
    { name: "Réserver", href: "/reservations", icon: CalendarDays, adminOnly: false },
    { name: "Projets", href: "/projets", icon: Folder, adminOnly: false },
    { name: "Sessions", href: "/sessions", icon: Mic2, adminOnly: false },
    { name: "Artistes", href: "/artistes", icon: Users, adminOnly: true },
    { name: "Finances", href: "/finances", icon: Wallet, adminOnly: true },
    { name: "Profil", href: "/profil", icon: UserCircle, adminOnly: false },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <html lang="fr">
      <body className={`${inter.className} bg-black text-white min-h-screen pb-20 md:pb-0`}>
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
              <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 mt-4 border-t border-gray-800 pt-6">
                <LogOut size={20} />
                <span className="font-bold">Déconnexion</span>
              </button>
            </aside>

            {/* 📱 MENU MOBILE (Scrollable horizontalement si besoin) */}
            <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-gray-800 bg-black/95 backdrop-blur-md md:hidden overflow-x-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center min-w-[70px] h-full space-y-1 ${isActive ? "text-[#4ade80]" : "text-gray-500 hover:text-gray-300"}`}>
                    <item.icon size={20} />
                    <span className="text-[10px] font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}

        <main className={`${isClient && !isAuthPage ? "md:ml-64" : ""} min-h-screen`}>
          {children}
        </main>
      </body>
    </html>
  );
}
