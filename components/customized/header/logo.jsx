import { cn } from "@/lib/utils";
import Link from "next/link";

// לוגו אסטרולוגי עם וריאציות: "sun" (דיפולט) ו-"crescent"
export const Logo = ({ imageClassName, wrapperClassName, variant = "sun" }) => {
  const commonSvgCls = cn("h-8 w-8 text-gray-900 dark:text-neutral-100", imageClassName);

  const SunLogo = (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={commonSvgCls} role="img" aria-label="Astrology sun logo">
      {/* עיגול מרכזי */}
      <circle cx="16" cy="16" r="6" fill="currentColor" />
      {/* קרניים (8) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="2.5" x2="16" y2="7" />
        <line x1="16" y1="25" x2="16" y2="29.5" />
        <line x1="2.5" y1="16" x2="7" y2="16" />
        <line x1="25" y1="16" x2="29.5" y2="16" />
        <line x1="6.2" y1="6.2" x2="9.6" y2="9.6" />
        <line x1="22.4" y1="22.4" x2="25.8" y2="25.8" />
        <line x1="6.2" y1="25.8" x2="9.6" y2="22.4" />
        <line x1="22.4" y1="9.6" x2="25.8" y2="6.2" />
      </g>
    </svg>
  );

  const CrescentLogo = (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={commonSvgCls} role="img" aria-label="Astrology crescent logo">
      <defs>
        <mask id="crescent-cut">
          <rect x="0" y="0" width="32" height="32" fill="white" />
          <circle cx="19" cy="13" r="11" fill="black" />
        </mask>
      </defs>
      <circle cx="13" cy="16" r="11" fill="currentColor" mask="url(#crescent-cut)" />
      <circle cx="23.5" cy="7.5" r="1.6" fill="currentColor" />
    </svg>
  );

  const svg = variant === "crescent" ? CrescentLogo : SunLogo;

  return (
    <Link href="/" className={cn("h-10 w-auto inline-flex items-center", wrapperClassName)} aria-label="דף הבית">
      {svg}
    </Link>
  );
};
