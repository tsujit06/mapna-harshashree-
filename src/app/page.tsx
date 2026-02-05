'use client';

import * as React from 'react';
import Navbar from '@/components/Navbar';
import { Card3D } from '@/components/Card3D';
import { GlassCard } from '@/components/GlassCard';
import { MotionSection, staggerChildVariants } from '@/components/MotionSection';
import { Shield, Smartphone, QrCode, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ease = [0.33, 1, 0.68, 1];
const easeBounce = [0.34, 1.56, 0.64, 1];

type HomePageProps = {
  params?: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export default function Home(props: HomePageProps) {
  // Next.js 15: unwrap dynamic APIs so they are not enumerated/accessed by dev tooling
  if (props.params) React.use(props.params);
  if (props.searchParams) React.use(props.searchParams);
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden">
      <Navbar />

      {/* Hero — premium 3D with gradient mesh & floating badge */}
      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden perspective-3d">
        <div className="absolute inset-0 -z-10 bg-hero-gradient bg-mesh-gradient" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-red-500/15 dark:bg-red-500/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-400/10 dark:bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeBounce }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-card border border-white/50 dark:border-white/10 shadow-float text-red-600 dark:text-red-400 text-xs font-bold tracking-wider uppercase"
              style={{ transform: 'translateZ(20px)' }}
            >
              <Shield className="w-4 h-4" /> QRgency Emergency System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]"
            >
              Scan. Connect.{' '}
              <span className="gradient-text">Save Lives.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed"
            >
              Instantly provide your emergency contacts to anyone scanning the QR on your vehicle. Fast, secure, and life-saving when every second counts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-3d-red shadow-glow-red hover:shadow-[0_20px_50px_-12px_rgba(220,38,38,0.45)] transition-all duration-300 btn-3d"
                >
                  Generate My QR <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/#features"
                  className="inline-flex items-center justify-center w-full sm:w-auto glass-card text-zinc-900 dark:text-white px-8 py-4 rounded-2xl text-lg font-bold border-2 border-zinc-200/80 dark:border-zinc-700/80 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 shadow-3d"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats — glass cards with 3D lift */}
      <MotionSection
        className="py-16 border-y border-zinc-100 dark:border-zinc-900 bg-zinc-50/80 dark:bg-zinc-950/80"
        stagger
        staggerDelay={0.07}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Setup Time', value: '2 Mins' },
            { label: 'Launch Offer', value: 'Free*' },
            { label: 'Activation', value: 'Instant' },
            { label: 'Security', value: 'Encrypted' },
          ].map((stat, i) => (
            <motion.div key={i} variants={staggerChildVariants}>
              <GlassCard className="p-6 sm:p-8 text-center">
                <motion.div
                  className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* Features — Card3D with gradient icon wells */}
      <MotionSection
        id="features"
        className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        stagger
        staggerDelay={0.12}
      >
        <motion.div variants={staggerChildVariants} className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            How it works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Simple process designed for maximum reliability during emergencies.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {[
            {
              icon: <Smartphone className="w-8 h-8 text-white" />,
              title: '1. Register & Setup',
              desc: 'Create your account and add up to 3 emergency contacts like family members or friends.',
            },
            {
              icon: <QrCode className="w-8 h-8 text-white" />,
              title: '2. Generate QR',
              desc: 'Activate and download your unique vehicle QR code. Free for the first 1000 customers, then ₹299 one-time.',
            },
            {
              icon: <PhoneCall className="w-8 h-8 text-white" />,
              title: '3. Scan & Call',
              desc: 'In an emergency, anyone can scan the QR to call your contacts immediately without any app.',
            },
          ].map((feature, i) => (
            <motion.div key={i} variants={staggerChildVariants}>
              <Card3D
                tilt
                lift
                className="p-8 lg:p-10 rounded-[28px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 h-full shadow-3d relative overflow-hidden"
              >
                <div
                  className="mb-6 p-4 rounded-2xl w-fit bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30"
                  style={{ transform: 'translateZ(8px)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </MotionSection>

      {/* Pricing — 3D card with glow */}
      <MotionSection
        id="pricing"
        className="py-28 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/15 dark:bg-red-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/10 dark:bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Card3D
            tilt
            lift
            className="bg-white dark:bg-zinc-900 rounded-[36px] p-8 sm:p-16 border border-zinc-200 dark:border-zinc-800 shadow-float relative overflow-hidden ring-2 ring-red-500/10 dark:ring-red-500/20"
          >
            <div className="absolute top-8 right-8 px-5 py-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold shadow-lg shadow-red-600/35">
              One-time
            </div>
            <div className="text-center sm:text-left mb-12">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">
                Lifetime Safety
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                Simple pricing for a service that can save your life.{' '}
                <span className="font-semibold text-red-600 dark:text-red-500">
                  Free for the first 1000 customers.
                </span>
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl sm:text-7xl font-black text-zinc-900 dark:text-white">
                    ₹299
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">/one-time after first 1000</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Instant Activation',
                    'Up to 3 Contacts',
                    'Custom QR Design',
                    'Lifetime Access',
                    'No Monthly Fees',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 text-base"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-red-100 dark:bg-red-950/50 mb-6">
                  <QrCode className="w-16 h-16 text-red-600 dark:text-red-500" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  Start protecting yourself and your family today.
                </p>
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="block w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 rounded-2xl font-bold shadow-3d hover:shadow-3d-hover transition-all duration-300 btn-3d"
                  >
                    Activate Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </Card3D>
        </div>
      </MotionSection>
    </div>
  );
}
