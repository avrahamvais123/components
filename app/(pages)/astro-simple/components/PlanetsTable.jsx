"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function PlanetsTable({ displayedBodies }) {
  const { isDark } = useThemeState();
  
  return (
    <div className={`h-full w-full rounded-xl overflow-hidden border ${
      isDark ? "border-neutral-700 bg-neutral-800" : "border-neutral-200 bg-white"
    }`}>
      <div className="overflow-auto w-full h-full">
        <table className="w-full align-top">
          <thead className={`sticky top-0 z-10 border-b ${
            isDark 
              ? "bg-neutral-800 border-neutral-600" 
              : "bg-neutral-50 border-neutral-300"
          }`}>
            <tr>
              <th className={`py-1.5 px-2 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                פלנטה
              </th>
              <th className={`py-1.5 px-2 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                מעלות
              </th>
              <th className={`py-1.5 px-2 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                מזל
              </th>
              <th className={`py-1.5 px-2 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                בית
              </th>
              <th className={`py-1.5 px-2 text-center font-semibold ${
                isDark ? "text-neutral-100" : "text-neutral-900"
              }`}>
                רטרו
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {displayedBodies.map((b, index) => (
              <tr 
                key={b.key} 
                className={`transition-colors hover:bg-opacity-50 ${
                  isDark 
                    ? "hover:bg-neutral-700/30" 
                    : "hover:bg-neutral-50"
                }`}
              >
                <td className="py-1.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xl ${
                      isDark ? "text-amber-300" : "text-amber-600"
                    }`}>
                      {b.glyph}
                    </span>
                    <span className={`font-medium ${
                      isDark ? "text-neutral-200" : "text-neutral-900"
                    }`}>
                      {b.labelHe}
                    </span>
                  </div>
                </td>
                <td className="py-1.5 px-2">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-md ${
                    isDark 
                      ? "bg-neutral-700 text-neutral-300" 
                      : "bg-neutral-100 text-neutral-700"
                  }`}>
                    {b.deg30Short || "-"}
                  </span>
                </td>
                <td className="py-1.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}>
                      {b.signGlyph}
                    </span>
                    <span className={`font-medium ${
                      isDark ? "text-neutral-200" : "text-neutral-700"
                    }`}>
                      {b.sign}
                    </span>
                  </div>
                </td>
                <td className="py-1.5 px-2">
                  {Number.isInteger(b.houseNum) ? (
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      isDark 
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800/50" 
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}>
                      {b.houseNum}
                    </span>
                  ) : (
                    <span className={`text-xs ${
                      isDark ? "text-neutral-500" : "text-neutral-400"
                    }`}>
                      -
                    </span>
                  )}
                </td>
                <td className="py-1.5 px-2 text-center">
                  {b.retro && (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                      isDark 
                        ? "bg-red-900/30 text-red-300 border border-red-800/50" 
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      ℞
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
