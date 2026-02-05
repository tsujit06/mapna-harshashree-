'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card3D } from '@/components/Card3D';

const ease = [0.33, 1, 0.68, 1];

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden bg-hero-gradient bg-mesh-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <motion.div
            className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/30"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            QRgency
          </span>
        </Link>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="text-3xl font-extrabold text-zinc-900 dark:text-white"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"
      >
        <Card3D tilt lift className="py-8 px-6 sm:px-10 shadow-3d border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[28px]">
          {children}
        </Card3D>
      </motion.div>
    </div>
  );
}
