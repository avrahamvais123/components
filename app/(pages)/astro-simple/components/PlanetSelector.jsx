"use client";

import { STATS_CHOICES, PLANET_NAMES_HE_BY_KEY } from "../utils/sources";

export default function PlanetSelector({ 
  selectedKeys, 
  onSelectionChange, 
  title = "בחר פלנטות" 
}) {
  return (
    <div className="mb-3 border rounded p-3">
      <div className="font-medium mb-2">{title}</div>
      <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
        {STATS_CHOICES.map((k) => {
          const checked = selectedKeys.includes(k);
          const nameHe = PLANET_NAMES_HE_BY_KEY[k] || k;
          return (
            <label key={k} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-black"
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
              <span>{nameHe}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
