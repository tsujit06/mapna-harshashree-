'use client';

import { motion } from 'framer-motion';

/** Use with MotionSection stagger: give your motion children these variants */
export const staggerChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
};

interface MotionSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Use when this section is a container for staggered children (children should be motion.* with variants={staggerChildVariants}) */
  stagger?: boolean;
  staggerDelay?: number;
  once?: boolean;
  variants?: object;
}

export function MotionSection({
  children,
  id,
  className = '',
  stagger = false,
  staggerDelay = 0.08,
  once = true,
  variants,
}: MotionSectionProps) {
  const sectionVariants =
    variants ??
    (stagger
      ? {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
          },
        }
      : {
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
        });

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      variants={sectionVariants}
    >
      {children}
    </motion.section>
  );
}

/** Single element fade-up with optional delay */
export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.33, 1, 0.68, 1] }}
    >
      {children}
    </motion.div>
  );
}
