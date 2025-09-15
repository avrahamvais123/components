"use client";

import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Logo } from "../logo";
import Link from "next/link";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  {
    label: "מוצרי מזון יבש",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "פסטה, אורז ודגנים",
        description: "מבחר פסטות, אורז ודגנים יבשים.",
      },
      {
        href: "#",
        label: "קמח וסוכר",
        description: "קמחים וסוגי סוכר לאפייה ובישול.",
      },
      {
        href: "#",
        label: "קטניות ושימורים",
        description: "עדשים, שעועית, חומוס ושימורי ירקות.",
      },
      {
        href: "#",
        label: "חטיפים וממתקים",
        description: "ביסקוויטים, שוקולד, וחטיפים מלוחים.",
      },
      { href: "#", label: "קפה, תה ושוקו", description: "מגוון משקאות חמים." },
    ],
  },
  {
    label: "מוצרי חלב",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "חלב ומשקאות חלב",
        description: "חלב טרי ומשקאות חלב שונים.",
      },
      {
        href: "#",
        label: "גבינות",
        description: "גבינות קשות, רכות וגבינות שמנת.",
      },
      { href: "#", label: "יוגורטים", description: "יוגורטים במגוון טעמים." },
      { href: "#", label: "חמאה ומרגרינה", description: "למאפים ובישול." },
    ],
  },
  {
    label: "בשר ודגים",
    submenu: true,
    type: "description",
    items: [
      { href: "#", label: "בשר טרי", description: "נתחי בשר מובחרים." },
      { href: "#", label: "עוף", description: "חזה עוף, כנפיים ושוקיים." },
      { href: "#", label: "דגים", description: "דגים טריים וקפואים." },
      { href: "#", label: "מוצרי מעדניה", description: "נקניקים ונקניקיות." },
    ],
  },
  {
    label: "פירות וירקות",
    submenu: true,
    type: "description",
    items: [
      { href: "#", label: "ירקות טריים", description: "מבחר ירקות יומיומיים." },
      { href: "#", label: "פירות עונתיים", description: "פירות בהתאם לעונה." },
      {
        href: "#",
        label: "עשבי תיבול",
        description: "בזיליקום, פטרוזיליה, כוסברה ועוד.",
      },
    ],
  },
  {
    label: "מאפייה",
    submenu: true,
    type: "description",
    items: [
      { href: "#", label: "לחמים", description: "לחמים טריים." },
      { href: "#", label: "חלות", description: "חלות לשבת." },
      {
        href: "#",
        label: "עוגות ועוגיות",
        description: "מבחר מתוקים מהמאפייה.",
      },
    ],
  },
  {
    label: "קפואים",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "ירקות קפואים",
        description: "אפונה, תירס, שעועית ועוד.",
      },
      { href: "#", label: "פיצות קפואות", description: "פתרון מהיר לארוחה." },
      {
        href: "#",
        label: "גלידות וקינוחים",
        description: "שלל טעמים לכל המשפחה.",
      },
    ],
  },
  {
    label: "שתייה",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "מים מינרליים",
        description: "בקבוקים גדולים וקטנים.",
      },
      { href: "#", label: "משקאות קלים", description: "קולה, ספרייט ועוד." },
      { href: "#", label: "מיצים", description: "מיצים טבעיים וסחוטים." },
      {
        href: "#",
        label: "אלכוהול ובירות",
        description: "יינות, בירות ומשקאות חריפים.",
      },
    ],
  },
  {
    label: "ניקוי וטואלטיקה",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "חומרי ניקוי לבית",
        description: "ניקוי רצפות, מטבח וחדרי אמבטיה.",
      },
      { href: "#", label: "סבונים ושמפו", description: "היגיינה יומיומית." },
      {
        href: "#",
        label: "מוצרי היגיינה",
        description: "נייר טואלט, מגבונים ועוד.",
      },
    ],
  },
  {
    label: "מוצרים לבית",
    submenu: true,
    type: "description",
    items: [
      {
        href: "#",
        label: "כלי פלסטיק ונייר",
        description: "צלחות, כוסות וסכו״ם חד פעמי.",
      },
      { href: "#", label: "סוללות", description: "סוללות לכל סוגי המכשירים." },
      {
        href: "#",
        label: "כלי מטבח פשוטים",
        description: "סירים, מחבתות וכלי בסיס.",
      },
    ],
  },
];

export default function Header2() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      {link.submenu ? (
                        <>
                          <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                            {link.label}
                          </div>
                          <ul>
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink
                                  href={item.href}
                                  className="py-1.5"
                                >
                                  {item.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavigationMenuLink href={link.href} className="py-1.5">
                          {link.label}
                        </NavigationMenuLink>
                      )}
                      {/* Add separator between different types of items */}
                      {index < navigationLinks.length - 1 &&
                        // Show separator if:
                        // 1. One is submenu and one is simple link OR
                        // 2. Both are submenus but with different types
                        ((!link.submenu &&
                          navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            !navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            navigationLinks[index + 1].submenu &&
                            link.type !== navigationLinks[index + 1].type)) && (
                          <div
                            role="separator"
                            aria-orientation="horizontal"
                            className="bg-border -mx-1 my-1 h-px w-full"
                          />
                        )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>

            {/* Navigation menu */}
            <NavigationMenu viewport={false} className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-64"
                                : "min-w-48"
                            )}
                          >
                            {link.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <NavigationMenuLink
                                  href={item.href}
                                  className="py-1.5"
                                >
                                  {/* Display icon if present */}
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2">
                                      {item.icon === "BookOpenIcon" && (
                                        <BookOpenIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "LifeBuoyIcon" && (
                                        <LifeBuoyIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {item.icon === "InfoIcon" && (
                                        <InfoIcon
                                          size={16}
                                          className="text-foreground opacity-60"
                                          aria-hidden="true"
                                        />
                                      )}
                                      <span>{item.label}</span>
                                    </div>
                                  )}

                                  {/* Display label with description if present */}
                                  {link.type === "description" &&
                                  "description" in item ? (
                                    <div className="space-y-1">
                                      <div className="font-medium">
                                        {item.label}
                                      </div>
                                      <p className="text-muted-foreground line-clamp-2 text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  ) : (
                                    // Display simple label if not icon or description type
                                    !link.type ||
                                    (link.type !== "icon" &&
                                      link.type !== "description" && (
                                        <span>{item.label}</span>
                                      ))
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        href={link.href}
                        className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href="#">כניסה</Link>
          </Button>
          <Button asChild size="sm" className="text-sm">
            <Link href="#">התחל</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
