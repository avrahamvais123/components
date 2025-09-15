"use client";

import React from "react";
import { Logo } from "../logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHover } from "@uidotdev/usehooks";
import { useDeepSignal, peek } from "deepsignal/react";
import { useSignals } from "@preact/signals-react/runtime";

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

const Header3 = () => {
  useSignals(); // חשוב כדי ש-React "ישמע" לקריאות לסיגנלים בזמן רנדר
  const signals = useDeepSignal({ index: null });
  console.log("signals: ", signals);
  

  return (
    <div className="h-16 px-10 flex items-center gap-10 bg-white">
      {/* logo */}
      <Logo />

      {/* departments */}
      <div className="center">
        {navigationLinks.map((link, index) => {
          return (
            <div key={index} className="relative group">
              <Link
                onMouseEnter={() => {
                  signals.index = index;
                  console.log("signals: ");
                }}
                href={link.href ? link.href : "#"}
              >
                <Button variant="ghost">{link.label}</Button>
              </Link>
              {/* submenu */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header3;
