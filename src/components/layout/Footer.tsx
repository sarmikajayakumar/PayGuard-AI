import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink, PhoneCall, AlertTriangle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white tracking-wider">PAYGUARD AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              AI-powered digital payment fraud detection and prevention assistant designed primarily for Indian UPI users.
            </p>
            <p className="text-[10px] text-blue-400 font-medium">
              &quot;Pause. Verify. Pay safely.&quot;
            </p>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase">
              Official Indian Helplines
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="tel:1930"
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>National Cyber Crime: 1930</span>
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sachet.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <span>RBI Sachet Portal (Unregulated entities)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://cms.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  <span>RBI Ombudsman (CMS)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Tools */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase">
              Fraud Detection Tools
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/scanner" className="hover:text-blue-400 transition-colors">
                  SMS & WhatsApp Message Scanner
                </Link>
              </li>
              <li>
                <Link href="/screenshot" className="hover:text-blue-400 transition-colors">
                  Payment Screenshot Verification (OCR)
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-blue-400 transition-colors">
                  AI Safety Assistant (English & தமிழ்)
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-blue-400 transition-colors">
                  UPI Safety Handbook & Red Flags
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-blue-400 transition-colors">
                  Golden Hour Incident Organizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal Boundary */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs tracking-wider uppercase">
              Privacy & Legal Notice
            </h4>
            <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-800 text-[10px] space-y-1.5 text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>Advisory Boundary</span>
              </div>
              <p>
                PAYGUARD AI is an independent advisory decision-support tool. It does not file official police complaints, reverse transactions, or connect to your bank account.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} PAYGUARD AI. Built for the safety of India&apos;s digital payment ecosystem.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Deterministic Engine v1.0</span>
            <span className="text-slate-400">Zero Credential Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
