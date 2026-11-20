'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ToastProvider } from '../common/Toast';
import { SupportedLang } from '@/lib/translations';
import { getUserPreferences } from '@/lib/storage';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');

  useEffect(() => {
    const prefs = getUserPreferences();
    if (prefs.preferredLanguage) {
      setCurrentLang(prefs.preferredLanguage);
    }
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <DisclaimerBanner />
        <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar currentLang={currentLang} />
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
};
