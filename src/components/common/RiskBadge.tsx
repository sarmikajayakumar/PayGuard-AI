import React from 'react';
import { RiskLevel } from '@/types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = false,
  className = '',
}) => {
  if (level === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        <span>HIGH RISK</span>
        {showScore && score !== undefined && (
          <span className="ml-1 px-1.5 py-0.2 bg-rose-500/20 rounded font-mono text-[11px]">
            {score}/100
          </span>
        )}
      </span>
    );
  }

  if (level === 'suspicious') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>SUSPICIOUS</span>
        {showScore && score !== undefined && (
          <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 rounded font-mono text-[11px]">
            {score}/100
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>LOW RISK</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-emerald-500/20 rounded font-mono text-[11px]">
          {score}/100
        </span>
      )}
    </span>
  );
};
