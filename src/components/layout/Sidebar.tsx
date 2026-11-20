'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanText,
  FileSearch,
  Bot,
  BookOpen,
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { SupportedLang } from '@/lib/translations';

interface SidebarProps {
  currentLang: SupportedLang;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentLang }) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: currentLang === 'ta' ? 'கட்டுப்பாட்டு பலகை' : 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Overview',
    },
    {
      href: '/scanner',
      label: currentLang === 'ta' ? 'செய்தி ஸ்கேனர்' : 'Message Scanner',
      icon: ScanText,
      badge: 'Core',
    },
    {
      href: '/screenshot',
      label: currentLang === 'ta' ? 'திரைப்படம் சரிபார்ப்பு' : 'Screenshot OCR',
      icon: FileSearch,
      badge: 'OCR',
    },
    {
      href: '/assistant',
      label: currentLang === 'ta' ? 'AI பாதுகாப்பு உதவியாளர்' : 'AI Assistant',
      icon: Bot,
      badge: 'EN & தமிழ்',
    },
    {
      href: '/guide',
      label: currentLang === 'ta' ? 'பாதுகாப்பு வழிகாட்டி' : 'Safety Guide',
      icon: BookOpen,
      badge: 'Handbook',
    },
    {
      href: '/report',
      label: currentLang === 'ta' ? 'மோசடி புகார்' : 'Report Fraud',
      icon: AlertOctagon,
      badge: '1930 / Portal',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-navy-950/80 border-r border-navy-800 p-4 justify-between h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            SECURITY SUITE
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-navy-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Golden Hour Helpline Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-navy-900 to-navy-950 border border-navy-800 space-y-2.5 shadow-inner">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Cyber Fraud 1930</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Report UPI fraud within <strong>2 hours</strong> to enable automatic inter-bank fund freeze via CFCFRMS.
          </p>
          <a
            href="tel:1930"
            className="block text-center w-full py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
          >
            Dial 1930 Now
          </a>
        </div>
      </div>

      {/* Bottom Privacy & Trust Assurance */}
      <div className="p-3 rounded-xl bg-navy-900/60 border border-navy-800/80 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Credential Retention</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          We never collect OTPs, passwords, or full bank numbers. Local heuristics prioritize privacy.
        </p>
      </div>
    </aside>
  );
};
