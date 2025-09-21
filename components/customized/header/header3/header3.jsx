"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "../logo";
import { navigationLinks } from "./navigationLinks";
import useHaederControl from "./useHaederControl";
import MegaMenu3 from "./MegaMenu3";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cart } from "@/lib/signals-store";
import { useSignals } from "@preact/signals-react/runtime";

export default function Header3() {
  useSignals();
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
        <Link href="/">
          <Logo />
        </Link>

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

        <button className="relative">
          <ShoppingCart className="size-6 text-foreground/70" />
          {cart.length > 0 && <Badge  className="absolute top-0 left-0 -translate-1/2 bg-red-600 text-white center rounded-full w-4 aspect-square text-[0.5rem]">{cart.length}</Badge>}
        </button>
      </div>

      {/* מגה-פאנל מקבל את ה-state בפרופס */}
      <MegaMenu3 control={control} />
    </header>
  );
}
