"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Save, Loader2, Camera, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingMsg, setSavingMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // États de l'utilisateur
  const [isArtiste, setIsArtiste] = useState(false);
  const [artisteId, setArtisteId] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      setEmail(session.user.email || '');

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();
      
      if (artiste) {
        setIsArtiste(true);
        setArtisteId(artiste.id);
        setNom(artiste.nom);
        setTelephone(artiste.telephone || '');
        setAvatarUrl(artiste.avatar_url || '');
      }
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg(null);
    
    try {
      if (isArtiste) {
        const { error } = await supabase.from('artistes').update({
          nom,
          telephone
        }).eq('id', artisteId);
        if (error) throw error;
      }
      
      if (newPassword) {
        const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
        if (authError) throw authError;
        setNewPassword(''); // On vide le champ après succès
      }

      setSavingMsg({ text: 'Profil mis à jour avec succès !', type: 'success' });
      setTimeout(() => setSavingMsg(null), 3000);
    } catch (error: any) {
      setSavingMsg({ text: error.message, type: 'error' });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isArtiste) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setSavingMsg(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profil_${artisteId}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.from('artistes').update({ avatar_url: publicUrl }).eq('id', artisteId);
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSavingMsg({ text: 'Photo de profil mise à jour !', type: 'success' });
      setTimeout(() => setSavingMsg(null), 3000);
    } catch (error: any) {
      setSavingMsg({ text: "Erreur lors de l'upload.", type: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">Mon Profil</h1>
        <p className="mt-2 text-gray-400 font-bold">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      {savingMsg && (
        <div className={`mb-6 p-4 rounded-lg font-bold border ${savingMsg.type === 'success' ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
          {savingMsg.text}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* COLONNE GAUCHE : PHOTO DE PROFIL (Seulement pour les artistes) */}
        {isArtiste && (
          <div className="md:col-span-1">
            <div className="rounded-xl border border-gray-800 bg-black/50 p-6 flex flex-col items-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-900 group transition-colors hover:border-[#4ade80]/50 mb-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <User size={48} className="text-gray-600" />
                )}
                
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/70 opacity-0 transition-opacity hover:opacity-100">
                  {uploadingAvatar ? <Loader2 size={32} className="animate-spin text-[#4ade80]" /> : <Camera size={32} className="text-[#4ade80]" />}
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                </label>
              </div>
              <p className="text-sm text-gray-400 font-bold text-center">Cliquez sur l'image pour la modifier.</p>
            </div>
          </div>
        )}

        {/* COLONNE DROITE : FORMULAIRE */}
        <div className={`md:col-span-${isArtiste ? '2' : '3'}`}>
          <form onSubmit={handleUpdateProfile} className="space-y-6 rounded-xl border border-gray-800 bg-black/50 p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-2"><User className="text-[#4ade80]" size={20}/> Informations</h2>
              
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-400">Adresse Email (Fixe)</label>
                <input type="email" value={email} disabled className="w-full rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2 text-gray-500 font-bold cursor-not-allowed" />
              </div>

              {isArtiste && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-400">Nom d'artiste</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] transition-colors" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-gray-400">Numéro de téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-full rounded-lg border border-gray-700 bg-black/50 py-2 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-[#4ade80] transition-colors" placeholder="06 12 34 56 78" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-2"><Lock className="text-[#4ade80]" size={20}/> Sécurité</h2>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-400">Nouveau mot de passe</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Laissez vide pour ne pas changer" minLength={6} className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-white font-bold focus:outline-none focus:border-[#4ade80] transition-colors" />
              </div>
            </div>

            <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ade80] py-3 font-bold text-black hover:bg-[#4ade80]/90 transition-all hover:scale-[1.02]">
              <Save size={20} /> Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
