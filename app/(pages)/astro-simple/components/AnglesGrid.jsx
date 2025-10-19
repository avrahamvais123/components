"use client";

import { toSign, toSignGlyph } from "../utils/helpers";
import { useThemeState } from "../../../hooks/useThemeState";

function CardAngle({ title, obj, isDark, emoji, gradientFrom, gradientTo, borderColor, textColor }) {
  if (!obj) return null;
  const deg = obj?.ChartPosition?.Ecliptic?.DecimalDegrees;
  const sign = Number.isFinite(deg) ? toSign(deg) : "";
  const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
  const fmt = obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  
  return (
    <div className={`relative overflow-hidden rounded-xl border shadow-lg transition-transform hover:scale-105 ${
      isDark 
        ? `border-${borderColor}-800/50 bg-gradient-to-br from-${gradientFrom}-900/30 to-${gradientTo}-900/30` 
        : `border-${borderColor}-200 bg-gradient-to-br from-${gradientFrom}-50 to-${gradientTo}-50`
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5"></div>
      
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            isDark 
              ? `bg-${gradientFrom}-900/50 text-${textColor}-300` 
              : `bg-${gradientFrom}-100 text-${textColor}-600`
          }`}>
            <span className="text-xl">{emoji}</span>
          </div>
          <h3 className={`text-lg font-bold ${
            isDark ? `text-${textColor}-200` : `text-${textColor}-800`
          }`}>
            {title}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
              מזל
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}>
                {signGlyph}
              </span>
              <span className={`font-semibold ${
                isDark ? "text-neutral-200" : "text-gray-900"
              }`}>
                {sign || "-"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? "text-neutral-400" : "text-gray-600"}`}>
              מעלות
            </span>
            <span className={`font-mono text-sm px-3 py-1 rounded-md ${
              isDark 
                ? "bg-neutral-700 text-neutral-300 border border-neutral-600" 
                : "bg-white text-gray-700 border border-gray-200"
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
        gradientFrom="rose"
        gradientTo="pink"
        borderColor="rose"
        textColor="rose"
      />
      <CardAngle 
        title="מרום השמים (MC)" 
        obj={mc} 
        isDark={isDark}
        emoji="⭐"
        gradientFrom="indigo"
        gradientTo="purple"
        borderColor="indigo"
        textColor="indigo"
      />
    </div>
  );
}
