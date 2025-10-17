"use client";

import { useThemeState } from "../../../hooks/useThemeState";

// צבעים להיבטים השונים
const ASPECT_COLORS = {
  // היבטים חיוביים
  conjunction: {
    light: "text-blue-600 bg-blue-50",
    dark: "text-blue-300 bg-blue-950/30"
  },
  trine: {
    light: "text-green-600 bg-green-50", 
    dark: "text-green-300 bg-green-950/30"
  },
  sextile: {
    light: "text-emerald-600 bg-emerald-50",
    dark: "text-emerald-300 bg-emerald-950/30"
  },
  // היבטים מאתגרים
  opposition: {
    light: "text-red-600 bg-red-50",
    dark: "text-red-300 bg-red-950/30"
  },
  square: {
    light: "text-orange-600 bg-orange-50",
    dark: "text-orange-300 bg-orange-950/30"
  },
  // היבטים קלים
  semisextile: {
    light: "text-cyan-600 bg-cyan-50",
    dark: "text-cyan-300 bg-cyan-950/30"
  },
  quincunx: {
    light: "text-purple-600 bg-purple-50",
    dark: "text-purple-300 bg-purple-950/30"
  },
  // היבטים נוספים
  semisquare: {
    light: "text-yellow-600 bg-yellow-50",
    dark: "text-yellow-300 bg-yellow-950/30"
  },
  sesquiquadrate: {
    light: "text-pink-600 bg-pink-50",
    dark: "text-pink-300 bg-pink-950/30"
  },
  quintile: {
    light: "text-indigo-600 bg-indigo-50",
    dark: "text-indigo-300 bg-indigo-950/30"
  },
  biquintile: {
    light: "text-violet-600 bg-violet-50",
    dark: "text-violet-300 bg-violet-950/30"
  },
  // ברירת מחדל
  default: {
    light: "text-gray-600 bg-gray-50",
    dark: "text-neutral-300 bg-neutral-950/30"
  }
};

// פונקציה לקבלת צבע לפי סוג היבט
const getAspectColor = (aspectType, isDark) => {
  if (!aspectType) return isDark ? ASPECT_COLORS.default.dark : ASPECT_COLORS.default.light;
  
  const normalizedType = aspectType.toLowerCase().trim();
  
  // מיפוי תרגומים עבריים לאנגלית
  const hebrewToEnglish = {
    'צירוף': 'conjunction',
    'צמידות': 'conjunction',
    'התנגדות': 'opposition',
    'מולות': 'opposition', 
    'ריבוע': 'square',
    'משולש': 'trine',
    'טריגון': 'trine',
    'טריין': 'trine',
    'משושה': 'sextile',
    'סקסטיל': 'sextile',
    'שישית': 'sextile',
    'חצי-משושה': 'semisextile',
    'חצי־שישית': 'semisextile',
    'חמישון': 'quincunx',
    'קווינקוקס': 'quincunx',
    'קווינקנקס': 'quincunx',
    // אנגלית גם כן
    'conjunction': 'conjunction',
    'opposition': 'opposition',
    'square': 'square',
    'trine': 'trine',
    'sextile': 'sextile',
    'semisextile': 'semisextile',
    'quincunx': 'quincunx'
  };
  
  // בדוק אם זה תרגום עברי או אנגלי
  // הסרה של מעלות ופרטים נוספים (כל מה שאחרי הרווח הראשון או סוגריים)
  const cleanType = normalizedType.split(/[\s\(]/)[0];
  
  // בדיקה ישירה במיפוי
  let englishType = hebrewToEnglish[cleanType] || hebrewToEnglish[normalizedType] || cleanType;
  
  // בדיקה אם המחרוזת מכילה מילים מוכרות
  if (!hebrewToEnglish[cleanType] && !hebrewToEnglish[normalizedType]) {
    for (const [hebrew, english] of Object.entries(hebrewToEnglish)) {
      if (normalizedType.includes(hebrew)) {
        englishType = english;
        break;
      }
    }
  }
  
  const colorScheme = ASPECT_COLORS[englishType] || ASPECT_COLORS.default;
  return isDark ? colorScheme.dark : colorScheme.light;
};

export default function AspectsTable({ niceAspects }) {
  const { isDark } = useThemeState();
  // חישוב סיכום לפי סוג היבט
  const byType = new Map();
  if (Array.isArray(niceAspects)) {
    for (const a of niceAspects) {
      const key = String(a?.type || "").toLowerCase().trim();
      if (!key) continue;
      const prev = byType.get(key) || { count: 0, label: a.type, glyph: a.typeGlyph };
      byType.set(key, { count: prev.count + 1, label: prev.label || a.type, glyph: prev.glyph || a.typeGlyph });
    }
  }
  const summaryItems = Array.from(byType.values());
  const totalCount = Array.isArray(niceAspects) ? niceAspects.length : 0;
  return (
    <div>
      {/* סיכום לפי סוג היבט + סה"כ */}
      {totalCount > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2 items-center">
          <span
            className={
              `inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ` +
              (isDark ? "text-neutral-100 bg-neutral-800" : "text-gray-800 bg-gray-100")
            }
          >
            סה״כ: {totalCount}
          </span>
          {summaryItems.map((it, idx) => (
            <span
              key={`${it.label}-${idx}`}
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium ${getAspectColor(it.label, isDark)}`}
            >
              {it.glyph && <span>{it.glyph}</span>}
              <span>{it.label}</span>
              <span className={isDark ? "text-neutral-300/80" : "text-gray-700/80"}>({it.count})</span>
            </span>
          ))}
        </div>
      ) : (
        <p className={"mb-3 text-sm " + (isDark ? "text-neutral-400" : "text-gray-600")}>
          אין היבטים לתצוגה (סה״כ: 0)
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className={isDark ? "bg-neutral-900" : "bg-gray-50"}>
            <tr>
              <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>פלנטה 1</th>
              <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>סוג</th>
              <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>פלנטה 2</th>
              <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>אורב</th>
            </tr>
          </thead>
          <tbody>
            {niceAspects.map((a, i) => {
              const aspectColorClass = getAspectColor(a.type, isDark);
              return (
                <tr key={i} className={isDark ? "bg-neutral-950 even:bg-neutral-900/50" : "bg-white even:bg-gray-50"}>
                  <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <span>{a.p1Glyph}</span>
                      <span>{a.p1}</span>
                      {(a.p1Sign || a.p1SignGlyph) && (
                        <>
                          <span className={isDark ? "mx-3 text-neutral-500" : "mx-3 text-gray-400"}>·</span>
                          <span className="inline-flex items-center gap-1">
                            {a.p1SignGlyph && <span>{a.p1SignGlyph}</span>}
                            {a.p1Sign && <span>{a.p1Sign}</span>}
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className={`p-2 border ${isDark ? "border-neutral-700" : "border-gray-200"}`}>
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md font-medium ${aspectColorClass}`}>
                      <span>{a.typeGlyph}</span>
                      <span>{a.type}</span>
                    </span>
                  </td>
                  <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <span>{a.p2Glyph}</span>
                      <span>{a.p2}</span>
                      {(a.p2Sign || a.p2SignGlyph) && (
                        <>
                          <span className={isDark ? "mx-3 text-neutral-500" : "mx-3 text-gray-400"}>·</span>
                          <span className="inline-flex items-center gap-1">
                            {a.p2SignGlyph && <span>{a.p2SignGlyph}</span>}
                            {a.p2Sign && <span>{a.p2Sign}</span>}
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>{a.orb}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
