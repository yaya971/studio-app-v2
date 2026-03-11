"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut, Loader2, Mail, Calendar, Edit, Phone, Camera, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProfilPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // États pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ nom: '', telephone: '' });

  useEffect(() => {
    async function getUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: artiste } = await supabase.from('artistes').select('*').eq('user_id', session.user.id).maybeSingle();

      if (artiste) { 
        setUserData({ ...artiste, email: session.user.email, role: 'Artiste' }); 
        setEditForm({ nom: artiste.nom || '', telephone: artiste.telephone || '' });
      } 
      else { 
        setUserData({ nom: 'Administrateur', email: session.user.email, role: 'Admin' }); 
      }
      
      setLoading(false);
    }
    getUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData || userData.role === 'Admin') return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `profil_${userData.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { error: updateError } = await supabase.from('artistes').update({ avatar_url: publicUrl }).eq('id', userData.id);
      if (updateError) throw updateError;
      
      setUserData({ ...userData, avatar_url: publicUrl });
    } catch (error: any) { 
      alert(t('prof.upload_err') + error.message); 
    } 
    finally { setUploading(false); }
  };

  const handleSaveProfile = async () => {
    if (userData.role === 'Admin') return;
    setSaving(true);
    
    const { error } = await supabase.from('artistes').update({
      nom: editForm.nom,
      telephone: editForm.telephone
    }).eq('id', userData.id);
    
    if (!error) {
      setUserData({ ...userData, nom: editForm.nom, telephone: editForm.telephone });
      setIsEditing(false);
    }
    setSaving(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#4ade80]" size={48} /></div>;

  const isArtiste = userData?.role === 'Artiste';

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('prof.title')}</h1>
          <p className="mt-2 text-gray-400 font-bold">{t('prof.subtitle')}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 font-bold text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20">
          <LogOut size={20} /> {t('prof.logout')}
        </button>
      </div>

      <div className="rounded-xl border border-gray-800 bg-black/50 p-8 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        {/* EN-TÊTE PROFIL & AVATAR */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-gray-800 pb-8 relative">
          
          {isArtiste && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#4ade80] transition-colors bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
              <Edit size={16} /> {t('prof.edit')}
            </button>
          )}

          <div className="relative group flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-900 border-2 border-gray-800 transition-colors hover:border-[#4ade80]/50 overflow-hidden">
            {userData?.avatar_url ? (
              <img src={userData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <UserCircle size={48} className="text-gray-600" />
            )}
            
            {isArtiste && (
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
                {uploading ? <Loader2 size={24} className="animate-spin text-[#4ade80]" /> : <Camera size={24} className="text-[#4ade80]" />}
                <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{userData?.nom}</h2>
            <span className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-bold text-gray-300 uppercase">{userData?.role}</span>
          </div>
        </div>

        {/* INFORMATIONS */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">{t('prof.info')}</h3>
          
          {userData ? (
            <div className="grid gap-6 sm:grid-cols-2">
              
              <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <UserCircle size={16} />
                  <span className="text-xs font-bold uppercase">{t('prof.name')}</span>
                </div>
                {isEditing ? (
                  <input type="text" value={editForm.nom} onChange={(e) => setEditForm({...editForm, nom: e.target.value})} className="w-full bg-black border border-[#4ade80] rounded px-3 py-1.5 text-white font-bold outline-none" />
                ) : (
                  <p className="font-bold text-white">{userData.nom}</p>
                )}
              </div>

              <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Phone size={16} />
                  <span className="text-xs font-bold uppercase">{t('prof.phone')}</span>
                </div>
                {isEditing ? (
                  <input type="tel" value={editForm.telephone} onChange={(e) => setEditForm({...editForm, telephone: e.target.value})} className="w-full bg-black border border-[#4ade80] rounded px-3 py-1.5 text-white font-bold outline-none" placeholder="06 12 34 56 78" />
                ) : (
                  <p className="font-bold text-white">{userData.telephone || '-'}</p>
                )}
              </div>

              <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-800 sm:col-span-2">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Mail size={16} />
                  <span className="text-xs font-bold uppercase">{t('prof.email')}</span>
                </div>
                <p className="font-bold text-gray-400">{userData.email} <span className="text-xs font-normal italic ml-2">(Non modifiable)</span></p>
              </div>

            </div>
          ) : (
            <p className="text-gray-500 font-bold">{t('prof.no_info')}</p>
          )}

          {/* BOUTONS D'ÉDITION */}
          {isEditing && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-800 pt-6">
              <button onClick={() => { setIsEditing(false); setEditForm({ nom: userData.nom, telephone: userData.telephone }); }} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <X size={18} /> {t('prof.cancel')}
              </button>
              <button onClick={handleSaveProfile} disabled={saving} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-black bg-[#4ade80] hover:bg-[#4ade80]/90 transition-all">
                {saving ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> {t('prof.save')}</>}
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
