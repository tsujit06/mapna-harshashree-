import Link from 'next/link';
import { Shield, Lock, Server, QrCode, ArrowLeft } from 'lucide-react';
import { PageMotion } from '@/components/PageMotion';

export const metadata = {
  title: 'Security Policy | kavach',
  description: 'KAVACH is built with security at every layer.',
};

export default function SecurityPage() {
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
            <Shield className="w-5 h-5 text-red-600" />
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Security Policy</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-8">
          KAVACH is built with security at every layer.
        </p>

        <section className="space-y-6 mb-10">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-600" />
            How we keep things safe
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Encrypted data storage and secure servers</li>
            <li>Controlled access to information through system-level safeguards</li>
            <li>No sensitive data embedded directly in QR codes</li>
            <li>Ability to update or disable access instantly if needed</li>
          </ul>
        </section>

        <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-red-600" />
            QR Safety
          </h2>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>QR codes only act as a secure reference, not as data containers</li>
            <li>Even if a QR is scanned by the wrong person, private data remains protected</li>
          </ul>
        </section>
      </main>
    </PageMotion>
  );
}
