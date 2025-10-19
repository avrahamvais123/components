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
    <div className={`w-full h-full rounded-xl overflow-hidden border ${isDark ? "border-neutral-700 bg-neutral-800" : "border-neutral-200 bg-white"}`}>
      <div className="overflow-auto w-full h-full">
        <table className="w-full align-top">
          <thead className={isDark ? "bg-neutral-800" : "bg-neutral-50"}>
            <tr>
              <th className={`py-1.5 px-2 text-right font-semibold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>קטגוריה</th>
              <th className={`py-1.5 px-2 text-right font-semibold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>שם</th>
              <th className={`py-1.5 px-2 text-center font-semibold ${isDark ? "text-neutral-100" : "text-neutral-900"}`}>%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {rows.map((r) => (
              <tr key={`${r.group}-${r.key}`} className={isDark ? "hover:bg-neutral-700/30" : "hover:bg-neutral-50"}>
                <td className="py-1.5 px-2 align-top">
                  <span className={isDark ? "text-neutral-300" : "text-neutral-700"}>{r.group}</span>
                </td>
                <td className="py-1.5 px-2 align-top">
                  <div className="flex items-center gap-1.5">
                    <span className={isDark ? "text-neutral-200" : "text-neutral-900"}>{r.emoji}</span>
                    <span className={isDark ? "text-neutral-200 font-medium" : "text-neutral-900 font-medium"}>{r.name}</span>
                  </div>
                </td>
                <td className="py-1.5 px-2 text-center align-top">
                  <span className={isDark ? "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-700 text-neutral-300 border border-neutral-600" : "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-mono bg-neutral-100 text-neutral-700 border border-neutral-200"}>
                    {r.percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
