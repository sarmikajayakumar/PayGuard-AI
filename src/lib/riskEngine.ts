import { RiskAnalysisResult, RiskIndicator, RiskLevel } from '@/types';

// Rule definition for the deterministic detection engine
interface RuleDefinition {
  id: string;
  name: string;
  category: RiskIndicator['category'];
  weight: number;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  tamilExplanation: string;
  // Match function that returns matching snippet or null
  matcher: (text: string) => string | null;
}

const DETECTION_RULES: RuleDefinition[] = [
  // 1. Requests for OTP / UPI PIN (+35)
  {
    id: 'req_otp_pin',
    name: 'Request for OTP / UPI PIN',
    category: 'otp_pin',
    weight: 35,
    severity: 'high',
    explanation: 'Requests to share your UPI PIN, OTP, or secret passcode. Legitimate banks and callers NEVER request your PIN or OTP.',
    tamilExplanation: 'உங்கள் UPI பின் அல்லது OTP-ஐ பகிருமாறு கேட்கிறது. உண்மையான வங்கிகள் ஒருபோதும் பின் அல்லது OTP-ஐ கேட்காது.',
    matcher: (text: string) => {
      const patterns = [
        /(?:enter|share|send|provide|type|give)\s+(?:your\s+)?(?:upi\s+pin|mpin|pin|otp|one\s*time\s*password|secret\s*code)/i,
        /(?:upi\s+pin|mpin|otp)\s+(?:to\s+(?:receive|claim|verify|accept|credit|unlock))/i,
        /(?:பின்|otp)\s*(?:பகிரவும்|உள்ளிடவும்|அனுப்பவும்)/i,
        /pin\s*number\s*share/i,
        /share\s+otp\s+with/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 2. Pay to Receive Money Claim (+30)
  {
    id: 'pay_to_receive',
    name: 'Pay-to-Receive Money Trap',
    category: 'pay_to_receive',
    weight: 30,
    severity: 'high',
    explanation: 'Claims you must send money, scan a QR code, or pay a small fee to receive a refund, prize, or payment. UPI NEVER requires paying or entering a PIN to receive funds.',
    tamilExplanation: 'பணம் பெற நீங்கள் பணம் செலுத்த வேண்டும் அல்லது QR குறியீட்டை ஸ்கேன் செய்ய வேண்டும் எனக் கூறுகிறது. UPI-யில் பணம் பெற பின் தேவையில்லை.',
    matcher: (text: string) => {
      const patterns = [
        /(?:pay|send|transfer|scan)\s+(?:rs\.?|inr|₹)?\s*\d+\s+(?:to\s+receive|to\s+claim|to\s+get|for\s+refund)/i,
        /(?:scan\s+qr|scan\s+this\s+code)\s+(?:to\s+receive|to\s+get\s+cashback|to\s+claim)/i,
        /(?:enter\s+pin|approve\s+request)\s+(?:to\s+receive|to\s+credit\s+money|for\s+cashback)/i,
        /பணம்\s*பெற\s*(?:ஸ்கேன்|பணம்\s*செலுத்த)/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 3. Remote Access Apps Mention (+30)
  {
    id: 'remote_access',
    name: 'Remote Access Tool Solicitation',
    category: 'remote_access',
    weight: 30,
    severity: 'high',
    explanation: 'Requests installation of screen-sharing or remote management apps (e.g., AnyDesk, TeamViewer, RustDesk, QuickSupport). Scammers use these to steal credentials and hijack sessions.',
    tamilExplanation: 'AnyDesk அல்லது TeamViewer போன்ற தொலைதூர அணுகல் செயலிகளை நிறுவக் கோருகிறது. இது மோசடி செய்பவர்கள் உங்கள் போனை கட்டுப்படுத்த உதவும்.',
    matcher: (text: string) => {
      const patterns = [
        /\b(anydesk|teamviewer|rustdesk|quicksupport|airdroid|screenshare|alpemix|zoho\s+assist)\b/i,
        /(?:install|download)\s+(?:app|apk)\s+(?:from\s+link|for\s+support|for\s+verification)/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 4. Suspicious Collect Request (+25)
  {
    id: 'collect_request',
    name: 'Suspicious UPI Collect Request',
    category: 'collect_request',
    weight: 25,
    severity: 'high',
    explanation: 'Instructs you to approve a pending collect request or tap "Pay" in your UPI app to receive funds. Approving a collect request DEDUCTS money from your account.',
    tamilExplanation: 'பணம் பெற collect request-ஐ ஏற்கச் சொல்கிறது. Collect request-ஐ அங்கீகரித்தால் உங்கள் கணக்கிலிருந்து பணம் எடுக்கப்படும்.',
    matcher: (text: string) => {
      const patterns = [
        /(?:collect\s*request|payment\s*request)\s*(?:of|for)?\s*(?:rs\.?|inr|₹)?\s*\d+/i,
        /(?:approve|accept|click\s+pay)\s+(?:collect\s*request|mandate|auto\s*pay)/i,
        /(?:accept|approve)\s+(?:request\s+in\s+gpay|request\s+in\s+phonepe|request\s+in\s+paytm)/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 5. Suspicious / Shortened / Phishing URLs (+25)
  {
    id: 'suspicious_url',
    name: 'Suspicious or Masked URL',
    category: 'suspicious_url',
    weight: 25,
    severity: 'medium',
    explanation: 'Contains a URL shortener, IP address, or unofficial deceptive domain (e.g., bit.ly, tinyurl, ngrok, .xyz, or fake banking subdomains).',
    tamilExplanation: 'குறுகிய இணைப்பு (bit.ly) அல்லது அதிகாரப்பூர்வமற்ற போலி இணையதள முகவரியைக் கொண்டுள்ளது.',
    matcher: (text: string) => {
      const patterns = [
        /\b(?:https?:\/\/)?(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|goo\.gl|ngrok\.io|page\.link)\/[^\s]+/i,
        /\b(?:https?:\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?(?:\/[^\s]*)?/i,
        /\b(?:https?:\/\/)?[a-z0-9-]+\.(?:xyz|top|live|click|club|support|vip|icu|stream|work)\b/i,
        /\b(?:sbi|hdfc|icici|pnb|axis|bob|kotak|paytm|yono)[a-z0-9-]*-(?:kyc|update|login|verification|support)\.[a-z]{2,}/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 6. Bank / Government / Utility Impersonation (+20)
  {
    id: 'impersonation',
    name: 'Authority / Bank Impersonation',
    category: 'impersonation',
    weight: 20,
    severity: 'medium',
    explanation: 'Poses as a major bank (SBI YONO, HDFC), telecom provider, electricity board, income tax, RBI, or police to manufacture false credibility.',
    tamilExplanation: 'வங்கி (SBI, HDFC), மின்சார வாரியம், தொலைத்தொடர்பு அல்லது காவல்துறை போல பாசாங்கு செய்கிறது.',
    matcher: (text: string) => {
      const patterns = [
        /(?:dear\s+customer|valued\s+user)?[,\s]*(?:sbi\s*yono|yono\s*sbi|hdfc\s*bank|icici\s*bank|axis\s*bank|pnb\s*bank)\s+(?:account|services?|kyc)/i,
        /(?:electricity\s*power|electricity\s*bill|power\s*office|electricity\s*officer)\s+(?:will\s*be\s*disconnected|unpaid)/i,
        /(?:trai|telecom\s*authority|sim\s*verification|sim\s*block|cbi|rbi|income\s*tax\s*department)/i,
        /(?:kyc\s*suspended|account\s*deactivated|pan\s*card\s*not\s*updated)/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 7. Fake Rewards / Lottery / Cashback (+20)
  {
    id: 'fake_reward',
    name: 'Unsolicited Reward or Lottery Lure',
    category: 'fake_reward',
    weight: 20,
    severity: 'medium',
    explanation: 'Announces unexpected lottery winnings, massive cashback rewards, or scratch card prizes to exploit greed or curiosity.',
    tamilExplanation: 'எதிர்பாராத லாட்டரி, பரிசு அல்லது பெரும் கேஷ்பேக் வென்றதாக ஆசைகாட்டும் செய்தி.',
    matcher: (text: string) => {
      const patterns = [
        /(?:congratulations|lucky\s*winner|you\s*have\s*won)\s+(?:rs\.?|inr|₹)?\s*[\d,]+/i,
        /(?:kbc|kaun\s*banega\s*crorepati|lottery\s*no|jackpot)\s*(?:winner|award)/i,
        /(?:scratch\s*card|diwali\s*reward|special\s*cashback)\s*(?:worth|of)\s*(?:rs\.?|inr|₹)?\s*[\d,]+/i,
        /பரிசு\s*வென்றுள்ளீர்கள்/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },

  // 8. Artificial Urgency Tactics (+15)
  {
    id: 'urgency',
    name: 'High-Pressure Urgency Tactics',
    category: 'urgency',
    weight: 15,
    severity: 'low',
    explanation: 'Uses artificial deadlines (e.g., "within 24 hours", "tonight at 9:30 PM", "immediately") to pressure victims into bypassing critical thinking.',
    tamilExplanation: 'உடனடி நடவடிக்கை அல்லது 24 மணி நேரத்திற்குள் என அவசரப்படுத்தி யோசிக்க விடாமல் செய்கிறது.',
    matcher: (text: string) => {
      const patterns = [
        /(?:within\s+24\s*hours|within\s+12\s*hours|tonight\s+at|by\s+tonight|immediately|urgent\s+action)/i,
        /(?:will\s+be\s+blocked\s+today|disconnect\s+your\s+connection|suspended\s+today)/i,
        /(?:last\s+chance|valid\s+only\s+for\s+today|expire\s+soon)/i,
        /இன்றே\s*(?:முடிவடைகிறது|துண்டிக்கப்படும்)/i,
      ];
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[0];
      }
      return null;
    },
  },
];

// Helper to detect legitimate standard banking notifications
function isLegitimateBankAlert(text: string): boolean {
  const legitDebitCreditPattern = /(?:debited\s+by|credited\s+by|a\/c\s+[x*]{2,}\d+|\bavl\s+bal\b|available\s+balance|upi\s+ref\s+no|utr\s*[:\s]*\d{12})/i;
  const hasNoCallToAction = !/(?:click|link|call|download|install|verify\s+at|open|bit\.ly|tinyurl)/i.test(text);
  const hasNoPinRequest = !/(?:enter|share|provide)\s+(?:pin|otp|mpin)/i.test(text);

  return legitDebitCreditPattern.test(text) && hasNoCallToAction && hasNoPinRequest;
}

/**
 * Analyzes arbitrary message text using deterministic rules
 */
export function analyzeMessageRisk(rawText: string, source: 'scanner' | 'screenshot' | 'demo' = 'scanner'): RiskAnalysisResult {
  const normalizedText = rawText.trim();
  const matchedIndicators: RiskIndicator[] = [];
  const evidenceSnippets: string[] = [];

  // Short or empty message guard
  if (!normalizedText) {
    return {
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      rawText: '',
      score: 0,
      level: 'low',
      title: 'No Content Provided',
      summary: 'Please provide message text to perform security evaluation.',
      indicators: [],
      evidenceSnippets: [],
      safeActions: ['Paste an SMS, WhatsApp message, or payment note to begin.'],
      limitations: ['Deterministic rules require text input.'],
      tamilSummary: 'மதிப்பாய்வு செய்ய செய்தியை உள்ளிடவும்.',
      tamilActions: ['செய்தியை உள்ளிட்டு சரிபார்க்கவும்.'],
      isDeterministic: true,
      source,
    };
  }

  // Check legitimate banking transaction message first
  const isLegit = isLegitimateBankAlert(normalizedText);

  // Evaluate all detection rules
  for (const rule of DETECTION_RULES) {
    const snippet = rule.matcher(normalizedText);
    if (snippet) {
      matchedIndicators.push({
        id: rule.id,
        name: rule.name,
        category: rule.category,
        weight: rule.weight,
        severity: rule.severity,
        snippet,
        explanation: rule.explanation,
        tamilExplanation: rule.tamilExplanation,
      });
      evidenceSnippets.push(snippet);
    }
  }

  // Calculate raw score with rule weights
  let rawScore = matchedIndicators.reduce((sum, item) => sum + item.weight, 0);

  // Mitigating legitimate indicators
  if (isLegit) {
    // If it's a standard legitimate transaction notification, heavily reduce risk
    rawScore = Math.max(0, rawScore - 30);
  }

  // Cap score at 100
  const score = Math.min(100, Math.max(0, rawScore));

  // Determine risk level based on illustrative thresholds
  let level: RiskLevel = 'low';
  if (score >= 60) {
    level = 'high';
  } else if (score >= 30) {
    level = 'suspicious';
  }

  // Generate titles and summaries
  let title = 'Low Risk / Standard Message';
  let summary = 'No high-risk fraud indicators detected. This message appears consistent with ordinary communications or informational alerts.';
  let tamilSummary = 'இதில் ஆபத்தான மோசடி அறிகுறிகள் எதுவும் கண்டறியப்படவில்லை. இது சாதாரண செய்தியாகத் தெரிகிறது.';

  if (level === 'high') {
    title = 'High Risk – Probable Cyber Scam';
    summary = `CRITICAL WARNING: This message exhibits ${matchedIndicators.length} major indicators typical of Indian digital payment and UPI phishing scams. Do NOT enter your PIN or click any links.`;
    tamilSummary = 'கடுமையான எச்சரிக்கை: இந்தச் செய்தி UPI மற்றும் டிஜிட்டல் மோசடி அறிகுறிகளைக் கொண்டுள்ளது. எக்காரணம் கொண்டும் PIN எண்ணை உள்ளிடவோ லிங்க்கை கிளிக் செய்யவோ வேண்டாம்.';
  } else if (level === 'suspicious') {
    title = 'Suspicious – Exercise Extreme Caution';
    summary = `Caution advised: Detected ${matchedIndicators.length} warning flag(s). Scammers often mix legitimate-looking language with urgency or links. Verify through your official banking app.`;
    tamilSummary = 'எச்சரிக்கை தேவை: சில சந்தேகத்திற்கிடமான அம்சங்கள் உள்ளன. உங்கள் வங்கியின் அதிகாரப்பூர்வ செயலி மூலம் சரிபார்க்கவும்.';
  } else if (isLegit) {
    title = 'Legitimate Transaction Format Detected';
    summary = 'This message matches the standard syntax of a routine bank SMS transaction debit/credit alert without suspicious links or PIN requests.';
    tamilSummary = 'இது வழக்கமான வங்கி பரிவர்த்தனை எச்சரிக்கை செய்தி போன்று உள்ளது.';
  }

  // Generate safe recommended actions based on matched categories
  const safeActions: string[] = [];
  const tamilActions: string[] = [];

  if (level === 'high' || level === 'suspicious') {
    safeActions.push('NEVER enter your UPI PIN to receive money or cashback.');
    tamilActions.push('பணம் பெற அல்லது கேஷ்பேக் பெற எப்போதும் UPI பின்னை உள்ளிடாதீர்கள்.');

    if (matchedIndicators.some((i) => i.category === 'otp_pin')) {
      safeActions.push('Never share OTPs, CVVs, or bank passcodes with anyone, even callers claiming to be bank managers.');
      tamilActions.push('வங்கி மேனேஜர் என்று கூறினாலும் OTP அல்லது கடவுச்சொல்லை பகிராதீர்கள்.');
    }

    if (matchedIndicators.some((i) => i.category === 'suspicious_url')) {
      safeActions.push('Do NOT click on shortened or unfamiliar links. Always open your bank app directly from your phone.');
      tamilActions.push('தெரியாத இணைப்புகளை கிளிக் செய்யாதீர்கள். எப்போதும் வங்கி செயலியை நேரடியாக திறக்கவும்.');
    }

    if (matchedIndicators.some((i) => i.category === 'remote_access')) {
      safeActions.push('DO NOT install AnyDesk, TeamViewer, or QuickSupport. Legitimate tech support never asks to access your screen.');
      tamilActions.push('AnyDesk அல்லது TeamViewer செயலிகளை ஒருபோதும் பதிவிறக்கம் செய்யாதீர்கள்.');
    }

    if (matchedIndicators.some((i) => i.category === 'collect_request')) {
      safeActions.push('Decline any unexpected collect request in Google Pay, PhonePe, or Paytm.');
      tamilActions.push('Google Pay அல்லது PhonePe-ல் வரும் எதிர்பாராத collect request-ஐ நிராகரிக்கவும்.');
    }

    safeActions.push('If money was lost, call national cyber fraud helpline 1930 immediately (within 2 hours golden period).');
    tamilActions.push('பணம் இழந்திருந்தால், உடனடியாக 1930 என்ற தேசிய சைபர் மோசடி உதவி எண்ணை அழைக்கவும்.');
  } else {
    safeActions.push('Verify incoming payments in your own banking or UPI app transaction history.');
    safeActions.push('Keep SMS alerts active on your bank registered mobile number.');
    tamilActions.push('உங்கள் வங்கி செயலியில் பணப்பரிவர்த்தனை வரலாற்றை சரிபார்க்கவும்.');
    tamilActions.push('பதிவுசெய்யப்பட்ட எண்ணில் SMS எச்சரிக்கைகளை சரிபார்க்கவும்.');
  }

  const limitations = [
    'Score is calculated using transparent deterministic heuristic rules and does not constitute a guaranteed statistical probability.',
    'Scammers continuously evolve tactics; clean-looking messages may still be fraudulent if the sender identity is forged.',
    'PayGuard AI does not connect directly to telecom inboxes or bank systems; analysis is based strictly on submitted text.',
  ];

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    rawText: normalizedText,
    score,
    level,
    title,
    summary,
    indicators: matchedIndicators,
    evidenceSnippets,
    safeActions,
    limitations,
    tamilSummary,
    tamilActions,
    isDeterministic: true,
    source,
  };
}
