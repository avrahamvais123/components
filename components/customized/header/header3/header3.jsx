"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { navigationLinks } from "./navigationLinks";
import useHaederControl from "./useHaederControl";
import MegaMenu3 from "./MegaMenu3";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CartModal from "../cart/CartModal";
import { watch } from "hyperactiv/react";

function Header3() {
  const control = useHaederControl();
  const {
    isOpen,
    openIndex,
    openPanel,
    scheduleClose,
    clearCloseTimer,
  } = control;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900">
      {/* לוגו ומחלקות */}
      <div className="relative h-16 px-6 border-b lg:px-10 flex items-center gap-6">
        <Logo />

        <nav
          className="hidden lg:flex items-center gap-1 lg:gap-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {navigationLinks.map((link, i) => (
            <Link
              key={link.label ?? i}
              onClick={(e) => openPanel(null)}
              onMouseEnter={() => openPanel(i)}
              onFocus={() => openPanel(i)}
              href={{ pathname: "/categories", query: { name: link.label } }}
            >
              <Button
                variant="ghost"
                className={cn(
                  isOpen && openIndex === i
                    ? "hover:bg-accent hover:text-accent-foreground dark:bg-accent/50"
                    : "hover:bg-neutral-100 text-foreground/70"
                )}
                aria-expanded={isOpen && openIndex === i}
                aria-haspopup="menu"
                aria-controls="mega-panel"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <CartModal />
      </div>

      {/* מגה-פאנל מקבל את ה-state בפרופס */}
      <MegaMenu3 control={control} />
    </header>
  );
}

export default watch(Header3);
