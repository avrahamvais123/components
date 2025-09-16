"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { panelVariants, listVariants, itemVariants } from "./animationConfig";
import { cn } from "@/lib/utils";


export default function MegaMenu3({ control }) {
  const { isOpen, setIsOpen, current, scheduleClose, clearCloseTimer } =
    control;
  const hasMenu = current?.submenu || (current?.items?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && hasMenu && (
        <motion.div
          id="mega-panel"
          key="mega-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
          transition={{
            layout: { type: "spring", stiffness: 260, damping: 28 },
          }}
          className={cn(
            "absolute inset-x-0 top-16 z-40 p-3 lg:p-4 overflow-hidden",
            "grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-3",
            "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900",
            "shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)]"
          )}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          role="menu"
          aria-label={current?.label ?? "מגה תפריט"}
        >
          {current?.hero?.image && (
            <motion.aside
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="order-first lg:order-none lg:col-span-1"
              aria-hidden={false}
            >
              <Link
                href={current.hero?.ctaHref || "#"}
                className="group block h-full"
                onClick={() => setIsOpen(false)}
              >
                <div className="relative w-full aspect-[16/9] lg:aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={current.hero.image}
                    alt={current.hero.alt || ""}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 text-white">
                    {current.hero.eyebrow && (
                      <span className="inline-block text-xs/none px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                        {current.hero.eyebrow}
                      </span>
                    )}
                    {current.hero.title && (
                      <h3 className="mt-2 text-lg font-semibold drop-shadow">
                        {current.hero.title}
                      </h3>
                    )}
                    {current.hero.ctaLabel && (
                      <span className="mt-2 inline-flex items-center gap-1 text-sm underline underline-offset-4 decoration-white/60 group-hover:decoration-white">
                        {current.hero.ctaLabel} <span aria-hidden>↗</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.aside>
          )}

          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              current?.hero?.image ? "lg:col-span-3" : "col-span-full",
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3"
            )}
          >
            {current?.items?.map((item, idx) => (
              <motion.li
                key={item?.label ?? idx}
                variants={itemVariants}
                className="group rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-neutral-800 hover:bg-zinc-50 dark:hover:bg-neutral-800/60 p-3 lg:p-4"
              >
                <Link
                  href={item?.href || "#"}
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-100 leading-6">
                      {item?.label}
                    </h4>
                    <span className="opacity-0 group-hover:opacity-100 transition text-zinc-400">
                      ↗
                    </span>
                  </div>
                  {item?.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 leading-5">
                      {item.description}
                    </p>
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          <div className="col-span-full flex items-center justify-end gap-2 px-1 pt-1">
            {/* הכפתורים שלך */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
