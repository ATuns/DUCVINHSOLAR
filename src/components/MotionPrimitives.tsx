import React from 'react';
import { motion } from 'motion/react';

export const EXPO_EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
}

/**
 * Animates immediately on initial page mount (for above-the-fold elements).
 */
export const MountReveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.58,
  y = 20,
  x = 0,
  scale = 0.985,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ duration, delay, ease: EXPO_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealProps extends RevealProps {
  amount?: number;
}

/**
 * Animates smoothly once when scrolled into the viewport (for below-the-fold sections & cards).
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.62,
  y = 26,
  x = 0,
  scale = 0.985,
  amount = 0.08,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EXPO_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
