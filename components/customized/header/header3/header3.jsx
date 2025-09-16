"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { navigationLinks } from "./navigationLinks";
import { panelVariants, listVariants, itemVariants } from "./animationConfig";
import useHaederControl from "./useHaederControl";

export default function Header3() {
  const {
    isOpen,
    setIsOpen,
    openIndex,
    current,
    openPanel,
    scheduleClose,
    clearCloseTimer,
  } = useHaederControl();

  return (
    <header className="sticky top-0 z-10 bg-white">
      {/* לוגו ומחלקות */}
      <div className="relative h-16 px-6 lg:px-10 flex items-center gap-6">
        {/* לוגו */}
        <Logo />

        {/* מחלקות */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          onMouseLeave={scheduleClose}
          onMouseEnter={clearCloseTimer}
        >
          {navigationLinks.map((link, i) => (
            <Button
              variant="ghost"
              key={i}
              onMouseEnter={() => openPanel(i)}
              onFocus={() => openPanel(i)}
              className={
                isOpen && openIndex === i
                  ? "bg-neutral-100 text-neutral-900"
                  : "hover:bg-neutral-100 text-neutral-700"
              }
              aria-expanded={isOpen && openIndex === i}
              aria-haspopup="menu"
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* מגה-פאנל */}
      <AnimatePresence>
        {isOpen && current && current.submenu && (
          <motion.div
            key="mega-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-x-0 top-16 z-40"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            {/* הצללה דקה */}
            <div className="border border-zinc-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-3 lg:p-4">
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3"
                  role="menu"
                >
                  {current.items?.map((item, idx) => (
                    <motion.li
                      key={idx}
                      variants={itemVariants}
                      className="group rounded-xl border border-transparent hover:border-zinc-200 hover:bg-zinc-50 p-3 lg:p-4"
                      role="none"
                    >
                      <Link
                        href={item.href || "#"}
                        role="menuitem"
                        className="block"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium text-zinc-900 leading-6">
                            {item.label}
                          </h4>
                          <span className="opacity-0 group-hover:opacity-100 transition text-zinc-400">
                            ↗
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-zinc-600 leading-5">
                            {item.description}
                          </p>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* שורת כפתורים אופציונלית */}
                <div className="col-span-full flex items-center justify-end gap-2 px-1 pt-1">
                  <Link href="/deals">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                    >
                      דילים חמים 🔥
                    </Button>
                  </Link>
                  <Link href="/catalog">
                    <Button size="sm" className="rounded-full">
                      לכל המחלקות ➜
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
