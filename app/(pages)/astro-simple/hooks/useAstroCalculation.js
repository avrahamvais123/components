"use client";

import { useState } from "react";
import { normalizeNum } from "../utils/helpers";

export function useAstroCalculation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const calculate = async (form, options = {}) => {
    console.log("[astro-simple] compute() start", form);
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const { Origin, Horoscope } = await import("circular-natal-horoscope-js");

      const d = new Date(`${form.date}T${form.time}:00`);
      if (Number.isNaN(d.getTime())) throw new Error("תאריך/שעה לא תקינים.");

      const lat = normalizeNum(form.lat);
      const lon = normalizeNum(form.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error(
          "lat/lon לא מספריים. השתמש בנקודה עשרונית (.) במקום פסיק (,)."
        );
      }

      const origin = new Origin({
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        latitude: lat,
        longitude: lon,
      });

      const tryCompute = (houseSystem) =>
        new Horoscope({
          origin,
          houseSystem,
          zodiac: form.zodiac || "tropical",
          aspectPoints: ["bodies", "points", "angles"],
          aspectWithPoints: ["bodies", "points", "angles"],
          aspectTypes: ["major", "minor"],
          language: "en",
        });

      let hs = form.houseSystem || "placidus";
      let horoscope = tryCompute(hs);
      let housesArray = Array.isArray(horoscope.Houses) ? horoscope.Houses : [];

      if (housesArray.length !== 12) {
        hs = "whole-sign";
        horoscope = tryCompute(hs);
        housesArray = Array.isArray(horoscope.Houses) ? horoscope.Houses : [];
      }
      if (housesArray.length !== 12) {
        throw new Error(
          "לא חזרו 12 בתים. בדוק houseSystem, תאריך/שעה וקואורדינטות."
        );
      }

      const bodies = horoscope?.CelestialBodies?.all ?? [];
      const cp = horoscope?._celestialPoints || 
                 horoscope?.CelestialPoints || 
                 horoscope?.celestialPoints || null;

      let pointsExt = [];
      if (cp && typeof cp === "object") {
        const pick = (obj, names) => {
          for (const n of names) {
            if (obj?.[n] != null) return obj[n];
            const lower = n.toLowerCase();
            for (const k of Object.keys(obj)) {
              if (k.toLowerCase() === lower) return obj[k];
            }
          }
          return null;
        };

        const lilithObj = pick(cp, ["lilith", "blackMoon", "blackmoon", "black_moon"]);
        if (lilithObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "lilith", label: "Lilith", ...lilithObj });
        }
        
        const nodeObj = pick(cp, ["trueNode", "truenode", "northnode", "northNode", "node"]);
        if (nodeObj?.ChartPosition?.Ecliptic) {
          pointsExt.push({ key: "truenode", label: "True Node", ...nodeObj });
        }

        // ללא אסטרואידים
      }

  // ניסיון קבלת היבטים מה-API בלבד (ללא אסטרואידים)
      try {
        const arcFmt30 = (deg) => {
          const norm = ((deg % 360) + 360) % 360;
          const d30 = norm % 30;
          const d = Math.floor(d30);
          let m = Math.round((d30 - d) * 60);
          if (m === 60) m = 0;
          return `${d}° ${String(m).padStart(2, "0")}' 00''`;
        };

        const resp = await fetch("/api/astro/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: form.date,
            time: form.time,
            lat: lat,
            lon: lon,
            houseSystem: hs,
            zodiac: form.zodiac || "tropical",
            aspectMode: "degree",
            aspectOrbs: options.aspectOrbs || undefined,
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          // לא מוסיפים אסטרואידים
          // אם יש היבטים מה-API, נעדיף אותם על פני אלו של הספרייה המקומית
          if (Array.isArray(data?.data?.aspects)) {
            aspects = data.data.aspects;
          }
        }
      } catch (err) {
        console.warn("[astro-simple] failed to fetch asteroids from API", err?.message || err);
      }

      let aspects = horoscope?.Aspects?.all ?? [];
      const asc = horoscope?.Ascendant;
      const mc = horoscope?.Midheaven;

      setResult({
        bodies,
        aspects,
        asc,
        mc,
        houses: housesArray.map((h, idx) => {
          const start = h?.ChartPosition?.StartPosition?.Ecliptic;
          return {
            num: idx + 1,
            degDecimal: start?.DecimalDegrees,
            degFmt30: start?.ArcDegreesFormatted30,
          };
        }),
        pointsExt,
      });
    } catch (e) {
      console.error(e);
      setErr(e?.message || "בעיה בחישוב המפה.");
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, err, calculate };
}
