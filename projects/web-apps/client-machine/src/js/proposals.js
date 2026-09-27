/**
 * Commercial Proposals & Multi-Angle Outreach Generator
 * Produces 3 business angles (Revenue/ROI, Brand Credibility, Turnkey Simplicity)
 * Includes mandatory GDPR opt-out footers and tailored Instagram/Facebook DM scripts
 */

export class ProposalGenerator {
  static getAngles(lead, agencyProfile = {}) {
    const agencyName = agencyProfile.name || 'Studio A';
    const senderName = agencyProfile.founder || 'Alexandre';
    const calendlyUrl = agencyProfile.calendly || 'https://calendly.com/studio-a-demo/refonte';

    // 1. Angle Chiffre d'Affaires & Acquisition
    const proposalRevenue = {
      id: 'revenue',
      title: '📈 Angle 1 : Chiffre d\'Affaires & Nouveaux Clients',
      tagline: 'Focalisé sur la rentabilité immédiate et la fin des pertes sur smartphone',
      subject: `Opportunité : +15 à 20 clients/mois pour ${lead.name} à ${lead.city}`,
      body: `Bonjour l'équipe de ${lead.name},

Je vous contacte directement car j'ai analysé la présence en ligne des commerces de ${lead.city}, et votre établissement bénéficie d'une superbe réputation (${lead.rating}/5 pour ${lead.reviewsCount} avis).

Cependant, en effectuant un audit sur smartphone de votre site actuel, nous avons relevé un point critique :
👉 ${lead.painPoints[0] || 'Le site n\'est pas adapté aux mobiles'}, ce qui vous fait perdre selon nos estimations entre 60% et 75% des visiteurs locaux qui cherchent un "${lead.category}" depuis leur téléphone.

Nous avons préparé une maquette fonctionnelle moderne de refonte pour ${lead.name}, avec système de réservation en 1 clic :
🔗 Voir votre refonte interactive : https://preview.studio-a.fr/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}

Cette refonte est conçue pour rentabiliser votre investissement dès le premier mois. 

Auriez-vous 10 minutes cette semaine pour un échange rapide ?
Vous pouvez choisir un créneau ici : ${calendlyUrl}

Bien cordialement,

${senderName}
Directeur Associé — ${agencyName}
Téléphone : 01 89 00 00 00`
    };

    // 2. Angle Crédibilité & Concurrence Locale
    const proposalBrand = {
      id: 'brand',
      title: '💎 Angle 2 : Crédibilité & Image de Marque',
      tagline: 'Mettre en avant votre savoir-faire face à vos concurrents de la zone',
      subject: `Question sur l'image en ligne de ${lead.name}`,
      body: `Bonjour,

En découvrant l'excellence de vos avis clients (${lead.reviewsCount} avis élogieux), nous avons remarqué un décalage flagrant avec votre site actuel :
👉 ${lead.painPoints[1] || 'L\'ergonomie actuelle date de plusieurs années et ne reflète pas votre standing'}.

Aujourd'hui, un prospect qui hésite entre deux ${lead.category} à ${lead.city} choisit systématiquement celui dont l'interface inspire le plus confiance et modernité.

Nous avons conçu un aperçu visuel haut de gamme spécialement pour ${lead.name} :
🔗 Comparatif Avant/Après : https://preview.studio-a.fr/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}

L'objectif : vous positionner sans contestation comme la référence incontournable de votre secteur à ${lead.city}.

Seriez-vous ouvert à ce que je vous montre les résultats en quelques minutes ?

Excellente journée,

${senderName} — ${agencyName}`
    };

    // 3. Angle Solution Clé en Main & Sérénité
    const proposalTurnkey = {
      id: 'turnkey',
      title: '⚡ Angle 3 : Solution Clé en Main & Zéro Contrainte',
      tagline: 'Offre livrée en 7 jours, aucune compétence technique requise',
      subject: `Votre refonte de site livrée en 7 jours pour ${lead.name}`,
      body: `Bonjour,

En tant que dirigeant de ${lead.name}, votre priorité est de gérer votre établissement, pas de perdre des heures avec des aspects techniques de serveurs ou de maintenance de site.

Chez ${agencyName}, nous prenons tout en charge de A à Z :
• Refonte ultra-rapide sur-mesure (optimisée mobile & SEO Google)
• Hébergement sécurisé haute performance & certificat SSL
• Mise à jour de vos coordonnées et horaires en temps réel
• Livraison complète clé en main sous 7 jours ouvrés

Votre maquette Avant / Après est déjà prête à être visualisée :
🔗 Découvrir la démonstration : https://preview.studio-a.fr/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}

Si le résultat vous plaît, nous pouvons mettre le site en ligne dès la semaine prochaine.

Quand seriez-vous disponible pour en parler 5 minutes au téléphone ?

Bien à vous,

${senderName} — ${agencyName}`
    };

    // Legal Mandatory RGPD Footer
    const legalFooter = `
─────────────────────────────────────────────────────────────
Mentions légales & Conformité RGPD :
Ce message vous est adressé dans le cadre d'une communication professionnelle B2B (art. L. 34-5 du CPCE).
Si vous ne souhaitez plus recevoir de messages de notre part, cliquez ici : 
https://optout.studio-a.fr/unsubscribe?email=${encodeURIComponent(lead.email || 'prospect')}
${agencyName} SAS • RCS Paris B 912 345 678 • 10 Rue de la Paix, 75002 Paris`;

    // Social Media DM Scripts (Instagram & Facebook manual copy)
    const instagramDm = `Salut l'équipe de ${lead.name} ! 👋
Je viens de voir votre compte, super travail sur ${lead.city} ! 🔥

J'ai remarqué un petit détail sur votre profil : vous n'avez pas de lien optimisé mobile pour réserver/commander directement, du coup vous perdez pas mal de monde qui passe sur votre compte.

On a fait un mockup interactif pour vous montrer à quoi ça ressemblerait en 1 clic :
👉 https://preview.studio-a.fr/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}

Dites-moi ce que vous en pensez, aucun engagement évidemment ! 😊`;

    const facebookDm = `Bonjour l'équipe de ${lead.name},
Félicitations pour vos retours clients sur ${lead.city} ! 👏

Nous venons de faire un audit rapide de votre présence web locale : nous avons créé un exemple de refonte responsive pour vous permettre de recevoir des demandes directes sans passer par des appels manuels.

Voici l'aperçu avant/après :
🔗 https://preview.studio-a.fr/${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}

Seriez-vous intéressé pour qu'on en discute 5 minutes ? Bonne journée !`;

    return {
      angles: [proposalRevenue, proposalBrand, proposalTurnkey],
      legalFooter,
      instagramDm,
      facebookDm
    };
  }
}
