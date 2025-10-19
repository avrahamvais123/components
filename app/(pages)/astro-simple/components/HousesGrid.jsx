"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function HousesGrid({ niceHouses }) {
  const { isDark } = useThemeState();
  
  if (!niceHouses || niceHouses.length !== 12) return null;

  return (
    <div>
  <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>תחילת הבתים</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {niceHouses.map((h) => (
          <div 
            key={h.num} 
            className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
              isDark 
                ? "border-neutral-700 bg-neutral-900 hover:border-neutral-600" 
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            {/* כותרת הבית */}
            <div className={`px-4 py-3 border-b ${
              isDark ? "border-neutral-700 bg-neutral-800/50" : "border-neutral-200 bg-neutral-50/50"
            }`}>
              <div className={`font-bold text-lg ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>
                בית {h.num}
              </div>
            </div>

            {/* תוכן הבית */}
            <div className="p-4 space-y-3">
              {/* מזל ומעלות */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xl ${isDark ? "text-amber-300" : "text-amber-600"}`}>
                    {h.signGlyph}
                  </span>
                  <span className={`font-medium ${isDark ? "text-neutral-200" : "text-neutral-700"}`}>
                    {h.sign}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                  isDark 
                    ? "bg-neutral-700 text-neutral-300" 
                    : "bg-neutral-100 text-neutral-600"
                }`}>
                  {h.degFmt}
                </span>
              </div>

              {/* פלנטות */}
              {Array.isArray(h.occupantGlyphs) && h.occupantGlyphs.length > 0 && (
                <div>
                  <div className={`text-xs font-medium mb-2 ${
                    isDark ? "text-neutral-400" : "text-neutral-500"
                  }`}>
                    פלנטות
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {h.occupantGlyphs.map((o, idx) => (
                      <span 
                        key={idx} 
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-lg font-bold transition-colors ${
                          isDark 
                            ? "bg-blue-900/30 text-blue-300 border border-blue-800/50" 
                            : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}
                        title={o.name || 'פלנטה'}
                      >
                        {o.glyph}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* אם אין פלנטות */}
              {(!Array.isArray(h.occupantGlyphs) || h.occupantGlyphs.length === 0) && (
                <div className={`text-xs italic ${
                  isDark ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  אין פלנטות בבית זה
                </div>
              )}
            </div>

            {/* אפקט דקורטיבי */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              isDark ? "bg-blue-500/50" : "bg-blue-500"
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
}
