"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { navigationLinks } from "./navigationLinks";
import useHaederControl from "./useHaederControl";
import MegaMenu3 from "./MegaMenu3";
import { cn } from "@/lib/utils";

export default function Header3() {
  const control = useHaederControl();
  const { isOpen, openIndex, openPanel, scheduleClose, clearCloseTimer } =
    control;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900">
      {/* לוגו ומחלקות */}
      <div className="relative h-16 px-6 border-b lg:px-10 flex items-center gap-6">
        <Logo />

        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {navigationLinks.map((link, i) => (
            <Button
              variant="ghost"
              key={link.label ?? i}
              onMouseEnter={() => openPanel(i)}
              onFocus={() => openPanel(i)}
              className={cn(
                isOpen && openIndex === i
                  ? "bg-neutral-100 text-neutral-900"
                  : "hover:bg-neutral-100 text-neutral-700"
              )}
              aria-expanded={isOpen && openIndex === i}
              aria-haspopup="menu"
              aria-controls="mega-panel"
            >
              {link.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* מגה-פאנל מקבל את ה-state בפרופס */}
      <MegaMenu3 control={control} />
    </header>
  );
}
