"use client";

import { useThemeState } from "../../../hooks/useThemeState";
import { ELEMENT_NAME_HE, QUALITY_NAME_HE } from "../utils/sources";

export default function StatsTable({ elementStats, qualityStats }) {
  const { isDark } = useThemeState();

  const rows = [
    ...["fire", "earth", "air", "water"].map((k) => ({
      group: "יסוד",
      key: k,
      name: ELEMENT_NAME_HE[k],
      emoji: k === "fire" ? "🔥" : k === "earth" ? "🌍" : k === "air" ? "💨" : "💧",
      percent: elementStats?.percents?.[k] ?? 0,
    })),
    ...["cardinal", "fixed", "mutable"].map((k) => ({
      group: "איכות",
      key: k,
      name: QUALITY_NAME_HE[k],
      emoji: k === "cardinal" ? "🚀" : k === "fixed" ? "🛡️" : "🔄",
      percent: qualityStats?.percents?.[k] ?? 0,
    })),
  ];

  return (
    <div className={`w-full h-full rounded-xl border ${isDark ? "border-neutral-700 bg-neutral-800" : "border-neutral-200 bg-white"} flex flex-col overflow-hidden`}>
      {/* כותרת קבועה */}
      <div className={`${isDark ? "bg-neutral-800" : "bg-neutral-50"} border-b shadow-sm ${isDark ? 'border-neutral-600 shadow-neutral-900/50' : 'border-neutral-300 shadow-neutral-200/50'} flex-shrink-0`}>
        <div className="flex">
          <div className={`py-1.5 px-2 text-right font-semibold w-20 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>קטגוריה</div>
          <div className={`py-1.5 px-2 text-right font-semibold flex-1 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>שם</div>
          <div className={`py-1.5 px-2 text-center font-semibold w-16 ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>%</div>
        </div>
      </div>
      
      {/* תוכן עם גלילה */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {rows.map((r) => (
            <div key={`${r.group}-${r.key}`} className={`flex ${isDark ? "hover:bg-neutral-700/30" : "hover:bg-neutral-50"}`}>
              <div className="py-1.5 px-2 w-20">
                <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>{r.group}</span>
              </div>
              <div className="py-1.5 px-2 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={isDark ? "text-neutral-200" : "text-neutral-900"}>{r.emoji}</span>
                  <span className={isDark ? "text-neutral-200 font-medium" : "text-neutral-900 font-medium"}>{r.name}</span>
                </div>
              </div>
              <div className="py-1.5 px-2 text-center w-16 flex items-center justify-center">
                <span className={isDark ? "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-700 text-neutral-300 border border-neutral-600" : "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-100 text-neutral-700 border border-neutral-200"}>
                  {r.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
