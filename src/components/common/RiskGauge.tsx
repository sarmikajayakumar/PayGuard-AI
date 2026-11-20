import React from 'react';
import { RiskLevel } from '@/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  const radius = size * 0.38;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc for gauge look
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'stroke-emerald-400 text-emerald-400';
  let glowColor = 'rgba(16, 185, 129, 0.2)';
  let levelLabel = 'LOW RISK';

  if (level === 'high') {
    colorClass = 'stroke-rose-500 text-rose-500';
    glowColor = 'rgba(244, 63, 94, 0.25)';
    levelLabel = 'HIGH RISK';
  } else if (level === 'suspicious') {
    colorClass = 'stroke-amber-400 text-amber-400';
    glowColor = 'rgba(245, 158, 11, 0.2)';
    levelLabel = 'SUSPICIOUS';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className="relative flex items-center justify-center rounded-full p-2 transition-all duration-500"
        style={{ width: size, height: size, boxShadow: `0 0 35px ${glowColor}` }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Indicator Value */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            fill="transparent"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight font-mono text-white">
            {score}
          </span>
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium mt-0.5">
            OUT OF 100
          </span>
          <span className={`text-xs font-bold mt-1 tracking-wider uppercase ${colorClass}`}>
            {levelLabel}
          </span>
        </div>
      </div>

      {/* Threshold Marks */}
      <div className="flex justify-between w-full max-w-[220px] text-[11px] text-slate-400 mt-2 px-1">
        <span className="text-emerald-400">0-29 Low</span>
        <span className="text-amber-400">30-59 Suspect</span>
        <span className="text-rose-400">60-100 High</span>
      </div>
    </div>
  );
};
