'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  ExternalLink,
  Clock,
  ShieldAlert,
  Copy,
  CheckCircle2,
  FileText,
  Building2,
  Info,
  Lock,
} from 'lucide-react';
import { useToast } from '@/components/common/Toast';

export default function ReportFraudPage() {
  const { showToast } = useToast();

  // Incident organizer form states
  const [victimName, setVictimName] = useState('');
  const [bankName, setBankName] = useState('');
  const [debitedAccount, setDebitedAccount] = useState('');
  const [lostAmount, setLostAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [scammerContact, setScammerContact] = useState('');
  const [scamType, setScamType] = useState('UPI Collect / QR Code Fraud');
  const [incidentSummary, setIncidentSummary] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');

  const generateComplaintDraft = () => {
    if (!lostAmount || !utrNumber) {
      showToast('Missing Critical Fields', 'Please enter at least the amount lost and 12-digit UTR number.', 'error');
      return;
    }

    const draft = `FORMAL COMPLAINT OF DIGITAL FINANCIAL FRAUD
Date of Filing: ${new Date().toLocaleDateString('en-IN')}

INCIDENT DETAILS:
1. Complainant Name: ${victimName || '[Name of Account Holder]'}
2. Bank & Account: ${bankName || '[Bank Name]'} (A/c: ${debitedAccount || 'Masked'})
3. Amount Defrauded: INR ${lostAmount}
4. 12-Digit UPI Ref / UTR: ${utrNumber}
5. Date & Time of Incident: ${transactionDate || '[Date & Time]'}
6. Fraud Classification: ${scamType}
7. Suspect Contact / UPI ID: ${scammerContact || '[Suspect Phone / UPI ID]'}

BRIEF SYNOPSIS:
${
  incidentSummary ||
  `I was deceived into a fraudulent digital payment under the pretext of ${scamType}. The unauthorized transaction was completed via UPI without my legitimate consent, resulting in an illicit debit of INR ${lostAmount}.`
}

IMMEDIATE PRAYER:
1. I request the Cyber Police and concerned Nodal Bank Officers to kindly trigger CFCFRMS under helpline 1930 and freeze the beneficiary destination account.
2. Please issue an official NCRP Acknowledgment Number for insurance and banking grievance redressal.

Submitted in good faith.`;

    setGeneratedDraft(draft);
    showToast('Complaint Draft Generated', 'Ready to copy into cybercrime.gov.in or bank email.', 'success');
  };

  const copyToClipboard = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    showToast('Copied to Clipboard', 'Paste this draft directly into cybercrime.gov.in.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Report Cyber Fraud</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Official emergency protocol for Indian digital payment fraud. Follow this immediate roadmap to freeze stolen funds and lodge valid complaints.
        </p>
      </div>

      {/* Prominent Legal Boundary Disclaimer */}
      <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
          <Info className="w-4 h-4" />
          <span>Notice on Reporting Boundary:</span>
        </div>
        <p>
          PAYGUARD AI is an independent cybersecurity advisory assistant and <strong>DOES NOT</strong> directly submit reports to law enforcement, police stations, or banking gateways. You must dial <strong>1930</strong> and use the official Government of India portal at <strong>cybercrime.gov.in</strong>.
        </p>
      </div>

      {/* Emergency Action Hero: The 2-Hour Golden Window */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-950/70 via-navy-900 to-navy-950 border border-rose-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PRIORITY ZERO ACTION
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The 2-Hour Golden Window (Dial 1930)
            </h2>
          </div>
          <a
            href="tel:1930"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm tracking-wide shadow-lg shadow-rose-900/40 hover:scale-105 transition-all"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span>CALL 1930 NOW</span>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          The <strong>Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)</strong>, managed by the Indian Cyber Crime Coordination Centre (I4C), enables real-time inter-bank coordination. If you report an unauthorized transfer within 2 hours of the debit, participating Indian banks can immediately freeze the funds in the scammer&apos;s beneficiary account before they withdraw it at an ATM.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Step 1: Immediate Dial</span>
            <p className="text-white font-semibold">Call 1930 Helpline</p>
            <p className="text-[11px] text-slate-400">Toll-free, 24x7 pan-India emergency cyber police line.</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Step 2: Have UTR Ready</span>
            <p className="text-white font-semibold">Provide 12-digit UTR</p>
            <p className="text-[11px] text-slate-400">Found in bank SMS alert or UPI app transaction details.</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Step 3: Portal Registration</span>
            <p className="text-white font-semibold">Visit cybercrime.gov.in</p>
            <p className="text-[11px] text-slate-400">Upload evidence within 24 hours to secure official FIR slip.</p>
          </div>
        </div>
      </div>

      {/* Official Links & Bank Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl bg-navy-900 hover:bg-navy-850 border border-navy-800 hover:border-blue-500/50 transition-all flex items-start justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Official Government Portal
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white">National Cyber Crime Reporting Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register formal complaints for financial cyber fraud, online phishing, and social engineering.
            </p>
            <span className="text-xs text-blue-400 font-mono inline-block pt-1">
              https://cybercrime.gov.in →
            </span>
          </div>
        </a>

        <a
          href="https://sachet.rbi.org.in"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl bg-navy-900 hover:bg-navy-850 border border-navy-800 hover:border-blue-500/50 transition-all flex items-start justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Reserve Bank of India
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white">RBI Sachet & Ombudsman (CMS)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report illegal lending apps, unregistered financial entities, and lodge escalation complaints against unresponsive banks.
            </p>
            <span className="text-xs text-blue-400 font-mono inline-block pt-1">
              https://sachet.rbi.org.in →
            </span>
          </div>
        </a>
      </div>

      {/* Incident Information Organizer & Complaint Generator */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-6 space-y-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Incident Information Organizer
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Victims in panic often struggle to structure facts required by 1930 police officers and the national portal. 
            Fill in the details below to generate a pre-formatted complaint you can immediately copy-paste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Complainant Full Name
            </label>
            <input
              type="text"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Bank Name & Last 4 Digits
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India (A/c **4021)"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Amount Defrauded (INR) *
            </label>
            <input
              type="text"
              value={lostAmount}
              onChange={(e) => setLostAmount(e.target.value)}
              placeholder="e.g. 5,000"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              12-Digit UPI UTR / Reference ID *
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 432490128491"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs font-mono text-cyan-400 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Date & Exact Time of Transaction
            </label>
            <input
              type="text"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              placeholder="e.g. 20-Nov-2024, 02:15 PM"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Scammer Phone / UPI ID / Link
            </label>
            <input
              type="text"
              value={scammerContact}
              onChange={(e) => setScammerContact(e.target.value)}
              placeholder="e.g. +91 98210-XXXXX or fraudster@okaxis"
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              How did the fraud occur? (Brief summary)
            </label>
            <textarea
              rows={2}
              value={incidentSummary}
              onChange={(e) => setIncidentSummary(e.target.value)}
              placeholder="e.g. Received a call claiming my electricity bill was pending. Caller asked me to scan a QR code to avoid power disconnection, which transferred ₹5,000 from my account."
              className="w-full rounded-xl bg-navy-950 border border-navy-800 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={generateComplaintDraft}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-600/30 transition-all"
          >
            Generate Structured Complaint Text
          </button>
        </div>

        {/* Generated Output */}
        {generatedDraft && (
          <div className="space-y-3 pt-4 border-t border-navy-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Formatted Text for cybercrime.gov.in / Bank Nodal Officer:
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-cyan-400 border border-navy-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {generatedDraft}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
