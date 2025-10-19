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
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
              isDark 
                ? "text-neutral-100 bg-gradient-to-r from-neutral-800 to-neutral-700 border border-neutral-600" 
                : "text-gray-800 bg-gradient-to-r from-white to-gray-50 border border-gray-200"
            }`}>
              <span className="text-lg">📊</span>
              סה״כ: {totalCount}
            </div>
            {summaryItems.map((it, idx) => (
              <div
                key={`${it.label}-${idx}`}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-transform hover:scale-105 ${getAspectColor(it.label, isDark)}`}
              >
                {it.glyph && <span className="text-base">{it.glyph}</span>}
                <span>{it.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? "bg-black/20 text-neutral-300" : "bg-white/60 text-gray-600"
                }`}>
                  {it.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`mb-6 p-6 rounded-xl text-center ${
          isDark 
            ? "bg-neutral-800 border border-neutral-700 text-neutral-400" 
            : "bg-gray-50 border border-gray-200 text-gray-600"
        }`}>
          <span className="text-4xl mb-2 block">🌌</span>
          <p className="text-sm font-medium">אין היבטים לתצוגה</p>
        </div>
      )}
      
      {totalCount > 0 && (
        <div className={`rounded-xl overflow-hidden border shadow-sm ${
          isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"
        }`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${
                isDark 
                  ? "bg-gradient-to-r from-neutral-800 to-neutral-700" 
                  : "bg-gradient-to-r from-gray-50 to-gray-100"
              }`}>
                <tr>
                  <th className={`py-4 px-6 text-right font-semibold ${
                    isDark ? "text-neutral-100" : "text-gray-900"
                  }`}>
                    פלנטה ראשונה
                  </th>
                  <th className={`py-4 px-6 text-center font-semibold ${
                    isDark ? "text-neutral-100" : "text-gray-900"
                  }`}>
                    סוג היבט
                  </th>
                  <th className={`py-4 px-6 text-right font-semibold ${
                    isDark ? "text-neutral-100" : "text-gray-900"
                  }`}>
                    פלנטה שנייה
                  </th>
                  <th className={`py-4 px-6 text-center font-semibold ${
                    isDark ? "text-neutral-100" : "text-gray-900"
                  }`}>
                    אורב
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {niceAspects.map((a, i) => {
                  const aspectColorClass = getAspectColor(a.type, isDark);
                  return (
                    <tr 
                      key={i} 
                      className={`transition-colors hover:bg-opacity-50 ${
                        isDark 
                          ? "hover:bg-neutral-700/30" 
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className={`text-xl ${
                              isDark ? "text-amber-300" : "text-amber-600"
                            }`}>
                              {a.p1Glyph}
                            </span>
                            <span className={`font-medium ${
                              isDark ? "text-neutral-200" : "text-gray-900"
                            }`}>
                              {a.p1}
                            </span>
                          </div>
                          {(a.p1Sign || a.p1SignGlyph) && (
                            <div className={`mt-1 mr-8 flex items-center gap-2 text-xs ${
                              isDark ? "text-neutral-400" : "text-gray-500"
                            }`}>
                              {a.p1SignGlyph && <span className="text-sm">{a.p1SignGlyph}</span>}
                              {a.p1Sign && <span>{a.p1Sign}</span>}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm ${aspectColorClass}`}>
                          <span className="text-lg">{a.typeGlyph}</span>
                          <span className="text-sm">{a.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className={`text-xl ${
                              isDark ? "text-amber-300" : "text-amber-600"
                            }`}>
                              {a.p2Glyph}
                            </span>
                            <span className={`font-medium ${
                              isDark ? "text-neutral-200" : "text-gray-900"
                            }`}>
                              {a.p2}
                            </span>
                          </div>
                          {(a.p2Sign || a.p2SignGlyph) && (
                            <div className={`mt-1 mr-8 flex items-center gap-2 text-xs ${
                              isDark ? "text-neutral-400" : "text-gray-500"
                            }`}>
                              {a.p2SignGlyph && <span className="text-sm">{a.p2SignGlyph}</span>}
                              {a.p2Sign && <span>{a.p2Sign}</span>}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-mono ${
                          isDark 
                            ? "bg-neutral-700 text-neutral-300 border border-neutral-600" 
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                          {a.orb}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
