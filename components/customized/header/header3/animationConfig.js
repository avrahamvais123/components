const panelVariants = {
  hidden: { opacity: 0, y: 15, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.6 },
  },
  exit: {
    opacity: 0,
    y: 15,
    pointerEvents: "none",
    transition: { duration: 0.2 },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.6 },
  },
};

export { panelVariants, listVariants, itemVariants };
