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
  DEFAULT_ASPECT_ORBS,
  STATS_CHOICES,
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

export function useAstroData(
  result,
  displayKeys,
  statsIncludeKeys,
  selectedAspectTypes,
  aspectSourceKeys = DEFAULT_STATS_KEYS,
  aspectTargetKeys = STATS_CHOICES,
  aspectOrbs = DEFAULT_ASPECT_ORBS
) {
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
      // פלנטות שנמצאות בבית זה (לפי niceBodies.houseNum)
      const occupants = (niceBodies || []).filter(
        (b) => Number.isInteger(b?.houseNum) && b.houseNum === h.num
      );
      const occupantGlyphs = occupants.map((b) => b.glyph).filter(Boolean);
      return {
        num: h.num,
        labelHe,
        sign,
        signGlyph,
        degFmt: h.degFmt30 || "-",
        occupantGlyphs,
      };
    });
  }, [result, niceBodies]);

  /** פלנטות לתצוגה לפי בחירת המשתמש */
  const displayedBodies = useMemo(() => {
    const allow = new Set(
      (displayKeys || []).map((k) => String(k || "").toLowerCase())
    );
    return (niceBodies || []).filter((b) =>
      allow.has(String(b.key || "").toLowerCase())
    );
  }, [niceBodies, displayKeys]);

  /** היבטים עם תרגום לעברית ופילטור לפי בחירה */
  const niceAspects = useMemo(() => {
    if (!result?.aspects) return [];
    const srcSet = new Set((aspectSourceKeys || []).map((k) => String(k).toLowerCase()));
    const tgtSet = new Set((aspectTargetKeys || []).map((k) => String(k).toLowerCase()));
    
    // פונקציה לנרמול סוג היבט לבדיקה
    const normalizeAspectType = (aspectType) => {
      if (!aspectType) return '';
      const normalized = aspectType.toLowerCase().trim();
      
      // הסרה של מעלות ופרטים נוספים
      const cleanType = normalized.split(/[\s\(]/)[0];
      
      // מיפוי תרגומים עבריים לאנגלית
      const hebrewToEnglish = {
        'צירוף': 'conjunction',
        'צמידות': 'conjunction',
        'התנגדות': 'opposition',
        'מולות': 'opposition', 
        'ריבוע': 'square',
        'משולש': 'trine',
        'טריגון': 'trine',
        'טריין': 'trine',
        'משושה': 'sextile',
        'סקסטיל': 'sextile',
        'שישית': 'sextile',
        'חצי-משושה': 'semisextile',
        'חצי־שישית': 'semisextile',
        'חמישון': 'quincunx',
        'קווינקוקס': 'quincunx',
        'קווינקנקס': 'quincunx',
        'חצי־ריבוע': 'semisquare',
        'ריבוע־וחצי': 'sesquiquadrate',
        'קווינטיל': 'quintile',
        'בי־קווינטיל': 'biquintile'
      };
      
      // בדיקה ישירה במיפוי
      let englishType = hebrewToEnglish[cleanType] || hebrewToEnglish[normalized] || cleanType;
      
      // בדיקה אם המחרוזת מכילה מילים מוכרות
      if (!hebrewToEnglish[cleanType] && !hebrewToEnglish[normalized]) {
        for (const [hebrew, english] of Object.entries(hebrewToEnglish)) {
          if (normalized.includes(hebrew)) {
            englishType = english;
            break;
          }
        }
      }
      
      return englishType;
    };
    
    return result.aspects
      .map((a) => {
        const p1En = a?.point1Label || a?.point1 || "";
        const p2En = a?.point2Label || a?.point2 || "";
        const p1Key = String(a?.a || a?.point1 || p1En).toLowerCase();
        const p2Key = String(a?.b || a?.point2 || p2En).toLowerCase();
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
  const orbNum = typeof a?.orb === "number" ? a.orb : null;
  const orb = orbNum != null ? orbNum.toFixed(2) : a?.orb;
        
        // נרמול סוג ההיבט לבדיקה
        const normalizedType = normalizeAspectType(type);
        
        return { p1, p2, p1Glyph, p2Glyph, type, typeGlyph, orb, orbNum, normalizedType, p1Key, p2Key };
      })
      .filter((aspect) => {
        // פילטור לפי קבוצות המקור/יעד
        const inPair = (srcSet.has(aspect.p1Key) && tgtSet.has(aspect.p2Key))
                    || (srcSet.has(aspect.p2Key) && tgtSet.has(aspect.p1Key));
        if (!inPair) return false;
        // פילטור לפי סוגי היבטים שנבחרו
        if (!selectedAspectTypes.includes(aspect.normalizedType)) return false;
        // פילטור לפי אורב לכל סוג: אם האורב שקיבלנו גדול מהאורב המותר, נפסול
        const limit = aspectOrbs?.[aspect.normalizedType] ?? DEFAULT_ASPECT_ORBS[aspect.normalizedType] ?? 7;
        if (typeof aspect.orbNum === "number" && aspect.orbNum > limit) return false;
        return true;
      });
  }, [result, selectedAspectTypes, aspectSourceKeys, aspectTargetKeys, aspectOrbs]);

  return {
    niceBodies,
    elementStats,
    qualityStats,
    niceHouses,
    displayedBodies,
    niceAspects,
  };
}
