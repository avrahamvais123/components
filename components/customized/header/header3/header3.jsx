"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { navigationLinks } from "./navigationLinks";
import useHaederControl from "./useHaederControl";
import MegaMenu3 from "./MegaMenu3";

export default function Header3() {
  const {
    isOpen,
    openIndex,
    openPanel,
    scheduleClose,
    clearCloseTimer,
  } = useHaederControl();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-900">
      {/* לוגו ומחלקות */}
      <div className="relative h-16 px-6 lg:px-10 flex items-center gap-6">
        {/* לוגו */}
        <Logo />

        {/* מחלקות */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
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
      <MegaMenu3 />
    </header>
  );
}
