'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ScanText,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Languages,
  Copy,
  Info,
  ChevronDown,
} from 'lucide-react';
import { RiskBadge } from '@/components/common/RiskBadge';
import { RiskGauge } from '@/components/common/RiskGauge';
import { SAMPLE_SCENARIOS } from '@/lib/sampleScenarios';
import { analyzeMessageRisk } from '@/lib/riskEngine';
import { saveAnalysisResult } from '@/lib/storage';
import { RiskAnalysisResult } from '@/types';
import { useToast } from '@/components/common/Toast';

function ScannerContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult | null>(null);
  const [activeLang, setActiveLang] = useState<'en' | 'ta'>('en');

  // Handle URL query scenario preload
  useEffect(() => {
    const scenarioId = searchParams.get('scenario');
    if (scenarioId) {
      const found = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId);
      if (found) {
        setInputText(found.content);
        // Automatically analyze
        performAnalysis(found.content);
        showToast('Sample Scenario Loaded', `Loaded: ${found.title}`, 'info');
      }
    }
  }, [searchParams]);

  const performAnalysis = async (textToScan: string) => {
    if (!textToScan.trim()) {
      showToast('Empty Input', 'Please paste a message or select a sample scenario.', 'error');
      return;
    }

    setAnalyzing(true);

    try {
      // Call the server API route
      const response = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToScan, source: 'scanner' }),
      });

      let resData: RiskAnalysisResult;
      if (response.ok) {
        resData = await response.json();
      } else {
        // Fallback to local client-side risk engine if API fails
        resData = analyzeMessageRisk(textToScan, 'scanner');
      }

      setResult(resData);
      saveAnalysisResult(resData);
      showToast('Analysis Complete', `Risk evaluation: ${resData.score}/100 (${resData.level.toUpperCase()})`, 'success');
    } catch {
      // Offline fallback
      const fallbackResult = analyzeMessageRisk(textToScan, 'scanner');
      setResult(fallbackResult);
      saveAnalysisResult(fallbackResult);
      showToast('Offline Analysis Performed', 'Analyzed using local deterministic rules.', 'info');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectScenario = (content: string, title: string) => {
    setInputText(content);
    performAnalysis(content);
    showToast('Loaded Scenario', title, 'info');
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    showToast('Cleared', 'Scanner input reset.', 'info');
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const textToCopy = `PAYGUARD AI Risk Report:\nScore: ${result.score}/100 (${result.level.toUpperCase()})\nTitle: ${result.title}\nSummary: ${result.summary}\nDetected Indicators: ${result.indicators.map((i) => i.name).join(', ') || 'None'}`;
    navigator.clipboard.writeText(textToCopy);
    showToast('Copied to Clipboard', 'Analysis summary copied.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ScanText className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scam Message Scanner</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Paste any suspicious SMS, WhatsApp forward, Olx chat, or payment instruction. 
          Our deterministic engine checks for UPI PIN demands, fake cashback traps, phishing URLs, and remote access apps.
        </p>
      </div>

      {/* Preset Scenario Quick Selectors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Realistic Pre-tested Demo Scenarios:</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">1-click automated test</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario.content, scenario.title)}
              className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-700/80 hover:border-blue-500/50 text-slate-300 font-medium transition-all flex items-center gap-1.5"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  scenario.expectedRisk === 'high'
                    ? 'bg-rose-500'
                    : scenario.expectedRisk === 'suspicious'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Card */}
      <div className="rounded-2xl bg-navy-900/90 border border-navy-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label htmlFor="message-input" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>Message Content / Payment Note</span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">
              (SMS, WhatsApp, payment instruction)
            </span>
          </label>
          {inputText && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <textarea
          id="message-input"
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. '🎉 Congratulations! You have won ₹2,500 Diwali cashback from PhonePe. Scan this QR code and enter your UPI PIN to approve credit transfer...'"
          className="w-full rounded-xl bg-navy-950 border border-navy-700/80 p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono leading-relaxed resize-y"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Pure client/server validation. We never save or transmit PINs or OTPs.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => performAnalysis(inputText)}
              disabled={analyzing || !inputText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Patterns...</span>
                </>
              ) : (
                <>
                  <ScanText className="w-4 h-4" />
                  <span>Analyze Message Risk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Main Risk Summary Card */}
          <div
            className={`rounded-2xl border p-6 space-y-6 ${
              result.level === 'high'
                ? 'bg-gradient-to-br from-rose-950/40 via-navy-900 to-navy-950 border-rose-500/40'
                : result.level === 'suspicious'
                ? 'bg-gradient-to-br from-amber-950/40 via-navy-900 to-navy-950 border-amber-500/40'
                : 'bg-gradient-to-br from-emerald-950/40 via-navy-900 to-navy-950 border-emerald-500/40'
            }`}
          >
            {/* Top row: Title + Badges + Language Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RiskBadge level={result.level} score={result.score} showScore />
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {result.id.slice(0, 14)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {result.title}
                </h2>
              </div>

              {/* Actions & Language Switch */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLang(activeLang === 'en' ? 'ta' : 'en')}
                  className="px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700 text-xs font-semibold text-blue-400 hover:border-slate-500 flex items-center gap-1.5 transition-all"
                  title="Switch between English and தமிழ் explanation"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{activeLang === 'en' ? 'தமிழ் விளக்கம்' : 'English'}</span>
                </button>
                <button
                  onClick={handleCopyAnalysis}
                  className="p-1.5 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 hover:text-white"
                  title="Copy analysis summary"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle row: Gauge + Narrative Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex justify-center md:border-r md:border-navy-800 md:pr-6">
                <RiskGauge score={result.score} level={result.level} size={190} />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Security Assessment Summary:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {activeLang === 'ta' ? result.tamilSummary : result.summary}
                  </p>
                </div>

                {result.aiExplanation && (
                  <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-700/40 text-xs text-violet-200 space-y-1">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Verification Insight
                    </span>
                    <p className="leading-relaxed">{result.aiExplanation}</p>
                  </div>
                )}

                {/* Evidence highlights */}
                {result.evidenceSnippets.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Flagged Message Snippets:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.evidenceSnippets.map((snippet, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-navy-800 border border-rose-500/30 text-rose-300 font-mono text-[11px]"
                        >
                          &quot;{snippet}&quot;
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Matched Indicators Breakdown */}
            <div className="space-y-3 pt-4 border-t border-navy-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Transparent Risk Factor Weights:
              </h3>
              {result.indicators.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No malicious indicators detected. The text does not match known phishing patterns.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.indicators.map((ind) => (
                    <div
                      key={ind.id}
                      className="p-3 rounded-xl bg-navy-900 border border-navy-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{ind.name}</span>
                        <span className="font-mono text-xs font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10">
                          +{ind.weight}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {activeLang === 'ta' && ind.tamilExplanation
                          ? ind.tamilExplanation
                          : ind.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Protective Actions */}
            <div className="space-y-2.5 pt-4 border-t border-navy-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Protective Actions:</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {(activeLang === 'ta' ? result.tamilActions : result.safeActions).map((act, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-navy-950/60 border border-navy-800">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confidence & Disclaimers */}
            <div className="pt-3 border-t border-navy-800/80 text-[10px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-400 uppercase tracking-wider">Limitations & Boundary Notice:</p>
              {result.limitations.map((lim, i) => (
                <p key={i}>• {lim}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading scanner...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
