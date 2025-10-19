"use client";

import { toSign, toSignGlyph } from "../utils/helpers";
import { useThemeState } from "../../../hooks/useThemeState";

function CardAngle({ title, obj, isDark, emoji, colorKey }) {
  if (!obj) return null;
  const deg = obj?.ChartPosition?.Ecliptic?.DecimalDegrees;
  const sign = Number.isFinite(deg) ? toSign(deg) : "";
  const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
  const fmt = obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  
  return (
    <div className={`relative overflow-hidden rounded-xl border transition-transform hover:scale-105 ${
      isDark 
        ? `border-${colorKey}-800/50 bg-neutral-900` 
        : `border-${colorKey}-200 bg-white`
    }`}>
      
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            isDark 
              ? `bg-${colorKey}-900/30 text-${colorKey}-300` 
              : `bg-${colorKey}-100 text-${colorKey}-600`
          }`}>
            <span className="text-xl">{emoji}</span>
          </div>
          <h3 className={`text-lg font-bold ${
            isDark ? `text-${colorKey}-200` : `text-${colorKey}-800`
          }`}>
            {title}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              מזל
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}>
                {signGlyph}
              </span>
              <span className={`font-semibold ${
                isDark ? "text-neutral-200" : "text-neutral-900"
              }`}>
                {sign || "-"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              מעלות
            </span>
            <span className={`font-mono text-sm px-3 py-1 rounded-md ${
              isDark 
                ? "bg-neutral-700 text-neutral-300 border border-neutral-600" 
                : "bg-white text-neutral-700 border border-neutral-200"
            }`}>
              {fmt || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnglesGrid({ asc, mc }) {
  const { isDark } = useThemeState();
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <CardAngle 
        title="מזל עולה (ASC)" 
        obj={asc} 
        isDark={isDark}
        emoji="🌅"
        colorKey="rose"
      />
      <CardAngle 
        title="מרום השמים (MC)" 
        obj={mc} 
        isDark={isDark}
        emoji="⭐"
        colorKey="indigo"
      />
    </div>
  );
}
