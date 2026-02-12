import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, QrCode, ArrowLeft } from 'lucide-react';
import { PageMotion } from '@/components/PageMotion';

export const metadata = {
  title: 'Security Policy | REXU',
  description: 'REXU is built with security at every layer.',
};

export default function SecurityPage() {
  return (
    <PageMotion className="min-h-screen bg-gradient-to-b from-black via-[#101518] to-black">
      <header className="bg-[#1F2428] border-b border-[#2B3136] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#3A3F45] text-zinc-500 hover:bg-[#2B3136] hover:text-white transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/rexu-logo.png"
              alt="REXU"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-lg font-bold text-white">Security Policy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <p className="text-[#B7BEC4] text-sm mb-8">
          REXU is built with security at every layer.
        </p>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#9AC57A]" />
            How we keep things safe
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-[#B7BEC4]">
            <li>Encrypted data storage and secure servers</li>
            <li>Controlled access to information through system-level safeguards</li>
            <li>No sensitive data embedded directly in QR codes</li>
            <li>Ability to update or disable access instantly if needed</li>
          </ul>
        </section>

        <section className="space-y-4 p-6 rounded-[28px] bg-[#101518]/90 border border-white/10">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#9AC57A]" />
            QR Safety
          </h2>
          <ul className="space-y-2 text-sm text-[#B7BEC4]">
            <li>QR codes only act as a secure reference, not as data containers</li>
            <li>Even if a QR is scanned by the wrong person, private data remains protected</li>
          </ul>
        </section>
      </main>
    </PageMotion>
  );
}
