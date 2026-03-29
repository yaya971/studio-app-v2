import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// On initialise Stripe avec ta clé secrète cachée dans Vercel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Version de l'API Stripe
});

export async function POST(req: Request) {
  try {
    // On récupère les infos envoyées par ton application (Titre du service et Prix)
    const body = await req.json();
    const { title, amount } = body;

    // On crée la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Paiement par carte bancaire
      line_items: [
        {
          price_data: {
            currency: 'eur', // Devise : Euro
            product_data: {
              name: title, // Le nom du service (ex: Mixage Express)
            },
            unit_amount: amount, // Le prix en centimes (ex: 5000 pour 50€)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Où renvoyer le client après le paiement (succès ou annulation)
      success_url: `${req.headers.get('origin')}/services?success=true`,
      cancel_url: `${req.headers.get('origin')}/services?canceled=true`,
    });

    // On renvoie l'URL de la page de paiement Stripe à ton application
    return NextResponse.json({ url: session.url });
    
  } catch (err: any) {
    console.error("Erreur Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
