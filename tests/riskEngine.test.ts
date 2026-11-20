import { analyzeMessageRisk } from '../src/lib/riskEngine';

/**
 * Unit Test Suite for PAYGUARD AI Risk Analysis Engine
 */
export function runRiskEngineTests(): { passed: number; failed: number; results: any[] } {
  const tests = [
    {
      name: 'Test 1: High Risk - Fake Reward QR Lure with UPI PIN Request',
      text: 'Congratulations! You have won ₹2,500 Diwali festival cashback from PhonePe. Scan this QR code and enter your UPI PIN to approve credit transfer.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'high' && res.score >= 60 && res.indicators.some((i) => i.category === 'otp_pin' || i.category === 'pay_to_receive');
      },
    },
    {
      name: 'Test 2: High Risk - Bank Impersonation with Bitly Phishing Link & Urgency',
      text: 'Dear Customer, your SBI YONO account will be blocked today within 24 hours. Update your PAN immediately at http://bit.ly/sbi-kyc-update.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'high' && res.score >= 60 && res.indicators.some((i) => i.category === 'impersonation') && res.indicators.some((i) => i.category === 'suspicious_url');
      },
    },
    {
      name: 'Test 3: High Risk - Suspicious UPI Collect Request Scam',
      text: 'I have sent payment for your furniture. I sent a collect request of ₹4,999. Please open Google Pay and approve collect request to receive funds.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'high' && res.score >= 50 && res.indicators.some((i) => i.category === 'collect_request');
      },
    },
    {
      name: 'Test 4: High Risk - Remote Screen Sharing Hijacking (AnyDesk/QuickSupport)',
      text: 'Electricity power will be disconnected tonight. Call officer at 9821034112 or install AnyDesk to verify payment.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'high' && res.indicators.some((i) => i.category === 'remote_access');
      },
    },
    {
      name: 'Test 5: Low Risk - Legitimate Bank Debit Notification SMS (No false positive)',
      text: 'Dear Customer, A/c *4021 debited by INR 450.00 on 19-Nov-2024 via UPI. Ref UTR 432490128491. Paid to Swiggy UPI. Available Balance: INR 18,420.50.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'low' && res.score < 30;
      },
    },
    {
      name: 'Test 6: Low Risk - Routine Personal Message',
      text: 'Hey Rahul, see you at the restaurant at 1:30 PM. Let me know when you reach.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'low' && res.score === 0;
      },
    },
    {
      name: 'Test 7: High Risk - Tamil Language Pay-to-Receive Scam',
      text: 'பணம் பெற உங்கள் UPI பின் உள்ளிடவும் மற்றும் QR குறியீட்டை ஸ்கேன் செய்யவும்.',
      assert: (res: ReturnType<typeof analyzeMessageRisk>) => {
        return res.level === 'high' && res.indicators.length > 0;
      },
    },
  ];

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const t of tests) {
    const analysis = analyzeMessageRisk(t.text);
    const isPassing = t.assert(analysis);
    if (isPassing) {
      passed++;
      results.push({ name: t.name, status: 'PASSED', score: analysis.score, level: analysis.level });
    } else {
      failed++;
      results.push({ name: t.name, status: 'FAILED', score: analysis.score, level: analysis.level, indicators: analysis.indicators.map((i) => i.name) });
    }
  }

  return { passed, failed, results };
}
