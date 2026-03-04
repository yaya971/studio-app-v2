import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Dark Neon Dashboard",
  description: "A sleek dark neon interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-black flex overflow-x-hidden min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-black overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
