import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'PAYGUARD AI | Pause. Verify. Pay safely.',
  description:
    'AI-powered digital payment fraud detection and prevention assistant designed primarily for Indian UPI users. Detect OTP traps, fake collect requests, and phishing before you pay.',
  keywords: [
    'UPI fraud detection',
    'Indian cyber security',
    '1930 cyber helpline',
    'PhonePe scam detector',
    'Google Pay safety',
    'UPI PIN scam prevention',
    'cybercrime.gov.in',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-slate-100 antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
