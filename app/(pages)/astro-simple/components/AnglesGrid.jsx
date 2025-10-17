"use client";

import { toSign, toSignGlyph } from "../utils/helpers";

function CardAngle({ title, obj }) {
  if (!obj) return null;
  const deg = obj?.ChartPosition?.Ecliptic?.DecimalDegrees;
  const sign = Number.isFinite(deg) ? toSign(deg) : "";
  const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
  const fmt = obj?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
  return (
    <div className="border rounded p-4">
      <div className="font-semibold">{title}</div>
      <div>
        מזל:{" "}
        <span className="inline-flex items-center gap-2">
          <span>{signGlyph}</span>
          <span>{sign || "-"}</span>
        </span>
      </div>
      <div>מעלה: {fmt || "-"}</div>
    </div>
  );
}

export default function AnglesGrid({ asc, mc }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <CardAngle title="מזל עולה (ASC)" obj={asc} />
      <CardAngle title="מרום השמים (MC)" obj={mc} />
    </div>
  );
}
