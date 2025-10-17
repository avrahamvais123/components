"use client";

import { toSign, toSignGlyph } from "../utils/helpers";
import { useThemeState } from "../../../hooks/useThemeState";

function CardAngle({ title, obj, isDark }) {
  if (!obj) return null;
  const deg = obj?.ChartPosition?.Ecliptic?.DecimalDegrees;
  const sign = Number.isFinite(deg) ? toSign(deg) : "";
  const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
  const fmt = obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  return (
    <div className={`border rounded p-4 ${isDark ? "border-neutral-700 bg-neutral-900" : "border-gray-200 bg-white"}`}>
      <div className={`font-semibold ${isDark ? "text-neutral-100" : "text-gray-900"}`}>{title}</div>
      <div className={isDark ? "text-neutral-200" : "text-gray-700"}>
        מזל:{" "}
        <span className="inline-flex items-center gap-2">
          <span>{signGlyph}</span>
          <span>{sign || "-"}</span>
        </span>
      </div>
      <div className={isDark ? "text-neutral-200" : "text-gray-700"}>מעלה: {fmt || "-"}</div>
    </div>
  );
}

export default function AnglesGrid({ asc, mc }) {
  const { isDark } = useThemeState();
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <CardAngle title="מזל עולה (ASC)" obj={asc} isDark={isDark} />
      <CardAngle title="מרום השמים (MC)" obj={mc} isDark={isDark} />
    </div>
  );
}
