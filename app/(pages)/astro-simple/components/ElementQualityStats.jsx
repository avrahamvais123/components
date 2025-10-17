"use client";

import { ELEMENT_NAME_HE, QUALITY_NAME_HE } from "../utils/sources";
import { useThemeState } from "../../../hooks/useThemeState";

export default function ElementQualityStats({ elementStats, qualityStats }) {
  const { isDark } = useThemeState();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className={`border rounded p-3 ${isDark ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"}`}>
        <div className={`font-bold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>יסודות</div>
        <ul className="space-y-1">
          {["fire", "earth", "air", "water"].map((k) => (
            <li key={k} className={`flex justify-between ${isDark ? "text-neutral-200" : "text-gray-700"}`}>
              <span>{ELEMENT_NAME_HE[k]}</span>
              <span>{elementStats.percents[k]}%</span>
            </li>
          ))}
        </ul>
        {elementStats.missing.length > 0 && (
          <div className={`text-sm mt-2 ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            חסרים:{" "}
            {elementStats.missing
              .map((k) => ELEMENT_NAME_HE[k])
              .join(", ")}
          </div>
        )}
      </div>
      <div className={`border rounded p-3 ${isDark ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"}`}>
        <div className={`font-bold mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>איכויות</div>
        <ul className="space-y-1">
          {["cardinal", "fixed", "mutable"].map((k) => (
            <li key={k} className={`flex justify-between ${isDark ? "text-neutral-200" : "text-gray-700"}`}>
              <span>{QUALITY_NAME_HE[k]}</span>
              <span>{qualityStats.percents[k]}%</span>
            </li>
          ))}
        </ul>
        {qualityStats.missing.length > 0 && (
          <div className={`text-sm mt-2 ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
            חסרים:{" "}
            {qualityStats.missing
              .map((k) => QUALITY_NAME_HE[k])
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
