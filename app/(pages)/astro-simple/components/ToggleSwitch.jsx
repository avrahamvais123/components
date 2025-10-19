"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function ToggleSwitch({ 
  isOn, 
  onToggle, 
  activeColor = "bg-blue-500", 
  inactiveColor = "bg-neutral-300",
  size = "normal" // "small", "normal", "large"
}) {
  const { isDark } = useThemeState();
  
  const sizes = {
    small: { switch: "h-5 w-9", circle: "h-3 w-3" },
    normal: { switch: "h-6 w-11", circle: "h-4 w-4" },
    large: { switch: "h-8 w-14", circle: "h-6 w-6" }
  };
  
  const currentSize = sizes[size];
  
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center ${currentSize.switch} rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isOn 
          ? `${activeColor} ${isDark ? "focus:ring-blue-400" : "focus:ring-blue-500"}` 
          : `${isDark ? "bg-neutral-600" : inactiveColor} ${isDark ? "focus:ring-neutral-400" : "focus:ring-neutral-300"}`
      }`}
      role="switch"
      aria-checked={isOn}
    >
      {/* רקע הדרגתי כשמופעל */}
      {isOn && (
  <div className="absolute inset-0 rounded-full" />
      )}
      
      {/* העיגול הנע */}
      <span
        className={`inline-block ${currentSize.circle} transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOn 
            ? `translate-x-1 ${isDark ? "shadow-neutral-900/20" : "shadow-neutral-500/30"}` 
            : `${size === "small" ? "translate-x-5" : size === "large" ? "translate-x-7" : "translate-x-6"} ${isDark ? "shadow-neutral-900/40" : "shadow-neutral-500/20"}`
        }`}
      >
        {/* נקודה פנימית עבור אינדיקטור נוסף */}
        <span 
          className={`absolute inset-0.5 rounded-full transition-all duration-300 ${
            isOn 
              ? "bg-white/40" 
              : "bg-neutral-200/60"
          }`} 
        />
      </span>
    </button>
  );
}
