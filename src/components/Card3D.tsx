'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

const defaultTransition = { duration: 0.35, ease: [0.33, 1, 0.68, 1] };

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  /** Enable subtle tilt on mouse move (default true) */
  tilt?: boolean;
  /** Enable lift + shadow on hover (default true) */
  lift?: boolean;
  /** Optional initial animation */
  initial?: object;
  animate?: object;
  transition?: object;
  as?: keyof typeof motion;
}

export function Card3D({
  children,
  className = '',
  tilt = true,
  lift = true,
  initial,
  animate,
  transition = defaultTransition,
  as: Component = motion.div,
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const z = useMotionValue(0);
  const shadow = useMotionValue(0);

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${z}px)`;
  const boxShadow = useMotionTemplate`
    0 ${shadow}px ${shadow}px -${shadow}px rgba(0,0,0,0.18),
    0 6px 12px -2px rgba(0,0,0,0.08),
    0 16px 32px -12px rgba(0,0,0,0.14)
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(-y * 6);
    rotateY.set(x * 6);
    if (lift) {
      z.set(12);
      shadow.set(28);
    }
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
    shadow.set(0);
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        transform,
        boxShadow: lift ? boxShadow : undefined,
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={lift && !tilt ? { y: -4, transition: { duration: 0.25 } } : undefined}
    >
      {children}
    </Component>
  );
}
