import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Crée une réponse de base qui laisse passer l'utilisateur
  const res = NextResponse.next();
  
  try {
    // Initialise Supabase pour vérifier la session
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
  } catch (error) {
    console.error('Erreur Middleware Supabase:', error);
  }

  return res;
}

// Empêche le vigile de bloquer les images, les styles et les fichiers de Next.js
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
