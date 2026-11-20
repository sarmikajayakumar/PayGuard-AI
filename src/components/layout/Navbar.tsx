'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  PhoneCall,
  Menu,
  X,
  ExternalLink,
  Languages,
  CheckCircle2,
  FileSearch,
  ScanText,
  Bot,
  BookOpen,
  AlertOctagon,
  LayoutDashboard,
} from 'lucide-react';
import { SupportedLang } from '@/lib/translations';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';

interface NavbarProps {
  currentLang: SupportedLang;
  onLanguageChange: (lang: SupportedLang) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang: SupportedLang = currentLang === 'en' ? 'ta' : 'en';
    saveUserPreferences({ preferredLanguage: nextLang });
    onLanguageChange(nextLang);
  };

  const navLinks = [
    { href: '/', label: currentLang === 'ta' ? 'முகப்பு' : 'Dashboard', icon: LayoutDashboard },
    { href: '/scanner', label: currentLang === 'ta' ? 'செய்தி ஸ்கேனர்' : 'Message Scanner', icon: ScanText },
    { href: '/screenshot', label: currentLang === 'ta' ? 'திரைப்படம் சரிபார்ப்பு' : 'Screenshot OCR', icon: FileSearch },
    { href: '/assistant', label: currentLang === 'ta' ? 'AI உதவியாளர்' : 'AI Assistant', icon: Bot },
    { href: '/guide', label: currentLang === 'ta' ? 'பாதுகாப்பு வழிகாட்டி' : 'Safety Guide', icon: BookOpen },
    { href: '/report', label: currentLang === 'ta' ? 'மோசடி புகார்' : 'Report Fraud', icon: AlertOctagon },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  PAYGUARD<span className="text-blue-400">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  INDIA UPI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Pause. Verify. Pay safely.
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Quick Badges & Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Demo Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Deterministic Rule Engine</span>
          </div>

          {/* Language Selector */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs font-semibold text-slate-200 transition-all hover:border-slate-600"
            title="Toggle between English and தமிழ்"
          >
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentLang === 'en' ? 'தமிழ் (Tamil)' : 'English'}</span>
          </button>

          {/* Helpline 1930 Fast Dial */}
          <a
            href="tel:1930"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600/90 to-red-600 text-white text-xs font-bold shadow-lg shadow-rose-900/30 hover:brightness-110 transition-all"
            title="Immediate National Cyber Fraud Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>HEPLINE 1930</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-navy-800 border border-navy-700 text-xs font-semibold text-blue-400"
            title="Toggle Language"
          >
            {currentLang === 'en' ? 'தமிழ்' : 'EN'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-navy-800 border border-navy-700 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-950 px-4 pt-2 pb-6 space-y-2">
          <div className="py-2">
            <p className="text-[11px] text-slate-400 px-3 uppercase tracking-wider font-semibold mb-2">
              Navigation
            </p>
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-navy-800 flex flex-col gap-2">
            <a
              href="tel:1930"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-sm shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Cyber Helpline 1930</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-navy-800 text-slate-300 text-xs hover:text-white"
            >
              <span>National Cybercrime Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
