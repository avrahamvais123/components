// app/astro/hooks/useAstroAPI.js
"use client";

import { useState, useCallback } from "react";

export default function useAstroAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const calc = useCallback(
    async (
      form,
      {
        aspectMode = "none",
        orb = 7,
        aspects = ["conjunction", "sextile", "square", "trine", "opposition"],
        profileIncludeKeys,
        profileExcludeKeys,
      } = {}
    ) => {
      setError("");
      setResult(null);
      setLoading(true);

      try {
        const response = await fetch('/api/astro/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // נתוני הטופס
            date: form.date,
            time: form.time,
            lat: form.lat,
            lon: form.lon,
            houseSystem: form.houseSystem || "placidus",
            zodiac: form.zodiac || "tropical",
            
            // הגדרות היבטים
            aspectMode,
            orb,
            aspects,
            
            // הגדרות פרופיל
            profileIncludeKeys,
            profileExcludeKeys,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || `HTTP Error: ${response.status}`);
        }

        if (!responseData.success) {
          throw new Error(responseData.error || "תגובה לא תקינה מהשרת");
        }

        setResult(responseData.data);
        
      } catch (e) {
        console.error("API Error:", e);
        setError(e?.message || "שגיאה בחישוב המפה");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    calc,
    loading,
    error,
    result,
  };
}
