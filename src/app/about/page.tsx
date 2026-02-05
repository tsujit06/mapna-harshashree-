import Link from 'next/link';
import { Shield, Heart, Users, RefreshCw, ArrowLeft } from 'lucide-react';
import { PageMotion } from '@/components/PageMotion';

export const metadata = {
  title: 'About Us | kavach',
  description: 'KAVACH is a safety and trust platform designed for real-world situations.',
};

export default function AboutPage() {
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
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">🏢 About Us</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-16 space-y-12">
        <section>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            KAVACH is a safety and trust platform designed for real-world situations—where quick access to the right information can make all the difference.
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mt-4">
            Built with the realities of India in mind, KAVACH enables instant access to critical safety information while preserving privacy and dignity. Our purpose is simple yet vital: to reduce response time, improve accountability, and save lives.
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mt-4">
            Whether used by individuals, families, communities, or workplaces, KAVACH works as a quiet layer of protection—always available, never intrusive. At its core, KAVACH is about taking care of the people who matter most.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-red-600" />
            Information Updates & Management
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            KAVACH is designed for changing real-life situations.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Information can be updated instantly without replacing physical tags</li>
            <li>No need to reprint or redistribute identifiers</li>
            <li>Changes take effect in real time</li>
          </ul>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-4">
            This ensures that safety information is always current and reliable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-600" />
            ❤️ Built for Families & Loved Ones
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            In today&apos;s world, safety is no longer something we can assume—it&apos;s something we must actively care for.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            For families, safety means knowing that parents, children, elders, and loved ones can access help when they need it—today, tomorrow, and in the future. KAVACH is designed to support this responsibility without creating fear, dependence, or constant monitoring.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium mb-2">KAVACH helps families:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            <li>Reach help faster during emergencies</li>
            <li>Share essential information without exposing personal details</li>
            <li>Stay prepared without tracking, surveillance, or intrusion</li>
            <li>Build long-term peace of mind for every stage of life</li>
          </ul>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
            It&apos;s not about control. It&apos;s about care, preparedness, and trust—so families can focus on living, knowing protection is already in place.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-red-600" />
            🤝 Built for Communities & Workplaces
          </h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            Communities and workplaces depend on people moving safely, reliably, and responsibly every day.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            Whether it&apos;s shared spaces, daily operations, or workplace fleets, safety systems must be dependable, easy to use, and respectful of privacy. KAVACH is designed to support communities and organizations in protecting what matters most—their people and the assets that keep everything running.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium mb-2">KAVACH helps communities and workplaces:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300 mb-4">
            <li>Improve emergency response without operational friction</li>
            <li>Maintain accountability without constant supervision</li>
            <li>Protect critical assets while prioritizing human safety</li>
            <li>Adapt easily to changing people, roles, and situations</li>
          </ul>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            By simplifying safety and removing complexity, KAVACH enables organizations and communities to operate with greater confidence and care.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">🌱 Safety That Grows With You</h2>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            KAVACH is built to evolve—with families, communities, and workplaces alike. As lives change and responsibilities grow, KAVACH remains a steady foundation for safety, trust, and preparedness.
          </p>
        </section>
      </main>
    </PageMotion>
  );
}
