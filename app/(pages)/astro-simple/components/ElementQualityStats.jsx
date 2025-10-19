"use client";

import { ELEMENT_NAME_HE, QUALITY_NAME_HE } from "../utils/sources";
import { useThemeState } from "../../../hooks/useThemeState";

export default function ElementQualityStats({ elementStats, qualityStats }) {
  const { isDark } = useThemeState();
  
  const elementColors = {
    fire: isDark ? "from-red-900/30 to-orange-900/30 border-red-800/50 text-red-300" : "from-red-50 to-orange-50 border-red-200 text-red-700",
    earth: isDark ? "from-green-900/30 to-emerald-900/30 border-green-800/50 text-green-300" : "from-green-50 to-emerald-50 border-green-200 text-green-700",
    air: isDark ? "from-blue-900/30 to-cyan-900/30 border-blue-800/50 text-blue-300" : "from-blue-50 to-cyan-50 border-blue-200 text-blue-700",
    water: isDark ? "from-purple-900/30 to-indigo-900/30 border-purple-800/50 text-purple-300" : "from-purple-50 to-indigo-50 border-purple-200 text-purple-700"
  };
  
  const qualityColors = {
    cardinal: isDark ? "from-rose-900/30 to-pink-900/30 border-rose-800/50 text-rose-300" : "from-rose-50 to-pink-50 border-rose-200 text-rose-700",
    fixed: isDark ? "from-amber-900/30 to-yellow-900/30 border-amber-800/50 text-amber-300" : "from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
    mutable: isDark ? "from-teal-900/30 to-cyan-900/30 border-teal-800/50 text-teal-300" : "from-teal-50 to-cyan-50 border-teal-200 text-teal-700"
  };
  
  const elementEmojis = {
    fire: "🔥",
    earth: "🌍", 
    air: "💨",
    water: "💧"
  };
  
  const qualityEmojis = {
    cardinal: "🚀",
    fixed: "🛡️",
    mutable: "🔄"
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* יסודות */}
      <div className={`rounded-xl overflow-hidden border shadow-sm ${
        isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"
      }`}>
        <div className={`p-4 border-b ${
          isDark 
            ? "bg-gradient-to-r from-neutral-800 to-neutral-700 border-neutral-700" 
            : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <h3 className={`text-lg font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
              יסודות
            </h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {["fire", "earth", "air", "water"].map((k) => {
            const percentage = elementStats.percents[k];
            return (
              <div key={k} className={`p-3 rounded-lg border bg-gradient-to-r ${elementColors[k]}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{elementEmojis[k]}</span>
                    <span className="font-medium">{ELEMENT_NAME_HE[k]}</span>
                  </div>
                  <span className="text-lg font-bold">{percentage}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-neutral-700" : "bg-gray-200"
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      k === 'fire' ? (isDark ? "bg-red-400" : "bg-red-500") :
                      k === 'earth' ? (isDark ? "bg-green-400" : "bg-green-500") :
                      k === 'air' ? (isDark ? "bg-blue-400" : "bg-blue-500") :
                      (isDark ? "bg-purple-400" : "bg-purple-500")
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {elementStats.missing.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg border ${
              isDark 
                ? "bg-neutral-700/30 border-neutral-600 text-neutral-400" 
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <span>⚠️</span>
                <span className="font-medium">יסודות חסרים:</span>
                {elementStats.missing.map((k) => ELEMENT_NAME_HE[k]).join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* איכויות */}
      <div className={`rounded-xl overflow-hidden border shadow-sm ${
        isDark ? "border-neutral-700 bg-neutral-800" : "border-gray-200 bg-white"
      }`}>
        <div className={`p-4 border-b ${
          isDark 
            ? "bg-gradient-to-r from-neutral-800 to-neutral-700 border-neutral-700" 
            : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h3 className={`text-lg font-bold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>
              איכויות
            </h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {["cardinal", "fixed", "mutable"].map((k) => {
            const percentage = qualityStats.percents[k];
            return (
              <div key={k} className={`p-3 rounded-lg border bg-gradient-to-r ${qualityColors[k]}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{qualityEmojis[k]}</span>
                    <span className="font-medium">{QUALITY_NAME_HE[k]}</span>
                  </div>
                  <span className="text-lg font-bold">{percentage}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-neutral-700" : "bg-gray-200"
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      k === 'cardinal' ? (isDark ? "bg-rose-400" : "bg-rose-500") :
                      k === 'fixed' ? (isDark ? "bg-amber-400" : "bg-amber-500") :
                      (isDark ? "bg-teal-400" : "bg-teal-500")
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {qualityStats.missing.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg border ${
              isDark 
                ? "bg-neutral-700/30 border-neutral-600 text-neutral-400" 
                : "bg-gray-50 border-gray-200 text-gray-600"
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <span>⚠️</span>
                <span className="font-medium">איכויות חסרות:</span>
                {qualityStats.missing.map((k) => QUALITY_NAME_HE[k]).join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
