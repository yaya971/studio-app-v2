import express from 'express';
import cors from 'cors';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

export const SAAS_PLANS = [
  {
    id: "creator",
    name: "Creator Viral Pass",
    badge: "Populaire",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Parfait pour les créateurs TikTok, YouTube Shorts et Reels qui veulent automatiser leur contenu.",
    features: [
      "100 Vidéos découpées en 10 Shorts / mois",
      "Filtres Anti-Shadowban & Anti-pHash",
      "Sous-titres animés karaoké style Hormozi",
      "Génération automatique des descriptions & hashtags",
      "Support prioritaire 7j/7"
    ],
    cta: "Démarrer l'essai gratuit de 14 jours"
  },
  {
    id: "studio",
    name: "Studio & Producer Suite",
    badge: "Recommandé Pro",
    priceMonthly: 99,
    priceYearly: 79,
    description: "Le pack ultime pour les producteurs, beatmakers et agences de contenu omnicanal.",
    features: [
      "Vidéos illimitées en 4K 60fps 9:16",
      "Séparation de Stems Audio illimitée (HTDemucs GPU)",
      "Vocal & Acapella Isolator 1-Clic",
      "Mashup DJ Remix Studio avec Beat-Matching",
      "Export multipiste WAV 24-bit studio",
      "Accès API & Webhooks webhook"
    ],
    cta: "Obtenir l'Accès Studio Immédiat"
  },
  {
    id: "enterprise",
    name: "Agency & Enterprise Swarm",
    badge: "Scale Ultra",
    priceMonthly: 249,
    priceYearly: 199,
    description: "Pour les agences gérant 10+ comptes clients avec automatisation totale de publication.",
    features: [
      "Agents navigateurs sub-10s (JevSpeed) illimités",
      "Postulation & Auto-Publishing TikTok / X / Insta",
      "Workspace multi-utilisateurs & marque blanche",
      "Modèles Kev micro-décisions dédiés privés",
      "Serveur dédié et SLA garanti 99.9%"
    ],
    cta: "Contacter pour Déploiement Entreprise"
  }
];

export function calculateEstimatedRevenue(monthlyViews = 500000, conversionRate = 0.02, productPrice = 29) {
  const visitors = monthlyViews * 0.05; // 5% click link in bio
  const buyers = Math.floor(visitors * conversionRate);
  const estimatedRevenue = buyers * productPrice;
  const timeSavedHours = 45; // 45h saved per month
  return {
    monthlyViews,
    visitorsEstimated: Math.floor(visitors),
    estimatedBuyers: buyers,
    estimatedRevenueEuros: estimatedRevenue,
    timeSavedHours,
    roiMultiplier: +(estimatedRevenue / 99).toFixed(1)
  };
}

app.get('/api/plans', (req, res) => {
  res.json({ success: true, plans: SAAS_PLANS });
});

app.post('/api/calculate-roi', (req, res) => {
  const { views = 500000, price = 29 } = req.body;
  const result = calculateEstimatedRevenue(Number(views), 0.02, Number(price));
  res.json({ success: true, roi: result });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`💎 SaaS Kinetic Bento Landing (Outil 33) tourne sur http://localhost:${PORT}`);
  });
}

export default app;
