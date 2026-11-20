// Server-side Gemini API client with strict cybersecurity system instructions and deterministic fallback

export interface GeminiResponse {
  text: string;
  isFallback: boolean;
  model: string;
}

const SYSTEM_PROMPT = `You are PAYGUARD AI, a specialized digital payment fraud prevention assistant designed for Indian UPI and digital payment users.
Your tagline is: 'Pause. Verify. Pay safely.'

STRICT OPERATIONAL & ETHICAL BOUNDARIES:
1. NEVER request, accept, or suggest entering or storing UPI PINs, OTPs, card CVVs, passwords, or full bank account credentials.
2. NEVER claim you can block a bank transaction, freeze accounts, contact banks on the user's behalf, or directly register police FIRs.
3. If money has been fraudulently deducted, immediately direct the user to call India's National Cyber Fraud Helpline at 1930 and file an official complaint at https://cybercrime.gov.in/ within the 2-hour 'golden period'.
4. Clarify the fundamental UPI rule: UPI PIN is ONLY entered to SEND money or deduct funds, NEVER to receive money or get cashback.
5. Provide clear, empathetic, practical, concise, and actionable advice.
6. When responding in Tamil, write natural, clear, accurate Tamil (தமிழ்).
`;

// Fallback canned knowledge base for offline or demo mode
interface FallbackQA {
  keywords: string[];
  en: string;
  ta: string;
}

const FALLBACK_KNOWLEDGE_BASE: FallbackQA[] = [
  {
    keywords: ['qr', 'receive', 'cashback', 'scan', 'reward', 'குறியீடு', 'பரிசு'],
    en: `🚨 **Golden Rule: Never Enter UPI PIN to Receive Money**

1. **How UPI Works**: Scanning a QR code or entering your UPI PIN always **DEDUCTS** money from your account. You NEVER need to enter your PIN to receive money, prizes, or cashback.
2. **The Trap**: Scammers generate a merchant payment QR code or a collect request and deceptively claim "Enter PIN to credit ₹2,000 to your bank".
3. **Immediate Action**: 
   - **DO NOT** scan the QR or enter your 4-digit or 6-digit PIN.
   - Block and report the sender on WhatsApp or Truecaller.
   - If you already entered your PIN and money was debited, call **1930** immediately.`,
    ta: `🚨 **முக்கிய விதி: பணம் பெற ஒருபோதும் UPI PIN உள்ளிடாதீர்கள்**

1. **UPI எவ்வாறு செயல்படுகிறது**: QR குறியீட்டை ஸ்கேன் செய்து உங்கள் UPI PIN எண்ணை உள்ளிட்டால் உங்கள் கணக்கிலிருந்து பணம் **பிடிக்கப்படும்**. பணம் அல்லது கேஷ்பேக் பெற PIN எண் தேவையில்லை.
2. **மோசடி முறை**: ஏமாற்றுபவர்கள் ஒரு கட்டண QR குறியீட்டை அனுப்பி "பணம் பெற பின்னை உள்ளிடுங்கள்" என்று பொய் கூறுவார்கள்.
3. **உடனடி நடவடிக்கை**:
   - QR குறியீட்டை ஸ்கேன் செய்யாதீர்கள்; PIN எண்ணை உள்ளிடாதீர்கள்.
   - உடனடியாக அந்த நபரை பிளாக் செய்யவும்.
   - பணம் பிடித்தம் செய்யப்பட்டால் உடனே **1930** உதவி எண்ணை அழைக்கவும்.`,
  },
  {
    keywords: ['otp', 'shared', 'cvv', 'password', 'பகிர்ந்து', 'ரகசிய'],
    en: `⚠️ **Emergency Action: OTP / Password Compromised**

If you mistakenly shared an OTP, PIN, or password:
1. **Immediately Block Banking**: Open your bank's official app or call your bank's 24x7 emergency helpline to temporarily freeze your debit card and UPI services.
2. **Call 1930 Cyber Fraud Helpline**: Dial **1930** (Citizen Financial Cyber Fraud Reporting System) to request a temporary hold on the destination bank account.
3. **Change All Passcodes**: Reset your UPI PIN, net banking password, and ATM PIN from an official, safe device.
4. **Official Complaint**: File an incident report on **https://cybercrime.gov.in/** with transaction UTR numbers and screenshots.`,
    ta: `⚠️ **அவசர நடவடிக்கை: OTP பகிரப்பட்டால் செய்ய வேண்டியவை**

நீங்கள் தவறுதலாக OTP அல்லது PIN எண்ணை பகிர்ந்திருந்தால்:
1. **வங்கி சேவையை நிறுத்துங்கள்**: உடனே உங்கள் வங்கியின் அதிகாரப்பூர்வ உதவி எண்ணை அழைத்து கார்டு மற்றும் UPI சேவையை தற்காலிகமாக முடக்கவும்.
2. **1930 அழைக்கவும்**: தேசிய சைபர் உதவி எண் **1930**-ஐ உடனடியாக அழைத்து புகார் தெரிவிக்கவும்.
3. **பாஸ்வேர்டை மாற்றவும்**: உங்கள் UPI PIN மற்றும் வங்கி பாஸ்வேர்டுகளை உடனடியாக மாற்றவும்.
4. **அதிகாரப்பூர்வ புகார்**: **https://cybercrime.gov.in/** என்ற தளத்தில் புகார் பதிவு செய்யவும்.`,
  },
  {
    keywords: ['collect', 'request', 'phonepe', 'gpay', 'paytm', 'கோரிக்கை'],
    en: `🛑 **Beware of Fraudulent UPI Collect Requests**

- **What is a Collect Request?**: A feature in Google Pay, PhonePe, and Paytm where someone requests money FROM you.
- **The Scam**: Fraudsters on OLX or Quikr pretend to buy an item and send a collect request of ₹5,000, telling you: *"Click Pay and enter your PIN to accept my payment."*
- **The Reality**: The moment you tap "Pay" and enter your UPI PIN, **₹5,000 is sent from YOUR account to the fraudster**.
- **Action**: Tap **"Decline"** or **"Reject"** on all unexpected collect requests and report the VPA inside your UPI app.`,
    ta: `🛑 **போலி UPI Collect Request எச்சரிக்கை**

- **Collect Request என்றால் என்ன?**: உங்கள் கணக்கிலிருந்து பணத்தைக் கோரும் ஒரு அம்சம்.
- **மோசடி**: OLX போன்ற தளங்களில் வாங்குபவர் போல நடித்து, உங்களுக்கு பணம் அனுப்புவதாகக் கூறி Collect Request அனுப்புவார்கள்.
- **உண்மை**: நீங்கள் "Pay" கொடுத்து PIN உள்ளிட்டால், உங்கள் கணக்கிலிருந்து பணம் மோசடி செய்பவருக்கு சென்றுவிடும்.
- **நடவடிக்கை**: தெரியாத எந்த Collect Request-ஐயும் **"Decline" (நிராகரி)** செய்யவும்.`,
  },
  {
    keywords: ['1930', 'helpline', 'cybercrime', 'complain', 'police', 'புகார்', 'காவல்துறை'],
    en: `🛡️ **How to Use Indian Cyber Fraud Helpline 1930 & Portal**

1. **The Golden Hour (First 2 Hours)**: Dialing **1930** immediately connects you to the National Cybercrime Reporting Portal (NCRP) where officers can freeze transactions across inter-bank beneficiary accounts before fraudsters withdraw via ATM.
2. **Documents to Keep Ready**:
   - 12-digit UPI UTR number or Bank Transaction ID
   - Debited Account number & Bank name
   - Date, exact time, and amount lost
   - Fraudster's UPI ID (VPA), phone number, or payment link
3. **Portal Follow-up**: After calling 1930, visit **https://cybercrime.gov.in/** within 24 hours to upload transaction proofs and receive your official acknowledgment receipt for your bank and police.`,
    ta: `🛡️ **தேசிய சைபர் உதவி எண் 1930 மற்றும் புகார் முறை**

1. **தங்க நேரம் (Golden Hour - முதல் 2 மணி நேரம்)**: பணம் இழந்த உடனே **1930** எண்ணை அழைத்தால், வங்கிகளுக்கிடையேயான பண பரிமாற்றத்தை முடக்க முடியும்.
2. **தயாராக வைத்திருக்க வேண்டியவை**:
   - 12 இலக்க UPI UTR எண்
   - வங்கி கணக்கு எண் மற்றும் வங்கி பெயர்
   - பரிவர்த்தனை நடந்த தேதி, நேரம் மற்றும் தொகை
   - மோசடி நபரின் போன் எண் அல்லது UPI ID
3. **இணையதள புகார்**: 1930 அழைத்த பிறகு **https://cybercrime.gov.in/** தளத்தில் முழு விவரங்களையும் பதிவு செய்து ரசீதைப் பெற்றுக்கொள்ளவும்.`,
  },
  {
    keywords: ['anydesk', 'teamviewer', 'app', 'apk', 'screen', 'செயலி'],
    en: `🚫 **Danger: Screen Sharing & Remote Access Apps**

- **The Trick**: Callers posing as bank executives or electricity board officers instruct you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport to "verify KYC" or "resolve failed payments".
- **What Happens**: These apps grant the caller 100% visibility of your mobile screen. When you open your banking app or receive an OTP, the scammer views your screen in real time and drains your balance.
- **Action**: NEVER install any remote-control app at the request of an unknown caller. If installed, immediately turn on Airplane Mode, uninstall the app, and change your net banking passwords.`,
    ta: `🚫 **எச்சரிக்கை: AnyDesk, TeamViewer போன்ற செயலிகள்**

- **மோசடி தந்திரம்**: வங்கி அதிகாரி போல பேசி KYC சரிபார்க்க AnyDesk அல்லது TeamViewer செயலிகளை பதிவிறக்கம் செய்யச் சொல்வார்கள்.
- **என்ன நடக்கும்**: இந்த செயலிகள் மூலம் உங்கள் போன் திரையை அவர்கள் முழுமையாக பார்க்க முடியும். நீங்கள் தட்டச்சு செய்யும் ரகசிய எண்கள், வரும் OTP ஆகியவற்றை பார்த்து பணத்தை திருடுவார்கள்.
- **நடவடிக்கை**: தெரியாதவர்கள் சொன்னால் ஒருபோதும் எந்த செயலிகளையும் பதிவிறக்கம் செய்யாதீர்கள். உடனடியாக செயலியை நீக்கவும்.`,
  },
];

export async function generateCyberSafetyResponse(
  prompt: string,
  language: 'en' | 'ta' = 'en',
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no Gemini key is provided, use high-quality deterministic fallback
  if (!apiKey) {
    const fallbackAnswer = getDeterministicFallback(prompt, language);
    return {
      text: fallbackAnswer,
      isFallback: true,
      model: 'deterministic-knowledge-engine',
    };
  }

  try {
    const langInstruction =
      language === 'ta'
        ? 'IMPORTANT: Respond primarily in simple, natural, clear Tamil (தமிழ்). Include English technical terms (UPI PIN, OTP, UTR, 1930) in parentheses where helpful.'
        : 'Respond in clear, concise English with bullet points and bold highlights.';

    const systemContext = `${SYSTEM_PROMPT}\n\nLanguage Directive: ${langInstruction}`;

    // Construct request to Gemini 1.5 Flash endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const formattedContents = [
      {
        role: 'user',
        parts: [{ text: systemContext }],
      },
      ...conversationHistory.slice(-4).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Using deterministic fallback.`);
      const fallbackAnswer = getDeterministicFallback(prompt, language);
      return {
        text: fallbackAnswer,
        isFallback: true,
        model: 'deterministic-fallback',
      };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Empty response from Gemini API');
    }

    return {
      text: candidateText,
      isFallback: false,
      model: 'gemini-1.5-flash',
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    const fallbackAnswer = getDeterministicFallback(prompt, language);
    return {
      text: fallbackAnswer,
      isFallback: true,
      model: 'deterministic-fallback-offline',
    };
  }
}

function getDeterministicFallback(prompt: string, language: 'en' | 'ta'): string {
  const lowerPrompt = prompt.toLowerCase();

  for (const item of FALLBACK_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => lowerPrompt.includes(kw.toLowerCase()))) {
      return language === 'ta' ? item.ta : item.en;
    }
  }

  // Generic fallback if no specific keyword matched
  if (language === 'ta') {
    return `🛡️ **PAYGUARD AI பாதுகாப்பு வழிகாட்டுதல்**:

1. **முக்கிய தங்க விதி**: UPI-யில் பணம் பெற உங்கள் PIN எண்ணை உள்ளிட வேண்டிய அவசியமே இல்லை!
2. **OTP & கடவுச்சொல்**: எந்த வங்கியும் போன் மூலமாகவோ மெசேஜ் மூலமாகவோ OTP அல்லது UPI PIN-ஐ கேட்காது.
3. **சந்தேகத்திற்குரிய பரிவர்த்தனை**: உங்களுக்கு தெரியாத Collect Request-ஐ ஏற்காதீர்கள்.
4. **அவசர உதவி**: நிதி மோசடி நடந்தால் உடனடியாக **1930** என்ற உதவி எண்ணை அழைக்கவும் அல்லது **cybercrime.gov.in** தளத்தில் புகார் அளிக்கவும்.

மேலும் சந்தேகங்களுக்கு QR குறியீடு, OTP, அல்லது 1930 பற்றி குறிப்பிட்ட கேள்விகளைக் கேளுங்கள்.`;
  }

  return `🛡️ **PAYGUARD AI Safety Guidelines**:

1. **The Golden Rule of UPI**: You NEVER need to enter your UPI PIN or scan a QR code to receive money or cashback. UPI PIN is exclusively entered to AUTHORIZE DEBITS from your account.
2. **Never Share Secrets**: Banks, telecom providers, and police will NEVER ask for your OTP, UPI PIN, ATM PIN, or CVV.
3. **Beware of Collect Requests**: If someone tells you to open Google Pay, PhonePe, or Paytm and tap "Approve" or "Pay" to receive funds, it is 100% a scam.
4. **Emergency Assistance**: If you lost money in a cyber fraud, call the National Cyber Helpline **1930** immediately within the first 2 hours and register a complaint on **https://cybercrime.gov.in/**.

Feel free to ask specific questions about QR code scams, fake payment screenshots, or how to report cyber fraud!`;
}
