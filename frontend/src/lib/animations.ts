import { Variants, Transition } from 'framer-motion';

/**
 * Curated Spring and Easing Presets for Mal'abna
 */
export const transitions: Record<string, Transition> = {
  springSmooth: {
    type: 'spring',
    stiffness: 320,
    damping: 26,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 420,
    damping: 18,
  },
  springSnappy: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  },
  fadeFast: {
    type: 'tween',
    duration: 0.2,
    ease: 'easeInOut',
  },
  easeOutCubic: {
    type: 'tween',
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  },
};

/**
 * Parent Stagger Variants for Grids and Lists
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/**
 * Child Card Fade-up Variant
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Scale on Hover & Tap for Interactive Cards and Buttons
 */
export const interactiveCardMotion = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
  whileTap: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  },
};

export const interactiveButtonMotion = {
  whileHover: {
    scale: 1.03,
    transition: { type: 'spring', stiffness: 500, damping: 15 },
  },
  whileTap: {
    scale: 0.96,
    transition: { type: 'spring', stiffness: 600, damping: 20 },
  },
};

/**
 * Modal & Overlay Variants
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

/**
 * Bottom Floating Bar Variants
 */
export const floatingBarVariants: Variants = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: 70,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
