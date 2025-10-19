"use client";

import { useThemeState } from "../../../hooks/useThemeState";

export default function AstroForm({
  form,
  onChange,
  onSubmit,
  loading,
  // Optional visibility toggles – default keeps previous behavior
  showDateTimeLatLon = true,
  showHouseZodiac = true,
  showSubmit = true,
}) {
  const { isDark } = useThemeState();
  
  const inputClassName = `w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
    isDark 
      ? "bg-neutral-800 border-neutral-600 text-neutral-100 placeholder-neutral-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" 
      : "bg-white border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
  } focus:outline-none`;
  
  const labelClassName = `text-sm font-medium ${
  isDark ? "text-neutral-200" : "text-neutral-700"
  }`;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {showDateTimeLatLon && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>📅</span>
                תאריך לידה
              </span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>🕐</span>
                שעת לידה (מקומית)
              </span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className={inputClassName}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>🌐</span>
                קו־רוחב (lat)
              </span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              name="lat"
              value={form.lat}
              onChange={onChange}
              className={inputClassName}
              placeholder="לדוגמה: 31.778 (ירושלים)"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>🗺️</span>
                קו־אורך (lon)
              </span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              name="lon"
              value={form.lon}
              onChange={onChange}
              className={inputClassName}
              placeholder="לדוגמה: 35.235 (ירושלים)"
            />
          </div>
        </div>
      )}

      {showHouseZodiac && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>🏠</span>
                מערכת בתים
              </span>
            </label>
            <select
              name="houseSystem"
              value={form.houseSystem}
              onChange={onChange}
              className={inputClassName}
            >
              <option value="placidus">Placidus</option>
              <option value="whole-sign">Whole Sign</option>
              <option value="equal-house">Equal</option>
              <option value="koch">Koch</option>
              <option value="regiomontanus">Regiomontanus</option>
              <option value="campanus">Campanus</option>
              <option value="topocentric">Topocentric</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClassName}>
              <span className="flex items-center gap-2">
                <span>♈</span>
                מערכת זודיאק
              </span>
            </label>
            <select
              name="zodiac"
              value={form.zodiac}
              onChange={onChange}
              className={inputClassName}
            >
              <option value="tropical">Tropical (טרופי)</option>
              <option value="sidereal">Sidereal (כוכבי)</option>
            </select>
          </div>
        </div>
      )}

      {showSubmit && (
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isDark
                ? "bg-purple-600 text-white hover:bg-purple-700 border border-purple-500/20" 
                : "bg-purple-600 text-white hover:bg-purple-700"
            } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  מחשב את המפה...
                </>
              ) : (
                <>
                  <span>✨</span>
                  חשב מפה אסטרולוגית
                </>
              )}
            </span>
          </button>
        </div>
      )}
    </form>
  );
}
