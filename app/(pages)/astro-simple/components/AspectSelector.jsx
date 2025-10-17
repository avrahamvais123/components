"use client";

import { useThemeState } from "../../../hooks/useThemeState";
import { ASPECT_TYPES, DEFAULT_ASPECT_ORBS } from "../utils/sources";

export default function AspectSelector({ selectedKeys, onSelectionChange, title, aspectOrbs, onOrbsChange }) {
  const { isDark } = useThemeState();

  const handleToggle = (key) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter(k => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const handleSelectAll = () => {
    const allKeys = ASPECT_TYPES.map(a => a.key);
    onSelectionChange(allKeys);
  };

  const handleSelectMain = () => {
    const mainKeys = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
    onSelectionChange(mainKeys);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="mb-4">
      <h3 className={`text-lg font-medium mb-2 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
        {title || "בחר היבטים לתצוגה"}
      </h3>
      
      {/* כפתורי פעולה מהירה */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={handleSelectMain}
          className={`px-3 py-1 text-sm rounded-md border ${
            isDark 
              ? "bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          היבטים עיקריים
        </button>
        <button
          onClick={handleSelectAll}
          className={`px-3 py-1 text-sm rounded-md border ${
            isDark 
              ? "bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          בחר הכל
        </button>
        <button
          onClick={handleClearAll}
          className={`px-3 py-1 text-sm rounded-md border ${
            isDark 
              ? "bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700" 
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          נקה הכל
        </button>
      </div>

      {/* רשימת היבטים */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {ASPECT_TYPES.map((aspect) => {
          const isSelected = selectedKeys.includes(aspect.key);
          const orbVal = (aspectOrbs && aspectOrbs[aspect.key] != null)
            ? aspectOrbs[aspect.key]
            : DEFAULT_ASPECT_ORBS[aspect.key] ?? 6;
          return (
            <label
              key={aspect.key}
              className={`flex items-center justify-between gap-2 p-2 rounded-md border cursor-pointer transition-colors w-full ${
                isSelected
                  ? isDark
                    ? "bg-neutral-700 border-neutral-600 text-neutral-100"
                    : "bg-blue-50 border-blue-200 text-blue-900"
                  : isDark
                  ? "bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-grow">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(aspect.key)}
                  className="rounded shrink-0"
                />
                <span className="text-sm truncate">{aspect.labelHe}</span>
              </div>
              {/* שדה אורב לכל היבט */}
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={orbVal}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  const safe = isNaN(v) ? 0 : Math.max(0, Math.min(30, v));
                  onOrbsChange?.({ ...DEFAULT_ASPECT_ORBS, ...(aspectOrbs || {}), [aspect.key]: safe });
                }}
                className={`w-16 h-8 px-2 text-sm rounded border shrink-0 ${
                  isDark ? "bg-neutral-800 border-neutral-600 text-neutral-100" : "bg-white border-gray-300 text-gray-900"
                }`}
                title="אורב במעלות"
                inputMode="decimal"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
