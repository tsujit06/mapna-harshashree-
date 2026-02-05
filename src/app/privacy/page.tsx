import Link from 'next/link';
import { Shield, Lock, PhoneOff, ArrowLeft } from 'lucide-react';
import { PageMotion } from '@/components/PageMotion';

export const metadata = {
  title: 'Privacy Policy | kavach',
  description: 'Privacy is fundamental to how KAVACH is designed.',
};

export default function PrivacyPage() {
  return (
    <PageMotion className="min-h-screen bg-zinc-50 dark:bg-black bg-hero-gradient">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-8">
          Privacy is fundamental to how KAVACH is designed.
        </p>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            What we collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Only the minimum information required to enable safety features</li>
            <li>No personal phone numbers are stored or shared</li>
          </ul>
        </section>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            What we do NOT collect
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>No direct phone numbers</li>
            <li>No continuous location tracking</li>
            <li>No unnecessary personal identifiers</li>
          </ul>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <PhoneOff className="w-4 h-4 text-red-600" />
            Communication without exposing phone numbers
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            All calls made through KAVACH:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Do not reveal the caller&apos;s phone number</li>
            <li>Do not reveal the receiver&apos;s phone number</li>
            <li>Are routed through masked or unidentified caller IDs</li>
          </ul>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 pt-2">
            This ensures that users can communicate safely without ever sharing their personal contact details.
          </p>
        </section>
      </main>
    </PageMotion>
  );
}
