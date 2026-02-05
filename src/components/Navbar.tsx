'use client';

import Link from 'next/link';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navEase = { ease: [0.33, 1, 0.68, 1] };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ...navEase }}
      className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-0 border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-3d"
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="bg-red-600 p-1.5 rounded-xl shadow-lg shadow-red-600/30"
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ...navEase }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                kavach
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: '/#features', label: 'How it works' },
              { href: '/#pricing', label: 'Pricing' },
              { href: '/about', label: 'About Us' },
              { href: '/login', label: 'Login' },
            ].map((item) => (
              <motion.div key={item.href} whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-zinc-600 hover:text-red-600 transition-colors dark:text-zinc-400 dark:hover:text-red-500"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ...navEase }}
            >
              <Link
                href="/register"
                className="inline-block bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-3d-red hover:shadow-[0_8px_24px_-4px_rgba(220,38,38,0.4)] btn-3d"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-600 dark:text-zinc-400 p-2 -m-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ...navEase }}
            className="md:hidden overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
          >
            <div className="py-4 px-4 space-y-1">
              {[
                { href: '/#features', label: 'How it works' },
                { href: '/#pricing', label: 'Pricing' },
                { href: '/about', label: 'About Us' },
                { href: '/login', label: 'Login' },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.2, ...navEase }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 rounded-xl text-base font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.2, ...navEase }}
                className="pt-2"
              >
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-red-600 text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-600/25"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
