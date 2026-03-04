import { supabase } from './supabase';
import { Projet, Session, Transaction, SessionFile } from './types';

export const db = {
  projets: {
    async getAll(role: string, userId?: string) {
      let query = supabase.from('projets').select('*');
      if (role === 'Artiste' && userId) {
        query = query.eq('artist_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Projet[];
    },
    async create(projet: Omit<Projet, 'id' | 'created_at'>) {
      const { data, error } = await supabase.from('projets').insert(projet).select();
      if (error) throw error;
      return data[0] as Projet;
    }
  },
  sessions: {
    async getAll(role: string, userId?: string) {
      let query = supabase.from('sessions').select('*, projets(name)');
      if (role === 'Artiste' && userId) {
        query = query.eq('artist_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    async getById(id: string) {
      const { data, error } = await supabase.from('sessions').select('*, projets(name)').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(session: Omit<Session, 'id' | 'created_at'>) {
      const { data, error } = await supabase.from('sessions').insert(session).select();
      if (error) throw error;
      return data[0] as Session;
    },
    async updateNotes(id: string, notes: string) {
      const { data, error } = await supabase.from('sessions').update({ notes }).eq('id', id).select();
      if (error) throw error;
      return data[0] as Session;
    }
  },
  finances: {
    async getAll() {
      const { data, error } = await supabase.from('finances').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
      const { data, error } = await supabase.from('finances').insert(transaction).select();
      if (error) throw error;
      return data[0] as Transaction;
    }
  },
  files: {
    async upload(sessionId: string, file: File) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sessionId}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio_files')
        .getPublicUrl(filePath);

      const { data, error: dbError } = await supabase
        .from('session_files')
        .insert({
          session_id: sessionId,
          name: file.name,
          url: publicUrl,
        })
        .select();

      if (dbError) throw dbError;
      return data[0] as SessionFile;
    },
    async getBySession(sessionId: string) {
      const { data, error } = await supabase
        .from('session_files')
        .select('*')
        .eq('session_id', sessionId);
      
      if (error) throw error;
      return data as SessionFile[];
    }
  }
};
