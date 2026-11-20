'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ScanText,
  FileSearch,
  Bot,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Clock,
  History,
  Trash2,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RiskBadge } from '@/components/common/RiskBadge';
import { SAMPLE_SCENARIOS } from '@/lib/sampleScenarios';
import { getSavedHistory, clearAllHistory, deleteHistoryItem } from '@/lib/storage';
import { RiskAnalysisResult } from '@/types';
import { useToast } from '@/components/common/Toast';

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [history, setHistory] = useState<RiskAnalysisResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    setHistory(getSavedHistory());
    setLoadingHistory(false);
  }, []);

  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
    showToast('Analysis History Cleared', 'All local scan records have been removed.', 'info');
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Record Deleted', 'Scan item removed from your history.', 'info');
  };

  const handleLoadScenarioAndScan = (scenarioId: string) => {
    router.push(`/scanner?scenario=${scenarioId}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Threat Status Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 border border-navy-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Active Digital Payment Defense for Indian UPI Users
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Pause. Verify. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Pay Safely.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Every second in India, scammers exploit UPI unfamiliarity through fake collect requests, phishing SMS, and deceptive QR codes. 
            PAYGUARD AI gives you instant, deterministic risk verification before you authorize any transfer.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <ScanText className="w-4 h-4" />
              <span>Scan Suspicious Message</span>
            </Link>

            <Link
              href="/screenshot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-200 font-semibold text-xs tracking-wide transition-all hover:border-slate-500"
            >
              <FileSearch className="w-4 h-4 text-cyan-400" />
              <span>Verify Payment Screenshot</span>
            </Link>

            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/40 text-violet-300 font-semibold text-xs tracking-wide transition-all"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              <span>AI Assistant (EN & தமிழ்)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Telemetry & Statistics (Indian Cyber Fraud Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Golden Hour Window</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">2 Hours</p>
          <p className="text-[11px] text-slate-400">
            Window to dial <strong>1930</strong> for inter-bank transaction freezing via CFCFRMS.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Top Scam Vector</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">68%</p>
          <p className="text-[11px] text-slate-400">
            Involve fake collect requests or scanning QR codes to &quot;receive&quot; money.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Detection Latency</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">&lt; 150 ms</p>
          <p className="text-[11px] text-slate-400">
            Pure deterministic rules evaluate threats on-device with zero network latency.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-navy-900/80 border border-navy-800 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Official Portal</span>
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-blue-400 font-mono truncate">cybercrime.gov.in</p>
          <p className="text-[11px] text-slate-400">
            Central repository for lodging formal FIRs with state cyber police cells.
          </p>
        </div>
      </div>

      {/* Main Grid: Quick Scenarios + The Golden Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Demo Scenarios (Interactive Testbed) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Interactive Demo Scenarios
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click any card to analyze instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_SCENARIOS.slice(0, 4).map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => handleLoadScenarioAndScan(scenario.id)}
                className="group cursor-pointer p-4 rounded-xl bg-navy-900/90 border border-navy-800 hover:border-blue-500/50 hover:bg-navy-850 transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {scenario.categoryLabel}
                    </span>
                    <RiskBadge level={scenario.expectedRisk} />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {scenario.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {scenario.preview}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-navy-800/80 text-[11px] text-slate-400 group-hover:text-blue-400">
                  <span className="truncate max-w-[150px]">{scenario.sender}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-xs">
                    Test Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legitimate Scenario Card */}
          <div
            onClick={() => handleLoadScenarioAndScan('scenario-legitimate-bank')}
            className="group cursor-pointer p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-navy-900 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  AUTHENTIC BENCHMARK
                </span>
                <RiskBadge level="low" />
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300">
                Legitimate Bank Transaction Debit SMS (ICICI Bank)
              </h3>
              <p className="text-[11px] text-slate-400 max-w-xl">
                Verify that PAYGUARD AI does not trigger false positives on legitimate debit/credit notifications.
              </p>
            </div>
            <button className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold group-hover:bg-emerald-500/25 transition-all">
              Test Authentic SMS
            </button>
          </div>
        </div>

        {/* The Golden Rule of UPI Sidebar Widget */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>The UPI Golden Rules</span>
          </h2>

          <div className="p-4 rounded-xl bg-navy-900/90 border border-navy-800 space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 font-bold font-mono">
                1
              </div>
              <div>
                <p className="font-bold text-slate-200">PIN = DEBIT ONLY</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Entering your 4 or 6-digit UPI PIN ALWAYS transfers money OUT of your account. You NEVER enter a PIN to receive funds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono">
                2
              </div>
              <div>
                <p className="font-bold text-slate-200">Never Scan QR to Get Money</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  A QR code is an address to SEND money. Scanning a QR code received on WhatsApp is a classic trap.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-bold font-mono">
                3
              </div>
              <div>
                <p className="font-bold text-slate-200">Reject Screen-Sharing Apps</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Never install AnyDesk, TeamViewer, or QuickSupport on the instruction of anyone claiming to be customer care.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-navy-800">
              <Link
                href="/guide"
                className="flex items-center justify-between text-[11px] font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Read Complete UPI Safety Handbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Helpline Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 to-navy-900 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" /> 1930 Emergency Dials
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded">
                24x7 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Suspect an unauthorized debit? Report immediately to invoke the Citizen Financial Cyber Fraud Reporting System.
            </p>
            <a
              href="tel:1930"
              className="block text-center py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-900/30"
            >
              Dial 1930 Now
            </a>
          </div>
        </div>
      </div>

      {/* Recent Analysis History Section */}
      <div className="space-y-4 pt-4 border-t border-navy-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Recent Verification History
            </h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 rounded-xl bg-navy-900/40 border border-navy-800/80 text-center space-y-2">
            <Shield className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">No Analysis History Yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Scans performed via the Message Scanner or Screenshot OCR will appear here on your device.
            </p>
            <Link
              href="/scanner"
              className="inline-block mt-2 text-xs font-semibold text-blue-400 hover:underline"
            >
              Run Your First Scan →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-navy-900/70 border border-navy-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <RiskBadge level={item.level} score={item.score} showScore />
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.rawText || item.summary}
                  </p>
                </div>
                <div className="pt-2 border-t border-navy-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="font-mono uppercase">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
