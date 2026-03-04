"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { SessionFile } from '@/lib/types';
import { 
  Loader2, 
  Upload, 
  Play, 
  Download, 
  FileAudio, 
  Save, 
  ChevronLeft,
  Music
} from 'lucide-react';

export default function SessionDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [session, setSession] = useState<{
    id: string;
    notes?: string;
    date: string;
    status: string;
    projets?: { name: string };
  } | null>(null);
  const [files, setFiles] = useState<SessionFile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, filesData] = await Promise.all([
          db.sessions.getById(id),
          db.files.getBySession(id)
        ]);
        setSession(sessionData);
        setFiles(filesData);
        setNotes(sessionData.notes || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await db.sessions.updateNotes(id, notes);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const onDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const file = fileList[0];
      const newFile = await db.files.upload(id, file);
      setFiles([...files, newFile]);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload. Vérifiez que le bucket 'audio_files' existe.");
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  }, [id, handleUpload]);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-neon-green" size={48} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-neon-green transition-colors"
      >
        <ChevronLeft size={20} />
        Retour aux sessions
      </button>

      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Session <span className="neon-text">Détail</span>
          </h1>
          <p className="text-slate-400">
            {session?.projets?.name} · {session?.date ? new Date(session.date).toLocaleDateString() : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-sm font-bold border border-neon-green/20">
            {session?.status}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Save size={20} className="text-neon-green" />
              Notes de Session
            </h2>
            <button 
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="text-xs text-neon-green hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              Sauvegarder
            </button>
          </div>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Prenez vos notes ici..."
            className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green outline-none resize-none"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Music size={20} className="text-neon-green" />
            Fichiers Audio
          </h2>
          
          <div 
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            className={`relative h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer
              ${dragActive 
                ? 'border-neon-green bg-neon-green/10' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              accept="audio/*"
              className="hidden" 
              onChange={(e) => handleUpload(e.target.files)}
            />
            {uploading ? (
              <Loader2 className="animate-spin text-neon-green mb-2" size={32} />
            ) : (
              <Upload className="text-slate-400 mb-2" size={32} />
            )}
            <p className="text-sm font-medium text-slate-300">
              {uploading ? "Upload en cours..." : "Glissez vos fichiers audio ici"}
            </p>
            <p className="text-xs text-slate-500 mt-1">ou cliquez pour parcourir</p>
          </div>

          <div className="space-y-3 pt-4">
            {files.map((file) => (
              <div key={file.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-neon-green/30 transition-all">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
                    <FileAudio size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-neon-green transition-colors"
                  >
                    <Play size={18} />
                  </a>
                  <a 
                    href={file.url} 
                    download={file.name}
                    className="p-2 text-slate-400 hover:text-neon-green transition-colors"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
            {files.length === 0 && !uploading && (
              <div className="text-center py-10 text-slate-600 italic border border-white/5 rounded-xl">
                Aucun fichier uploadé.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
