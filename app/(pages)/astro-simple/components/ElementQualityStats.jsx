"use client";

import { ELEMENT_NAME_HE, QUALITY_NAME_HE } from "../utils/sources";

export default function ElementQualityStats({ elementStats, qualityStats }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border rounded p-3">
        <div className="font-bold mb-2">יסודות</div>
        <ul className="space-y-1">
          {["fire", "earth", "air", "water"].map((k) => (
            <li key={k} className="flex justify-between">
              <span>{ELEMENT_NAME_HE[k]}</span>
              <span>{elementStats.percents[k]}%</span>
            </li>
          ))}
        </ul>
        {elementStats.missing.length > 0 && (
          <div className="text-sm text-muted-foreground mt-2">
            חסרים:{" "}
            {elementStats.missing
              .map((k) => ELEMENT_NAME_HE[k])
              .join(", ")}
          </div>
        )}
      </div>
      <div className="border rounded p-3">
        <div className="font-bold mb-2">איכויות</div>
        <ul className="space-y-1">
          {["cardinal", "fixed", "mutable"].map((k) => (
            <li key={k} className="flex justify-between">
              <span>{QUALITY_NAME_HE[k]}</span>
              <span>{qualityStats.percents[k]}%</span>
            </li>
          ))}
        </ul>
        {qualityStats.missing.length > 0 && (
          <div className="text-sm text-muted-foreground mt-2">
            חסרים:{" "}
            {qualityStats.missing
              .map((k) => QUALITY_NAME_HE[k])
              .join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
