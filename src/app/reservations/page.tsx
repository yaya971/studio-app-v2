"use client";

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ReservationsPage() {
  const { t } = useLanguage();
  
  // 🚨 REMPLACE CE LIEN PAR L'URL DE TA PAGE DE RÉSERVATION SETMORE 🚨
  const SETMORE_URL = "https://lacavelyon.setmore.com/";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-screen flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">{t('res.title')}</h1>
        <p className="mt-2 text-gray-400 font-bold">{t('res.subtitle')}</p>
      </div>
      
      {/* Le conteneur qui affiche ton Setmore */}
      <div className="flex-1 w-full rounded-xl border border-gray-800 bg-white overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] relative">
        <iframe 
          src={SETMORE_URL} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          className="w-full h-full absolute inset-0"
          title="Réservation Studio Setmore"
        />
      </div>
    </div>
  );
}
