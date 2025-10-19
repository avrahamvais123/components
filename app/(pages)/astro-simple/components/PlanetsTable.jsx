"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function PlanetsTable({ displayedBodies }) {
  const { isDark } = useThemeState();
  
  return (
    <div className={`rounded-xl overflow-hidden border ${
      isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"
    } shadow-sm`}>
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
                פלנטה
              </th>
              <th className={`py-4 px-6 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-gray-900"
              }`}>
                מזל
              </th>
              <th className={`py-4 px-6 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-gray-900"
              }`}>
                מעלות
              </th>
              <th className={`py-4 px-6 text-right font-semibold ${
                isDark ? "text-neutral-100" : "text-gray-900"
              }`}>
                בית
              </th>
              <th className={`py-4 px-6 text-center font-semibold ${
                isDark ? "text-neutral-100" : "text-gray-900"
              }`}>
                רטרו
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {displayedBodies.map((b, index) => (
              <tr 
                key={b.key} 
                className={`transition-colors hover:bg-opacity-50 ${
                  isDark 
                    ? "hover:bg-neutral-700/30" 
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className={`text-xl ${
                      isDark ? "text-amber-300" : "text-amber-600"
                    }`}>
                      {b.glyph}
                    </span>
                    <span className={`font-medium ${
                      isDark ? "text-neutral-200" : "text-gray-900"
                    }`}>
                      {b.labelHe}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${
                      isDark ? "text-blue-300" : "text-blue-600"
                    }`}>
                      {b.signGlyph}
                    </span>
                    <span className={`font-medium ${
                      isDark ? "text-neutral-200" : "text-gray-700"
                    }`}>
                      {b.sign}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`font-mono text-sm px-2 py-1 rounded-md ${
                    isDark 
                      ? "bg-neutral-700 text-neutral-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {b.deg30Short || "-"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {Number.isInteger(b.houseNum) ? (
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      isDark 
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800/50" 
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}>
                      {b.houseNum}
                    </span>
                  ) : (
                    <span className={`text-sm ${
                      isDark ? "text-neutral-500" : "text-gray-400"
                    }`}>
                      -
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {b.retro && (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
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
