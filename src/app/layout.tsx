"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Folder, Mic2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Permet d'éviter les bugs de rendu entre le serveur et le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Artistes", href: "/artistes", icon: Users },
    { name: "Projets", href: "/projets", icon: Folder },
    { name: "Sessions", href: "/sessions", icon: Mic2 },
  ];

  return (
    <html lang="fr">
      {/* Sur mobile, on rajoute un espace en bas (pb-20) pour ne pas que le menu cache le texte */}
      <body className={`${inter.className} bg-black text-white min-h-screen pb-20 md:pb-0`}>
        {isClient && !isAuthPage && (
          <>
            {/* 💻 MENU BUREAU (Caché sur téléphone) */}
            <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-800 bg-black p-6 md:flex z-50">
              <div className="mb-12">
                <h1 className="text-2xl font-bold text-[#4ade80] tracking-wider">LACAV & me</h1>
              </div>
              <nav className="flex flex-1 flex-col gap-2">
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
              <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500">
                <LogOut size={20} />
                <span className="font-bold">Déconnexion</span>
              </button>
            </aside>

            {/* 📱 MENU MOBILE (Barre en bas - Caché sur ordinateur) */}
            <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-gray-800 bg-black/95 backdrop-blur-md md:hidden">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-[#4ade80]" : "text-gray-500 hover:text-gray-300"}`}>
                    <item.icon size={20} />
                    <span className="text-[10px] font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </>
        )}

        {/* CONTENU PRINCIPAL DE L'APPLICATION */}
        <main className={`${isClient && !isAuthPage ? "md:ml-64" : ""} min-h-screen`}>
          {children}
        </main>
      </body>
    </html>
  );
}
