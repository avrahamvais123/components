"use client";

import { STATS_CHOICES, PLANET_NAMES_HE_BY_KEY } from "../utils/sources";
import { useThemeState } from "../../../hooks/useThemeState";

export default function PlanetSelector({ 
  selectedKeys, 
  onSelectionChange, 
  title = "בחר פלנטות" 
}) {
  const { isDark } = useThemeState();

  const handleToggle = (key) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter(k => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange([...STATS_CHOICES]);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div>
      {title && (
        <div className={`font-medium mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
          {title}
        </div>
      )}
      
      {/* כפתורי פעולה מהירה */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSelectAll}
          className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
            isDark 
              ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600 border border-neutral-600" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          בחר הכל
        </button>
        <button
          onClick={handleClearAll}
          className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
            isDark 
              ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600 border border-neutral-600" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          נקה הכל
        </button>
      </div>

      {/* רשת הפלנטות */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STATS_CHOICES.map((k) => {
          const checked = selectedKeys.includes(k);
          const nameHe = PLANET_NAMES_HE_BY_KEY[k] || k;
          return (
            <div
              key={k}
              onClick={() => handleToggle(k)}
              className={`relative flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                checked
                  ? isDark
                    ? "bg-blue-950/30 border-blue-700/50 text-blue-200 shadow-sm"
                    : "bg-blue-50 border-blue-200 text-blue-900 shadow-sm"
                  : isDark
                  ? "bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {/* Checkbox מותאם אישית */}
              <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center ml-3 transition-all ${
                checked
                  ? isDark
                    ? "bg-blue-600 border-blue-600"
                    : "bg-blue-600 border-blue-600"
                  : isDark
                  ? "border-neutral-500 bg-neutral-800"
                  : "border-gray-300 bg-white"
              }`}>
                {checked && (
                  <svg 
                    className="w-3 h-3 text-white" 
                    fill="none" 
                    strokeWidth="2.5" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              
              {/* שם הפלנטה */}
              <span className="text-sm font-medium select-none">{nameHe}</span>
              
              {/* אפקט ריחוף */}
              {checked && (
                <div className={`absolute inset-0 rounded-lg pointer-events-none ${
                  isDark ? "bg-blue-500/5" : "bg-blue-500/5"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
