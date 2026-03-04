export interface Profile {
  id: string;
  email: string;
  role: 'Admin' | 'Artiste';
}

export interface Projet {
  id: string;
  name: string;
  description?: string;
  artist_id: string;
  status: 'En cours' | 'Terminé' | 'En pause';
  created_at: string;
}

export interface Session {
  id: string;
  project_id: string;
  artist_id: string;
  date: string;
  notes?: string;
  status: 'Prévue' | 'Terminée' | 'Annulée';
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'Entrée' | 'Sortie';
  description: string;
  date: string;
  category: string;
  created_at: string;
}

export interface SessionFile {
  id: string;
  session_id: string;
  name: string;
  url: string;
  created_at: string;
}
