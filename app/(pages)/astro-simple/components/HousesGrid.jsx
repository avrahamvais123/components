"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function HousesGrid({ niceHouses }) {
  const { isDark } = useThemeState();
  
  if (!niceHouses || niceHouses.length !== 12) return null;

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>קאספים של הבתים</h2>
      <div className="grid md:grid-cols-3 gap-2">
        {niceHouses.map((h) => (
          <div key={h.num} className={`border rounded p-3 ${isDark ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"}`}>
            <div className={`font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
              בית {h.labelHe} ({h.num})
            </div>
            <div className={isDark ? "text-neutral-200" : "text-gray-700"}>
              מזל:{" "}
              <span className="inline-flex items-center gap-2">
                <span>{h.signGlyph}</span>
                <span>{h.sign}</span>
              </span>
            </div>
            <div className={isDark ? "text-neutral-200" : "text-gray-700"}>מעלה: {h.degFmt}</div>
            {Array.isArray(h.occupantGlyphs) && h.occupantGlyphs.length > 0 && (
              <div className={isDark ? "text-neutral-200" : "text-gray-700"}>
                פלנטות: {" "}
                <span className="inline-flex flex-wrap gap-2 align-middle">
                  {h.occupantGlyphs.map((g, idx) => (
                    <span key={idx} className="text-lg leading-none">{g}</span>
                  ))}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
