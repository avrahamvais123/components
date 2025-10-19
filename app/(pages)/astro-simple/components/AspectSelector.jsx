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
    <div>
      {title && (
        <div className={`font-medium mb-3 ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
          {title}
        </div>
      )}
      
      {/* כפתורי פעולה מהירה */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleSelectMain}
          className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
            isDark 
              ? "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-700/50" 
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          }`}
        >
          היבטים עיקריים
        </button>
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

      {/* רשימת היבטים */}
      <div className="grid grid-cols-1 gap-2">
        {ASPECT_TYPES.map((aspect) => {
          const isSelected = selectedKeys.includes(aspect.key);
          const isMain = ['conjunction', 'opposition', 'trine', 'square', 'sextile'].includes(aspect.key);
          const orbVal = (aspectOrbs && aspectOrbs[aspect.key] != null)
            ? aspectOrbs[aspect.key]
            : DEFAULT_ASPECT_ORBS[aspect.key] ?? 6;
          
          return (
            <div
              key={aspect.key}
              className={`relative flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? isDark
                    ? isMain
                      ? "bg-emerald-950/30 border-emerald-700/50 text-emerald-200 shadow-sm"
                      : "bg-blue-950/30 border-blue-700/50 text-blue-200 shadow-sm"
                    : isMain
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm"
                    : "bg-blue-50 border-blue-200 text-blue-900 shadow-sm"
                  : isDark
                  ? "bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {/* חלק שמאלי - checkbox ושם */}
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => handleToggle(aspect.key)}
              >
                {/* Checkbox מותאם אישית */}
                <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? isMain
                      ? isDark
                        ? "bg-emerald-600 border-emerald-600"
                        : "bg-emerald-600 border-emerald-600"
                      : isDark
                      ? "bg-blue-600 border-blue-600"
                      : "bg-blue-600 border-blue-600"
                    : isDark
                    ? "border-neutral-500 bg-neutral-800"
                    : "border-gray-300 bg-white"
                }`}>
                  {isSelected && (
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
                
                {/* שם ההיבט */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium select-none">{aspect.labelHe}</span>
                  {isMain && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isDark 
                        ? "bg-emerald-900/50 text-emerald-300" 
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      עיקרי
                    </span>
                  )}
                </div>
              </div>

              {/* שדה אורב */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-500"}`}>אורב:</span>
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
                  className={`w-16 h-8 px-2 text-sm rounded-md border text-center transition-all ${
                    isDark 
                      ? "bg-neutral-800 border-neutral-600 text-neutral-100 focus:border-neutral-500 focus:bg-neutral-700" 
                      : "bg-white border-gray-300 text-gray-900 focus:border-gray-400 focus:bg-gray-50"
                  }`}
                  title="אורב במעלות"
                  inputMode="decimal"
                />
                <span className={`text-xs ${isDark ? "text-neutral-400" : "text-gray-500"}`}>°</span>
              </div>
              
              {/* אפקט ריחוף */}
              {isSelected && (
                <div className={`absolute inset-0 rounded-lg pointer-events-none ${
                  isMain 
                    ? isDark ? "bg-emerald-500/5" : "bg-emerald-500/5"
                    : isDark ? "bg-blue-500/5" : "bg-blue-500/5"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
