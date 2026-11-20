'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  QrCode,
  Smartphone,
  Eye,
  Lock,
} from 'lucide-react';

export default function SafetyGuidePage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'blueprints' | 'checklist'>('rules');

  const SCAM_BLUEPRINTS = [
    {
      title: 'The Fake QR Code & Cashback Trap',
      category: 'Deceptive Receiving',
      severity: 'Extremely Common',
      howItWorks:
        'Victim receives a message on WhatsApp or Telegram offering ₹1,000 to ₹5,000 festival cashback or lottery bonus. Scammer sends a QR code and insists: "Scan this code and enter your PIN to approve receiving the reward into your bank."',
      theTrap:
        'Scanning a QR code ALWAYS initiates an outward payment. Entering your UPI PIN authorizes a transfer FROM your account to the fraudster\'s account.',
      ruleToRemember:
        'Golden Rule: You NEVER scan a QR code or enter a UPI PIN to receive money. PIN is exclusively for DEBITING funds.',
    },
    {
      title: 'The Deceptive Marketplace Collect Request (OLX / Quikr)',
      category: 'Marketplace Fraud',
      severity: 'High Volume',
      howItWorks:
        'Scammer poses as a buyer (often pretending to be an Army Officer, CRPF jawan, or urgent relocator). They agree to buy your listed furniture or gadget without bargaining and claim they have paid via UPI.',
      theTrap:
        'Instead of sending funds, they send a "Collect Request" via Google Pay, PhonePe, or Paytm and tell you: "Click Pay and enter your PIN to accept my payment."',
      ruleToRemember:
        'A Collect Request takes money OUT of your wallet or bank. Never tap "Pay" or "Approve" when someone promises to pay you.',
    },
    {
      title: 'Remote-Access Tool Hijacking (AnyDesk / QuickSupport)',
      category: 'Screen Sharing Takeover',
      severity: 'Critical / Devastating',
      howItWorks:
        'Caller claims to be from electricity board (warning power cutoff), bank KYC desk, or telecom operator. They ask you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport to "resolve a technical glitch".',
      theTrap:
        'Once installed, the scammer views your mobile screen live. When you open your banking app or receive SMS OTPs, they see every secret code and drain your account.',
      ruleToRemember:
        'NO legitimate bank or utility officer will ever ask you to install screen-sharing software. Terminate the call immediately.',
    },
    {
      title: 'The Fake Payment Screenshot (Merchant Spoof APK)',
      category: 'Counterfeit Proof',
      severity: 'In-Store Scam',
      howItWorks:
        'A buyer at a shop purchases items and shows a phone screen displaying "Paid ₹3,500 Successfully to Merchant" with a green checkmark.',
      theTrap:
        'The buyer used a spoof app like "Spoof Paytm" that generates dummy success screens with fake animations and sound effects without actually transferring money.',
      ruleToRemember:
        'Always check your own bank account SMS, official merchant dashboard, or listen for the merchant soundbox before handing over merchandise.',
    },
    {
      title: 'Urgent Electricity / SIM Card Disconnection Scare',
      category: 'Psychological Panic',
      severity: 'High Success Rate',
      howItWorks:
        'SMS arrives: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately at 98XXXXXX."',
      theTrap:
        'The victim panics, calls the private mobile number, and is instructed to pay ₹10 or install an APK file. This gives scammers access to net banking credentials.',
      ruleToRemember:
        'Electricity boards send official SMS from government header codes (e.g. TNEB, BESCOM, MSEDCL), never from private 10-digit mobile numbers.',
    },
  ];

  const CHECKLIST_QUESTIONS = [
    {
      question: 'Are you being asked to enter your 4-digit or 6-digit UPI PIN to "receive" funds?',
      dangerIfYes: '100% SCAM. You only type your PIN when SENDING money, never when receiving.',
    },
    {
      question: 'Did the sender promise prizes, lottery winnings, or cashback you did not apply for?',
      dangerIfYes: 'Classic phishing bait. Legitimate cashback credits automatically without PINs.',
    },
    {
      question: 'Is there extreme urgency ("within 2 hours", "tonight 9 PM", "account blocked today")?',
      dangerIfYes: 'Artificial urgency forces rushed decisions. Legitimate banks give formal notice.',
    },
    {
      question: 'Does the link contain a URL shortener like bit.ly, tinyurl, or suspicious .xyz domains?',
      dangerIfYes: 'Phishing trap designed to harvest credentials or install spyware.',
    },
    {
      question: 'Is someone on the phone telling you to download AnyDesk, TeamViewer, or QuickSupport?',
      dangerIfYes: 'Remote hijacking attempt. Disconnect and uninstall immediately.',
    },
    {
      question: 'Are you relying solely on a screenshot shown by a buyer on their mobile phone?',
      dangerIfYes: 'Never trust external screens. Check your own bank SMS or UPI soundbox.',
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">UPI Safety Guide</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Comprehensive cybersecurity manual designed to protect everyday Indian digital payment users 
          from sophisticated phishing, social engineering, and fraudulent collect traps.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-800 gap-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>The Golden Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('blueprints')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'blueprints'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Scam Blueprints</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'checklist'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>7-Second Pause Checklist</span>
        </button>
      </div>

      {/* TAB 1: Golden Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-sm font-bold text-white">UPI PIN is ONLY for Debiting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Whenever you enter your UPI PIN, money leaves your bank account. No technology exists in UPI where entering your PIN credits money into your account.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-sm font-bold text-white">QR Code = Outward Transfer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A QR code is simply a visual representation of someone&apos;s UPI ID. Scanning a QR code received over WhatsApp or email is paying someone, never receiving funds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-sm font-bold text-white">Verify Name Before Confirming</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Before entering your PIN, your UPI app displays the registered bank account name of the recipient. Always cross-check this name with the person you intend to pay.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-navy-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Recommended Account Architecture for UPI Safety:</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Keep a Secondary Account for Daily UPI:</strong> Link your UPI app to a secondary bank account with a modest balance (e.g. ₹5,000 to ₹10,000) rather than your primary life savings account.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Set Daily UPI Transaction Limits:</strong> Most banks allow you to set daily UPI spending limits (e.g. ₹10,000 per day) through internet banking to minimize exposure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <strong>Never Use Easy PINs:</strong> Avoid birth years (1998), sequential numbers (1234, 1111), or ATM PINs as your UPI MPIN.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: Scam Blueprints */}
      {activeTab === 'blueprints' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {SCAM_BLUEPRINTS.map((scam, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-800 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {scam.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{scam.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 w-fit">
                  {scam.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">
                    The Pretext (How it works):
                  </span>
                  <p className="leading-relaxed text-slate-300">{scam.howItWorks}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-rose-400 uppercase text-[10px]">
                    The Hidden Trap:
                  </span>
                  <p className="leading-relaxed text-slate-300">{scam.theTrap}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800/80 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Defense:</strong> {scam.ruleToRemember}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 7-Second Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <h3 className="text-sm font-bold text-white">The 7-Second Pre-Payment Sanity Check</h3>
            <p className="text-xs text-slate-400">
              Before you tap &quot;Proceed to Pay&quot; or type your PIN, ask yourself these 6 questions. 
              If the answer to any question is YES, pause immediately.
            </p>
          </div>

          <div className="space-y-2.5">
            {CHECKLIST_QUESTIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-navy-900/90 border border-navy-800 space-y-2 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-navy-800 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-slate-200">{item.question}</p>
                </div>
                <div className="ml-8 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{item.dangerIfYes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>Scan Suspicious Message in Scanner</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
