"use client";

import { AnimatePresence, motion } from "framer-motion";
import { panelVariants } from "./animationConfig";
import { cn } from "@/lib/utils";
import MegaMenuImage from "./MegaMenuImage";
import MegaMenueItems from "./MegaMenueItems";
import { watch } from "hyperactiv/react";

function MegaMenu3Component({ control }) {
  const { isOpen, setIsOpen, current, scheduleClose, clearCloseTimer } =
    control;
  const hasMenu = current?.submenu || (current?.items?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && hasMenu && (
        <motion.div
          layout
          id="mega-panel"
          key="mega-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          role="menu"
          aria-label={current?.label ?? "מגה תפריט"}
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 28 },
          }}
          className={cn(
            "absolute inset-x-0 top-16 z-40 p-3 lg:p-4 overflow-hidden",
            "grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-3",
            "border border-t-0 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900",
            "shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)]"
          )}
        >
          {/* image-hero */}
          <MegaMenuImage current={current} setIsOpen={setIsOpen} />

          {/* items */}
          <MegaMenueItems current={current} setIsOpen={setIsOpen} />

          <div className="col-span-full flex items-center justify-end gap-2 px-1 pt-1">
            {/* הכפתורים שלך */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default watch(MegaMenu3Component);
