"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "בית", href: "/" },
  { label: "מחשבון מזלות", href: "/astro-simple" },
  { label: "מוצרים", href: "/products" },
  { label: "קטגוריות", href: "/categories" },
  { label: "אודות", href: "/about" },
];

export default function Header4() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b">
      <div className="h-16 px-4 sm:px-6 lg:px-10 flex items-center gap-4">
        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="פתח תפריט">
                <span className="i-lucide-menu size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-2" dir="rtl">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800",
                        isActive && "bg-neutral-200 dark:bg-neutral-800/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex-1 lg:flex-none">
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 lg:gap-2" dir="rtl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined}>
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:bg-neutral-100 text-foreground/80",
                    isActive && "bg-neutral-200 dark:bg-neutral-800/60"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Avatar (placeholder) */}
        <Link href="/login" className={cn("ml-auto lg:mr-auto lg:ml-0 inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800")}> 
          <span className="i-lucide-user size-5" />
          <span className="hidden sm:inline text-sm">התחבר</span>
        </Link>
      </div>
    </header>
  );
}
