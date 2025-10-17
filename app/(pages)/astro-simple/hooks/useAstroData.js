"use client";

import { useMemo } from "react";
import { labelAspect } from "../../astro/utils/constants";
import {
  ASPECT_GLYPHS,
  DEFAULT_STATS_KEYS,
  ELEMENT_KEY_BY_SIGN_INDEX,
  ELEMENT_NAME_HE,
  HOUSE_ORDINALS_HE,
  QUALITY_KEY_BY_SIGN_INDEX,
} from "../utils/sources";
import {
  toSign,
  toSignGlyph,
  fmtDegMin,
  normalizeBodyKey,
  findHouseForDegree,
  toHebBodyName,
  planetGlyph,
  houseNameHe,
} from "../utils/helpers";

export function useAstroData(result, displayKeys, statsIncludeKeys) {
  /** קאספים כמעלות דצימליות */
  const cuspsDegs = useMemo(() => {
    if (!result?.houses || result.houses.length !== 12) return null;
    return result.houses.map((h) => h.degDecimal);
  }, [result]);

  /** פלנטות/נקודות עם תרגום לעברית */
  const niceBodies = useMemo(() => {
    if (!result?.bodies) return [];
    
    const src = [...(result.bodies || []), ...(result.pointsExt || [])].filter(Boolean);
    const byKey = new Map();
    
    for (const b of src) {
      const k = normalizeBodyKey(b?.key || b?.id || "");
      if (!byKey.has(k)) byKey.set(k, b);
    }
    
    return Array.from(byKey.values()).map((b) => {
      const key = normalizeBodyKey(b?.key || b?.id || "");
      const labelHe = toHebBodyName({ key, label: b?.label });
      const glyph = planetGlyph({ key, label: b?.label });
      const retro = b?.isRetrograde ? "℞" : "";
      const deg = b?.ChartPosition?.Ecliptic?.DecimalDegrees;
      const deg30 = b?.ChartPosition?.Ecliptic?.ArcDegreesFormatted30;
      const deg30Short = fmtDegMin(deg30);
      const sign = Number.isFinite(deg) ? toSign(deg) : "";
      const signGlyph = Number.isFinite(deg) ? toSignGlyph(deg) : "";
      const signIndex = Number.isFinite(deg)
        ? Math.floor((((deg % 360) + 360) % 360) / 30)
        : null;

      const libHouseNum = b?.House?.id ?? null;
      const libHouseLabelHe = b?.House
        ? houseNameHe({ id: b.House.id, label: b.House.label })
        : null;

      const calcHouseNum = cuspsDegs ? findHouseForDegree(deg, cuspsDegs) : null;
      const houseNum = libHouseNum ?? calcHouseNum;
      const houseLabelHe =
        (libHouseNum && libHouseLabelHe) ||
        (Number.isInteger(houseNum) ? HOUSE_ORDINALS_HE[houseNum - 1] : null);

      return {
        key,
        labelHe,
        glyph,
        retro,
        sign,
        signGlyph,
        signIndex,
        deg30,
        deg30Short,
        houseNum,
        houseLabelHe,
      };
    });
  }, [result, cuspsDegs]);

  /** סטטיסטיקות יסודות ואיכויות */
  const { elementStats, qualityStats } = useMemo(() => {
    const includeKeys = new Set(
      (statsIncludeKeys || []).map((k) => String(k || "").toLowerCase())
    );

    const filtered = (niceBodies || []).filter((b) =>
      includeKeys.has(String(b.key || "").toLowerCase())
    );
    const total = filtered.length || 0;

    const elemCounts = { fire: 0, earth: 0, air: 0, water: 0 };
    const qualCounts = { cardinal: 0, fixed: 0, mutable: 0 };

    for (const b of filtered) {
      if (Number.isInteger(b?.signIndex)) {
        const eKey = ELEMENT_KEY_BY_SIGN_INDEX[b.signIndex];
        const qKey = QUALITY_KEY_BY_SIGN_INDEX[b.signIndex];
        if (eKey) elemCounts[eKey] += 1;
        if (qKey) qualCounts[qKey] += 1;
      }
    }

    const toPercents = (counts) => {
      const out = {};
      for (const [k, v] of Object.entries(counts)) {
        out[k] = total ? Math.round((v * 100) / total) : 0;
      }
      return out;
    };

    const elementStats = {
      total,
      counts: elemCounts,
      percents: toPercents(elemCounts),
      missing: Object.keys(elemCounts).filter((k) => elemCounts[k] === 0),
    };
    const qualityStats = {
      total,
      counts: qualCounts,
      percents: toPercents(qualCounts),
      missing: Object.keys(qualCounts).filter((k) => qualCounts[k] === 0),
    };

    return { elementStats, qualityStats };
  }, [niceBodies, statsIncludeKeys]);

  /** בתים עם תרגום לעברית */
  const niceHouses = useMemo(() => {
    if (!result?.houses) return [];
    return result.houses.map((h) => {
      const sign = Number.isFinite(h.degDecimal) ? toSign(h.degDecimal) : "-";
      const signGlyph = Number.isFinite(h.degDecimal) ? toSignGlyph(h.degDecimal) : "";
      const labelHe = Number.isInteger(h.num)
        ? HOUSE_ORDINALS_HE[h.num - 1]
        : `מס׳ ${h.num}`;
      return {
        num: h.num,
        labelHe,
        sign,
        signGlyph,
        degFmt: h.degFmt30 || "-",
      };
    });
  }, [result]);

  /** פלנטות לתצוגה לפי בחירת המשתמש */
  const displayedBodies = useMemo(() => {
    const allow = new Set(
      (displayKeys || []).map((k) => String(k || "").toLowerCase())
    );
    return (niceBodies || []).filter((b) =>
      allow.has(String(b.key || "").toLowerCase())
    );
  }, [niceBodies, displayKeys]);

  /** היבטים עם תרגום לעברית */
  const niceAspects = useMemo(() => {
    if (!result?.aspects) return [];
    return result.aspects.map((a) => {
      const p1En = a?.point1Label || a?.point1 || "";
      const p2En = a?.point2Label || a?.point2 || "";
      const typeRaw =
        a?.type ??
        a?.aspect ??
        a?.aspectType ??
        a?.name ??
        a?.label ??
        a?.Type ??
        a?.Aspect ??
        "";

      const p1 = toHebBodyName({ label: p1En }) || p1En;
      const p2 = toHebBodyName({ label: p2En }) || p2En;
      const p1Glyph = planetGlyph({ label: p1En });
      const p2Glyph = planetGlyph({ label: p2En });

      const typeKey = typeof typeRaw === "string" ? typeRaw.trim().toLowerCase() : "";
      const type =
        (typeKey && labelAspect(typeKey)) ||
        (typeof typeRaw === "string" ? typeRaw : "");
      const typeGlyph = typeKey ? ASPECT_GLYPHS[typeKey] || "" : "";
      const orb = typeof a?.orb === "number" ? a.orb.toFixed(2) : a?.orb;
      
      return { p1, p2, p1Glyph, p2Glyph, type, typeGlyph, orb };
    });
  }, [result]);

  return {
    niceBodies,
    elementStats,
    qualityStats,
    niceHouses,
    displayedBodies,
    niceAspects,
  };
}
