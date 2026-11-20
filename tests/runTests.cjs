// Direct CommonJS runner for the deterministic detection rules
const DETECTION_RULES = [
  {
    id: 'req_otp_pin',
    name: 'Request for OTP / UPI PIN',
    category: 'otp_pin',
    weight: 35,
    matcher: (text) => {
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
  {
    id: 'pay_to_receive',
    name: 'Pay-to-Receive Money Trap',
    category: 'pay_to_receive',
    weight: 30,
    matcher: (text) => {
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
  {
    id: 'remote_access',
    name: 'Remote Access Tool Solicitation',
    category: 'remote_access',
    weight: 30,
    matcher: (text) => {
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
  {
    id: 'collect_request',
    name: 'Suspicious UPI Collect Request',
    category: 'collect_request',
    weight: 25,
    matcher: (text) => {
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
  {
    id: 'suspicious_url',
    name: 'Suspicious or Masked URL',
    category: 'suspicious_url',
    weight: 25,
    matcher: (text) => {
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
  {
    id: 'impersonation',
    name: 'Authority / Bank Impersonation',
    category: 'impersonation',
    weight: 20,
    matcher: (text) => {
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
  {
    id: 'fake_reward',
    name: 'Unsolicited Reward or Lottery Lure',
    category: 'fake_reward',
    weight: 20,
    matcher: (text) => {
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
  {
    id: 'urgency',
    name: 'High-Pressure Urgency Tactics',
    category: 'urgency',
    weight: 15,
    matcher: (text) => {
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

function isLegitimateBankAlert(text) {
  const legitDebitCreditPattern = /(?:debited\s+by|credited\s+by|a\/c\s+[x*]{2,}\d+|\bavl\s+bal\b|available\s+balance|upi\s+ref\s+no|utr\s*[:\s]*\d{12})/i;
  const hasNoCallToAction = !/(?:click|link|call|download|install|verify\s+at|open|bit\.ly|tinyurl)/i.test(text);
  const hasNoPinRequest = !/(?:enter|share|provide)\s+(?:pin|otp|mpin)/i.test(text);
  return legitDebitCreditPattern.test(text) && hasNoCallToAction && hasNoPinRequest;
}

function analyzeRisk(rawText) {
  const text = (rawText || '').trim();
  if (!text) return { score: 0, level: 'low', indicators: [] };

  const isLegit = isLegitimateBankAlert(text);
  const matched = [];

  for (const rule of DETECTION_RULES) {
    const snippet = rule.matcher(text);
    if (snippet) {
      matched.push({ id: rule.id, name: rule.name, category: rule.category, weight: rule.weight });
    }
  }

  let rawScore = matched.reduce((sum, item) => sum + item.weight, 0);
  if (isLegit) rawScore = Math.max(0, rawScore - 30);
  const score = Math.min(100, Math.max(0, rawScore));

  const level = score >= 60 ? 'high' : score >= 30 ? 'suspicious' : 'low';
  return { score, level, indicators: matched };
}

// Execute test cases
const testCases = [
  {
    name: 'Test 1: High Risk - Fake Reward QR Lure with UPI PIN Request',
    text: 'Congratulations! You have won ₹2,500 Diwali festival cashback from PhonePe. Scan this QR code and enter your UPI PIN to approve credit transfer.',
    expectedLevel: 'high',
  },
  {
    name: 'Test 2: High Risk - Bank Impersonation with Bitly Phishing Link & Urgency',
    text: 'Dear Customer, your SBI YONO account will be blocked today within 24 hours. Update your PAN immediately at http://bit.ly/sbi-kyc-update.',
    expectedLevel: 'high',
  },
  {
    name: 'Test 3: High Risk - Suspicious UPI Collect Request Scam',
    text: 'I have sent payment for your furniture. I sent a collect request of ₹4,999. Please open Google Pay and approve collect request to receive funds.',
    expectedLevel: 'high',
  },
  {
    name: 'Test 4: High Risk - Remote Screen Sharing Hijacking (AnyDesk/QuickSupport)',
    text: 'Electricity power will be disconnected tonight. Call officer at 9821034112 or install AnyDesk to verify payment.',
    expectedLevel: 'high',
  },
  {
    name: 'Test 5: Low Risk - Legitimate Bank Debit Notification SMS (No false positive)',
    text: 'Dear Customer, A/c *4021 debited by INR 450.00 on 19-Nov-2024 via UPI. Ref UTR 432490128491. Paid to Swiggy UPI. Available Balance: INR 18,420.50.',
    expectedLevel: 'low',
  },
  {
    name: 'Test 6: Low Risk - Routine Personal Message',
    text: 'Hey Rahul, see you at the restaurant at 1:30 PM. Let me know when you reach.',
    expectedLevel: 'low',
  },
  {
    name: 'Test 7: High Risk - Tamil Language Pay-to-Receive Scam',
    text: 'பணம் பெற உங்கள் UPI பின் உள்ளிடவும் மற்றும் QR குறியீட்டை ஸ்கேன் செய்யவும்.',
    expectedLevel: 'high',
  },
];

console.log('------------------------------------------------------------');
console.log('PAYGUARD AI - DETERMINISTIC RISK ENGINE TEST SUITE');
console.log('------------------------------------------------------------');

let passedCount = 0;
for (const tc of testCases) {
  const res = analyzeRisk(tc.text);
  const ok = res.level === tc.expectedLevel;
  if (ok) {
    passedCount++;
    console.log(`[PASS] ${tc.name} -> Score: ${res.score}/100, Level: ${res.level}`);
  } else {
    console.error(`[FAIL] ${tc.name} -> Expected: ${tc.expectedLevel}, Got: ${res.level} (Score: ${res.score})`);
  }
}

console.log('------------------------------------------------------------');
console.log(`Results: ${passedCount}/${testCases.length} Tests Passed (${Math.round((passedCount / testCases.length) * 100)}%)`);
console.log('------------------------------------------------------------');
