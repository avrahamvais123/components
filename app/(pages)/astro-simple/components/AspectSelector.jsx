"use client";

import { useThemeState } from "../../../hooks/useThemeState";
import { ASPECT_TYPES } from "../utils/sources";

export default function AspectSelector({ selectedKeys, onSelectionChange, title }) {
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {ASPECT_TYPES.map((aspect) => {
          const isSelected = selectedKeys.includes(aspect.key);
          return (
            <label
              key={aspect.key}
              className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                isSelected
                  ? isDark
                    ? "bg-neutral-700 border-neutral-600 text-neutral-100"
                    : "bg-blue-50 border-blue-200 text-blue-900"
                  : isDark
                  ? "bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(aspect.key)}
                className="rounded"
              />
              <span className="text-sm">{aspect.labelHe}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
