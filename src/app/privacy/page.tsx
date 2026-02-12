import Link from 'next/link';
import Image from 'next/image';
import { Shield, Lock, PhoneOff, ArrowLeft } from 'lucide-react';
import { PageMotion } from '@/components/PageMotion';

export const metadata = {
  title: 'Privacy Policy | REXU',
  description: 'Privacy is fundamental to how REXU is designed.',
};

export default function PrivacyPage() {
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
            <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <p className="text-[#B7BEC4] text-sm mb-8">
          Privacy is fundamental to how REXU is designed.
        </p>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#9AC57A]" />
            What we collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-[#B7BEC4]">
            <li>Only the minimum information required to enable safety features</li>
            <li>No personal phone numbers are stored or shared</li>
          </ul>
        </section>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-white">
            What we do NOT collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-[#B7BEC4]">
            <li>No direct phone numbers</li>
            <li>No continuous location tracking</li>
            <li>No unnecessary personal identifiers</li>
          </ul>
        </section>

        <section className="space-y-4 p-6 rounded-[28px] bg-[#101518]/90 border border-white/10">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <PhoneOff className="w-4 h-4 text-[#9AC57A]" />
            Communication without exposing phone numbers
          </h2>
          <p className="text-sm text-[#B7BEC4]">
            All calls made through REXU:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#B7BEC4]">
            <li>Do not reveal the caller&apos;s phone number</li>
            <li>Do not reveal the receiver&apos;s phone number</li>
            <li>Are routed through masked or unidentified caller IDs</li>
          </ul>
          <p className="text-sm text-[#B7BEC4] pt-2">
            This ensures that users can communicate safely without ever sharing their personal contact details.
          </p>
        </section>
      </main>
    </PageMotion>
  );
}
