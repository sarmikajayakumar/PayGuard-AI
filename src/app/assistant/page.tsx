'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Languages,
  Sparkles,
  Shield,
  PhoneCall,
  RotateCcw,
  User,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AssistantMessage } from '@/types';
import { useToast } from '@/components/common/Toast';

export default function AssistantPage() {
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoFallback, setIsDemoFallback] = useState(true);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      language: 'en',
      timestamp: new Date().toISOString(),
      content: `Hello! I am your **PAYGUARD AI Safety Assistant**. 

I provide real-time guidance on Indian UPI scams, fake collect requests, phishing SMS, and cyber fraud reporting.

🔒 **Safety Rules I Follow**:
- I will **NEVER** ask for your UPI PIN, OTP, passwords, or CVV.
- I cannot block transactions or access your bank.
- If money was lost, call **1930** immediately.

How can I help protect your payments today?`,
    },
  ]);

  const PROMPT_SUGGESTIONS = {
    en: [
      'Someone sent a QR code to receive ₹2,500 cashback. Is it safe?',
      'I accidentally shared my OTP with a caller. What should I do now?',
      'What is a UPI Collect request scam on OLX?',
      'How does the 1930 National Cyber Fraud Helpline freeze money?',
      'Why is installing AnyDesk or QuickSupport dangerous?',
    ],
    ta: [
      'பணம் பெற QR குறியீட்டை ஸ்கேன் செய்யச் சொல்கிறார்கள், இது பாதுகாப்பானதா?',
      'தவறுதலாக ஒருவருக்கு OTP கொடுத்துவிட்டேன். இப்போது நான் என்ன செய்ய வேண்டும்?',
      'UPI Collect Request மோசடி என்றால் என்ன?',
      '1930 உதவி எண் எவ்வாறு மோசடி பணத்தை முடக்குகிறது?',
      'AnyDesk அல்லது TeamViewer செயலிகளை நிறுவச் சொல்வது ஏன் ஆபத்தானது?',
    ],
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || loading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      language,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          language,
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setIsDemoFallback(data.isFallback);

      const assistantMessage: AssistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        language,
        timestamp: new Date().toISOString(),
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('API route failed, using client fallback:', err);
      setIsDemoFallback(true);

      const fallbackText =
        language === 'ta'
          ? `🛡️ **PAYGUARD AI பாதுகாப்பு வழிகாட்டுதல்**:

1. **முக்கிய தங்க விதி**: UPI-யில் பணம் பெற PIN எண்ணை உள்ளிடவோ QR குறியீட்டை ஸ்கேன் செய்யவோ தேவையில்லை!
2. **அவசர உதவி**: நிதி இழப்பு ஏற்பட்டால் உடனடியாக **1930** உதவி எண்ணை அழைக்கவும் அல்லது **cybercrime.gov.in** தளத்தில் புகார் அளிக்கவும்.
3. **வங்கி தொடர்பு**: உங்கள் வங்கியின் அதிகாரப்பூர்வ உதவி எண்ணை அழைத்து கணக்கை உடனடியாக முடக்கவும்.`
          : `🛡️ **PAYGUARD AI Instant Cybersecurity Guidance**:

1. **Golden Rule**: You NEVER need to enter your UPI PIN or scan a QR code to receive money. UPI PIN is exclusively for DEBITING funds.
2. **Emergency**: If money was fraudulently debited, immediately dial **1930** within 2 hours to trigger inter-bank freezing.
3. **Official Reporting**: File your complaint at **https://cybercrime.gov.in/** with transaction UTR numbers.`;

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          language,
          timestamp: new Date().toISOString(),
          isFallback: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        language,
        timestamp: new Date().toISOString(),
        content:
          language === 'ta'
            ? 'வணக்கம்! நான் உங்கள் பேகார்டு AI பாதுகாப்பு உதவியாளர். UPI மோசடிகள், போலி கட்டணக் கோரிக்கைகள் குறித்து நீங்கள் எதை வேண்டுமானாலும் கேட்கலாம்.'
            : 'Chat reset. How can I assist you with digital payment and UPI security?',
      },
    ]);
    showToast('Chat Reset', 'Conversation history cleared.', 'info');
  };

  const handleSwitchLanguage = (newLang: 'en' | 'ta') => {
    setLanguage(newLang);
    showToast('Language Changed', newLang === 'ta' ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது' : 'Switched to English', 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Bot className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">AI Safety Assistant</h1>
          </div>
          <p className="text-xs text-slate-400">
            Interactive financial cybersecurity counsel in English & தமிழ் (Tamil)
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector toggle */}
          <div className="flex rounded-lg bg-navy-900 border border-navy-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => handleSwitchLanguage('en')}
              className={`px-3 py-1 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleSwitchLanguage('ta')}
              className={`px-3 py-1 rounded-md transition-all ${
                language === 'ta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-200"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Engine Status Pill */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-navy-900/60 border border-navy-800 text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span>
            {isDemoFallback ? 'Offline Deterministic Cyber Knowledge Engine' : 'Connected to Gemini API 1.5 Flash'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Zero Credential Storage
        </span>
      </div>

      {/* Chat Messages Scrollable Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-navy-900/50 border border-navy-800/80 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-violet-600/20 border border-violet-500/40 text-violet-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20'
                  : 'bg-navy-900 border border-navy-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              {msg.isFallback && (
                <div className="mt-2 pt-2 border-t border-navy-800/60 flex items-center gap-1 text-[10px] text-slate-400">
                  <Info className="w-3 h-3 text-cyan-400" />
                  <span>Verified Deterministic Knowledge Engine</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-3 bg-navy-900 border border-navy-800 text-slate-400 text-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Formulating safety response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-1.5 shrink-0">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Suggested Questions ({language === 'ta' ? 'பரிந்துரைகள்' : 'Quick Prompt'}):
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PROMPT_SUGGESTIONS[language].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 border border-navy-800 hover:border-violet-500/40 text-slate-300 shrink-0 transition-all text-left"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={
            language === 'ta'
              ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...'
              : 'Ask a question about UPI safety, suspicious calls, OTPs...'
          }
          className="flex-1 rounded-xl bg-navy-900 border border-navy-800 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-violet-600/30 transition-all"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
