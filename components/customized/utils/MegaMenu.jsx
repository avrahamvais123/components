"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MENU = [
  {
    label: "רכיבים",
    columns: [
      {
        title: "UI בסיסי",
        links: [
          { label: "כפתורים", href: "/components/buttons" },
          { label: "טפסים", href: "/components/forms" },
          { label: "מודלים", href: "/components/modals" },
          { label: "טבלאות", href: "/components/tables" },
        ],
      },
      {
        title: "ניווט",
        links: [
          { label: "Navbar", href: "/components/navbar" },
          { label: "Breadcrumbs", href: "/components/breadcrumbs" },
          { label: "Tabs", href: "/components/tabs" },
          { label: "Accordion", href: "/components/accordion" },
        ],
      },
      {
        title: "שונות",
        links: [
          { label: "Toast", href: "/components/toast" },
          { label: "Tooltip", href: "/components/tooltip" },
          { label: "Cards", href: "/components/cards" },
          { label: "Avatars", href: "/components/avatars" },
        ],
      },
    ],
    featured: {
      title: "ספריית רכיבים יפה",
      subtitle: "מעוצב ב-Tailwind, עובד ב-Next",
      href: "/components",
      img: "/images/featured-components.jpg",
    },
  },
  {
    label: "פתרונות",
    columns: [
      {
        title: "איקומרס",
        links: [
          { label: "עמוד קטגוריה", href: "/solutions/ecommerce/category" },
          { label: "עמוד מוצר", href: "/solutions/ecommerce/product" },
          { label: "צ'ק-אאוט", href: "/solutions/ecommerce/checkout" },
        ],
      },
      {
        title: "בלוג",
        links: [
          { label: "עמוד בית", href: "/solutions/blog/home" },
          { label: "פוסט", href: "/solutions/blog/post" },
          { label: "תגיות", href: "/solutions/blog/tags" },
        ],
      },
    ],
    featured: {
      title: "תבניות מוכנות",
      subtitle: "התחלה מהירה לפרויקטים",
      href: "/solutions",
      img: "/images/featured-solutions.jpg",
    },
  },
];

const panelVariants = {
  hidden: { opacity: 0, y: -8, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeIn" } },
};

export default function MegaMenu({ className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);

  // מובייל = לחץ לפתיחה; דסקטופ = הובר
  useEffect(() => {
    const onResize = () =>
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // סגירה ב-Esc ובקליק בחוץ
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenIndex(null);
    const onClickOutside = (e) => {
      if (!navRef.current?.contains(e.target)) setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      dir="rtl"
      className={`relative z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
      aria-label="תפריט ראשי"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* לוגו / שם */}
        <Link href="/" className="font-semibold text-xl">
          ✨ הספרייה שלי
        </Link>

        {/* פריטי תפריט */}
        <ul className="hidden gap-2 lg:flex">
          {MENU.map((item, i) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => !isMobile && setOpenIndex(i)}
              onMouseLeave={() =>
                !isMobile && setOpenIndex((prev) => (prev === i ? null : prev))
              }
            >
              <button
                className={`group inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition`}
                aria-expanded={openIndex === i}
                onClick={() =>
                  isMobile
                    ? setOpenIndex(openIndex === i ? null : i)
                    : setOpenIndex(i)
                }
              >
                {item.label}
                <svg
                  className={`size-4 transition-transform ${
                    openIndex === i ? "-rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.177l3.71-2.946a.75.75 0 111.04 1.08l-4.24 3.37a.75.75 0 01-.94 0l-4.24-3.37a.75.75 0 01-.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* פאנל המגה-מניו */}
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    key="panel"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={panelVariants}
                    className="absolute right-0 mt-2 w-[min(90vw,72rem)]"
                  >
                    <div className="overflow-hidden rounded-2xl border bg-popover shadow-2xl">
                      <div className="grid grid-cols-1 lg:grid-cols-4">
                        {/* עמודות קישורים */}
                        <div className="col-span-3 grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                          {item.columns.map((col) => (
                            <div key={col.title} className="min-w-0">
                              <div className="mb-3 text-sm font-semibold text-muted-foreground">
                                {col.title}
                              </div>
                              <ul className="space-y-1.5">
                                {col.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="block truncate rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                                      onClick={() => setOpenIndex(null)}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Featured עם תמונה */}
                        <Link
                          href={item.featured.href}
                          className="group relative col-span-1 isolate block overflow-hidden border-t lg:border-t-0 lg:border-s"
                          onClick={() => setOpenIndex(null)}
                        >
                          <div className="absolute inset-0">
                            <Image
                              src={item.featured.img}
                              alt={item.featured.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 25vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                          </div>
                          <div className="relative z-10 p-5">
                            <div className="mb-1 text-xs text-muted-foreground">
                              {item.featured.subtitle}
                            </div>
                            <div className="text-lg font-bold">
                              {item.featured.title}
                            </div>
                            <div className="mt-3 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">
                              גלו עוד
                              <span aria-hidden>↗</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* מובייל טוגל */}
        <MobileToggle
          isOpen={openIndex !== null}
          onToggle={() => setOpenIndex(openIndex === 0 ? null : 0)}
          className="lg:hidden"
        />
      </div>

      {/* מובייל פאנל מלא */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t"
          >
            <div className="p-4 space-y-6">
              {MENU.map((group) => (
                <div key={group.label} className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.columns
                      .flatMap((c) => c.links)
                      .map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                          onClick={() => setOpenIndex(null)}
                        >
                          {l.label}
                        </Link>
                      ))}
                  </div>
                  {/* Featured קטן במובייל */}
                  <Link
                    href={group.featured.href}
                    className="block overflow-hidden rounded-xl border"
                    onClick={() => setOpenIndex(null)}
                  >
                    <div className="relative h-28 w-full">
                      <Image
                        src={group.featured.img}
                        alt={group.featured.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground">
                        {group.featured.subtitle}
                      </div>
                      <div className="text-sm font-medium">
                        {group.featured.title}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MobileToggle({ isOpen, onToggle, className = "" }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${className}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-mega"
    >
      {isOpen ? "סגירה" : "תפריט"}
      <svg
        className={`size-4 ${isOpen ? "rotate-90" : ""}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M3 5h14M3 10h14M3 15h14" />
      </svg>
    </button>
  );
}
