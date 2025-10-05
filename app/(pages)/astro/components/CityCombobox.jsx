"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const OM_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

// קאש בזיכרון כדי לא לחפש אותו דבר פעמיים
const memoryCache = new Map();

async function geocodeOpenMeteo(
  q,
  { limit = 8, language = "he", countryCode, signal } = {}
) {
  const key = JSON.stringify({ q, limit, language, countryCode });
  if (memoryCache.has(key)) return memoryCache.get(key);

  const url = new URL(OM_ENDPOINT);
  url.searchParams.set("name", q);
  url.searchParams.set("count", String(limit));
  url.searchParams.set("language", language);
  if (countryCode) url.searchParams.set("country_code", countryCode);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("Geocoding failed");
  const j = await res.json();

  const out = (j?.results || []).map((r) => ({
    label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone,
  }));
  memoryCache.set(key, out);
  return out;
}

/**
 * CityCombobox
 * props:
 * - onSelect(place) : נקרא בעת בחירה עם אובייקט {label,lat,lon,...}
 * - placeholder     : טקסט קלט (ברירת מחדל: 'חפש/י עיר…')
 * - language        : קוד שפה ל־Open-Meteo (ברירת מחדל 'he')
 * - countryCode     : סינון למדינה (למשל 'IL') – אופציונלי
 * - limit           : מספר תוצאות (ברירת מחדל 8)
 * - defaultValue    : ערך התחלה בתיבה
 */
export default function CityCombobox({
  onSelect,
  placeholder = "חפש/י עיר…",
  language = "he",
  countryCode,
  limit = 8,
  defaultValue = "",
  style = {},
}) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(-1);

  const abortRef = useRef(null);
  const wrapRef = useRef(null);
  const listId = useRef(
    `cbx-list-${Math.random().toString(36).slice(2)}`
  ).current;

  // סגירה בלחיצה מחוץ
  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // חיפוש עם דיבאונס
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setError("");
      if (abortRef.current) abortRef.current.abort();
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      setError("");
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      try {
        const out = await geocodeOpenMeteo(query.trim(), {
          limit,
          language,
          countryCode,
          signal: abortRef.current.signal,
        });
        setResults(out);
        setOpen(true);
        setActive(out.length ? 0 : -1);
      } catch (e) {
        if (e?.name !== "AbortError") setError("שגיאה בחיפוש");
        setResults([]);
        setOpen(true);
        setActive(-1);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query, limit, language, countryCode]);

  const doSelect = useCallback(
    (item) => {
      if (!item) return;
      setQuery(item.label);
      setOpen(false);
      setActive(-1);
      if (typeof onSelect === "function") onSelect(item);
    },
    [onSelect]
  );

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && active < results.length) doSelect(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-owns={listId}
      aria-expanded={open}
      style={{ position: "relative", ...style }}
      dir="rtl"
    >
      <input
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={
          active >= 0 ? `${listId}-opt-${active}` : undefined
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #ccc",
          outline: "none",
          boxShadow: open ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        }}
      />
      {open && (
        <div
          role="listbox"
          id={listId}
          style={{
            position: "absolute",
            zIndex: 20,
            top: "100%",
            insetInlineStart: 0,
            width: "100%",
            marginTop: 6,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {loading && <div style={{ padding: 10, fontSize: 14 }}>מחפש…</div>}
          {!loading && error && (
            <div style={{ padding: 10, color: "crimson" }}>⚠️ {error}</div>
          )}
          {!loading && !error && results.length === 0 && (
            <div style={{ padding: 10, fontSize: 14, color: "#555" }}>
              לא נמצאו תוצאות
            </div>
          )}
          {!loading &&
            !error &&
            results.map((item, i) => {
              const isActive = i === active;
              return (
                <div
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={isActive}
                  key={`${item.label}-${i}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => doSelect(item)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                    {item.timezone ? ` · ${item.timezone}` : ""}
                  </div>
                </div>
              );
            })}
          <div
            style={{
              padding: 8,
              fontSize: 11,
              color: "#999",
              textAlign: "start",
            }}
          >
            נתוני גיאוקיד: Open-Meteo
          </div>
        </div>
      )}
    </div>
  );
}
