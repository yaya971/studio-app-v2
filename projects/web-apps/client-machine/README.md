# ⚡ Client Machine — Studio A v2

Générateur autonome d'acquisitions de clients et moteur de refonte express pour commerces locaux et PME.

---

## 🎯 Fonctionnalités Clés

1. **Recherche de Prospects Multi-Sources**
   - Requêtes géolocalisées en temps réel via OpenStreetMap / Overpass API (100% gratuit, sans clé requise).
   - Support optionnel d'Apify & Google Places pour l'enrichissement en profondeur.
   - Collecte : Nom, Catégorie, Adresse, Coordonnées GPS, Téléphone, Email, Réseaux sociaux (Instagram, Facebook), Notes & Avis Google.

2. **Carte Interactive avec Code Couleur Stratégique**
   - Fond de carte sombre haute performance (CartoDB Dark Matter).
   - 🔵 **Bleu** : Email vérifié disponible (prospection automatique).
   - 🟡 **Jaune** : Contact direct par DM Instagram / Facebook (absence d'email direct).
   - 🔴 **Rose** : Absence de site web ou score critique (<35/100).
   - Popups interactives avec audit flash et redirection en 1 clic.

3. **Audit IA & Qualification 360°**
   - Analyse de la réactivité mobile, accessibilité WCAG, SEO local et vitesse.
   - Détection automatique des points de friction et estimation du manque à gagner mensuel en chiffre d'affaires.

4. **Refonte Interactive Avant / Après**
   - Curseur glissant interactif Avant/Après.
   - Sélecteur de viewport : 💻 Desktop (1000px), 📱 Tablet (768px), 📱 Mobile (375px).
   - Maquettes modernes générées dynamiquement selon le secteur d'activité (restaurants, salons, artisans, avocats, etc.).
   - Export 1-clic du code HTML autonome et simulateur de déploiement Vercel.

5. **Propositions Commerciales & Kit Outreach (3 Angles Business)**
   - **Angle 1** : Chiffre d'Affaires & Nouveaux Clients (calcul ROI, fin des pertes sur smartphone).
   - **Angle 2** : Crédibilité, Image de Marque & Concurrence Locale.
   - **Angle 3** : Solution Clé en Main & Zéro Contrainte (livraison garantie 7 jours).
   - Mentions légales et clause de désinscription RGPD intégrées.
   - Boîte à outils DM personnalisée prête à copier pour Instagram et Messenger.

6. **CRM & Pipeline Kanban Intégré**
   - 6 colonnes : *Nouveau*, *Qualifié & Audité*, *Proposition Envoyée*, *En Négociation*, *Client Gagné*, *Non Retenu*.
   - Badge d'ouverture d'email simulé, historique, notes et export CSV.

7. **Profil d'Agence & Coffre-Fort de Clés API**
   - Personnalisation du profil de votre agence, pitch, tarifs et lien Calendly.
   - Stockage local chiffré dans le navigateur des clés API (Gemini, Apify, Vercel, Resend).
   - Sauvegarde & Restauration totale en 1 clic au format JSON.

---

## 🚀 Démarrage Rapide

```bash
# Dans le dossier de l'application
cd projects/web-apps/client-machine

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.
