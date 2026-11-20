export type RiskLevel = 'low' | 'suspicious' | 'high';

export type RiskCategory =
  | 'otp_pin'
  | 'pay_to_receive'
  | 'remote_access'
  | 'suspicious_url'
  | 'impersonation'
  | 'urgency'
  | 'fake_reward'
  | 'collect_request'
  | 'legitimate_pattern'
  | 'general';

export interface RiskIndicator {
  id: string;
  name: string;
  category: RiskCategory;
  weight: number;
  severity: 'low' | 'medium' | 'high';
  snippet?: string;
  explanation: string;
  tamilExplanation?: string;
}

export interface RiskAnalysisResult {
  id: string;
  timestamp: string;
  rawText: string;
  score: number;
  level: RiskLevel;
  title: string;
  summary: string;
  indicators: RiskIndicator[];
  evidenceSnippets: string[];
  safeActions: string[];
  limitations: string[];
  tamilSummary: string;
  tamilActions: string[];
  isDeterministic: boolean;
  aiExplanation?: string;
  source: 'scanner' | 'screenshot' | 'demo';
}

export interface ScreenshotAnalysisResult {
  id: string;
  timestamp: string;
  extractedText: string;
  paymentStatus: 'SUCCESS' | 'PROCESSING' | 'FAILED' | 'UNKNOWN';
  amount: string | null;
  utr: string | null;
  date: string | null;
  recipient: string | null;
  sender: string | null;
  riskScore: number;
  riskLevel: RiskLevel;
  anomalyWarnings: string[];
  verificationGuidance: string[];
  disclaimer: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: 'en' | 'ta';
  timestamp: string;
  suggestedActions?: string[];
  isFallback?: boolean;
}

export interface SampleScenario {
  id: string;
  title: string;
  type: 'reward_qr' | 'bank_kyc' | 'collect_request' | 'fake_screenshot' | 'legitimate_payment';
  categoryLabel: string;
  sender: string;
  preview: string;
  content: string;
  expectedRisk: RiskLevel;
  description: string;
  screenshotUrl?: string;
}

export interface SafetyStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description: string;
}
