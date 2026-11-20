import React, { useState } from 'react';
import { ShieldAlert, X, ExternalLink, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 border-b border-shield-blue/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-shield-amber animate-pulse" />
          <span className="font-semibold text-shield-cyan uppercase tracking-wider text-[11px]">
            INDIAN UPI SAFETY DIRECTIVE:
          </span>
          <span className="text-slate-300">
            UPI PIN is strictly for <strong>DEBITING / SENDING</strong> money. You NEVER need to enter a PIN to receive payments or cashback.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1 text-shield-rose hover:text-rose-300 font-semibold transition-colors"
            title="National Cyber Fraud Helpline"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Cyber Helpline: 1930</span>
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-shield-blue hover:text-blue-300 transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors ml-1"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
