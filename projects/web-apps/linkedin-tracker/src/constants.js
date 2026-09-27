export const STATUS_CONFIG = {
  applied: {
    id: 'applied',
    label: 'Postulé',
    icon: 'Send',
    color: 'hsl(210, 95%, 54%)',
    bgColor: 'hsla(210, 95%, 54%, 0.12)',
    borderColor: 'hsla(210, 95%, 54%, 0.3)',
    desc: 'Candidature soumise, en attente de traitement'
  },
  reviewing: {
    id: 'reviewing',
    label: 'En revue',
    icon: 'Eye',
    color: 'hsl(38, 92%, 52%)',
    bgColor: 'hsla(38, 92%, 52%, 0.12)',
    borderColor: 'hsla(38, 92%, 52%, 0.3)',
    desc: 'CV consulté par le recruteur ou responsable'
  },
  phone_screen: {
    id: 'phone_screen',
    label: 'Entretien RH',
    icon: 'PhoneCall',
    color: 'hsl(270, 75%, 66%)',
    bgColor: 'hsla(270, 75%, 66%, 0.12)',
    borderColor: 'hsla(270, 75%, 66%, 0.3)',
    desc: 'Premier échange de cadrage RH / Talent Acquisition'
  },
  tech_assessment: {
    id: 'tech_assessment',
    label: 'Test Technique',
    icon: 'Code',
    color: 'hsl(190, 88%, 52%)',
    bgColor: 'hsla(190, 88%, 52%, 0.12)',
    borderColor: 'hsla(190, 88%, 52%, 0.3)',
    desc: 'Test en ligne, kata ou exercice take-home'
  },
  final_interview: {
    id: 'final_interview',
    label: 'Entretien Final',
    icon: 'Users',
    color: 'hsl(240, 85%, 68%)',
    bgColor: 'hsla(240, 85%, 68%, 0.12)',
    borderColor: 'hsla(240, 85%, 68%, 0.3)',
    desc: 'Rencontre avec le Manager / CTO / Fondateurs'
  },
  offer: {
    id: 'offer',
    label: 'Offre Reçue !',
    icon: 'Trophy',
    color: 'hsl(154, 75%, 48%)',
    bgColor: 'hsla(154, 75%, 48%, 0.15)',
    borderColor: 'hsla(154, 75%, 48%, 0.4)',
    desc: 'Proposition formelle d’embauche reçue'
  },
  rejected: {
    id: 'rejected',
    label: 'Non retenu',
    icon: 'Archive',
    color: 'hsl(352, 60%, 55%)',
    bgColor: 'hsla(352, 60%, 55%, 0.1)',
    borderColor: 'hsla(352, 60%, 55%, 0.25)',
    desc: 'Candidature refusée ou archivée'
  }
};

export const STATUS_LIST = Object.values(STATUS_CONFIG);

export const REMOTE_TYPES = {
  full_remote: { label: 'Full Remote', icon: 'Home' },
  hybride: { label: 'Hybride', icon: 'Laptop' },
  sur_site: { label: 'Sur site', icon: 'Building' }
};

export function getDaysSince(dateStr) {
  if (!dateStr) return 0;
  const diffTime = Math.abs(new Date() - new Date(dateStr));
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(d);
}
