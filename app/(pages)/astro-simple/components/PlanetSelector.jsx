"use client";

import { STATS_CHOICES, PLANET_NAMES_HE_BY_KEY } from "../utils/sources";
import { useThemeState } from "../../../hooks/useThemeState";

export default function PlanetSelector({ 
  selectedKeys, 
  onSelectionChange, 
  title = "בחר פלנטות" 
}) {
  const { isDark } = useThemeState();
  return (
    <div className={`mb-3 border rounded p-3 ${isDark ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"}`}>
      <div className={`font-medium mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>{title}</div>
      <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
        {STATS_CHOICES.map((k) => {
          const checked = selectedKeys.includes(k);
          const nameHe = PLANET_NAMES_HE_BY_KEY[k] || k;
          return (
            <label key={k} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className={isDark ? "accent-neutral-300" : "accent-black"}
                checked={checked}
                onChange={(e) => {
                  onSelectionChange((prev) => {
                    const set = new Set(prev);
                    if (e.target.checked) set.add(k);
                    else set.delete(k);
                    return Array.from(set);
                  });
                }}
              />
              <span className={isDark ? "text-neutral-200" : "text-gray-700"}>{nameHe}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
