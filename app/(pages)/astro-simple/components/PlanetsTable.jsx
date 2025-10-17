"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function PlanetsTable({ displayedBodies }) {
  const { isDark } = useThemeState();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className={isDark ? "bg-neutral-900" : "bg-gray-50"}>
          <tr>
            <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>שם</th>
            <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>מזל</th>
            <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>מעלה (0–30)</th>
            <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>בית</th>
            <th className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-100" : "border-gray-200"}`}>R</th>
          </tr>
        </thead>
        <tbody>
          {displayedBodies.map((b) => (
            <tr key={b.key} className={isDark ? "bg-neutral-950 even:bg-neutral-900/50" : "bg-white even:bg-gray-50"}>
              <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>
                <span className="inline-flex items-center gap-2">
                  <span>{b.glyph}</span>
                  <span>{b.labelHe}</span>
                </span>
              </td>
              <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>
                <span className="inline-flex items-center gap-2">
                  <span>{b.signGlyph}</span>
                  <span>{b.sign}</span>
                </span>
              </td>
              <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>{b.deg30Short || "-"}</td>
              <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>
                {Number.isInteger(b.houseNum) ? b.houseNum : "-"}
              </td>
              <td className={`p-2 border ${isDark ? "border-neutral-700 text-neutral-200" : "border-gray-200"}`}>{b.retro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
