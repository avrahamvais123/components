import React from 'react';
import { PROFILE_ALL_KEYS, PROFILE_DEFAULT_INCLUDE, PLANET_NAMES_HE } from '../hooks/useAstroCalc';
import CityCombobox from './CityCombobox';
import { useTheme } from '../hooks/useTheme';

export default function AstroForm({ 
  form, 
  setForm, 
  aspectMode, 
  setAspectMode,
  orb, 
  setOrb,
  houseFormat, 
  setHouseFormat,
  profileKeys, 
  setProfileKeys,
  loading, 
  error, 
  onSubmit 
}) {
  const { isDark, tableColors } = useTheme();
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onChangeNum = (e) => setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });

  const toggleKey = (k) => {
    setProfileKeys((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const selectAll = () => setProfileKeys([...PROFILE_ALL_KEYS]);
  const clearAll = () => setProfileKeys([]);
  const setDefault = () => setProfileKeys([...PROFILE_DEFAULT_INCLUDE]);

  // סגנונות דינמיים
  const formStyles = {
    container: {
      background: isDark ? "#1f2937" : "#ffffff",
      border: `1px solid ${tableColors.border}`,
      borderRadius: 16,
      padding: 20,
      boxShadow: tableColors.boxShadow,
      marginBottom: 20,
    },
    label: {
      display: "block",
      marginBottom: 8,
      fontWeight: 600,
      fontSize: 14,
      color: tableColors.textPrimary,
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      borderRadius: 12,
      fontSize: 14,
      backgroundColor: isDark ? "#111827" : "#ffffff",
      color: tableColors.textPrimary,
      transition: "all 0.2s ease",
      outline: "none",
    },
    inputFocus: {
      borderColor: isDark ? "#6366f1" : "#3b82f6",
      boxShadow: `0 0 0 3px ${isDark ? "rgba(99, 102, 241, 0.1)" : "rgba(59, 130, 246, 0.1)"}`,
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      border: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      borderRadius: 12,
      fontSize: 14,
      backgroundColor: isDark ? "#111827" : "#ffffff",
      color: tableColors.textPrimary,
      cursor: "pointer",
      outline: "none",
    },
    gridContainer: {
      display: "grid",
      gap: 16,
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    sectionTitle: {
      margin: 0,
      marginBottom: 16,
      fontSize: 18,
      fontWeight: 700,
      color: tableColors.textPrimary,
      borderBottom: `2px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      paddingBottom: 8,
    },
    citySection: {
      background: isDark ? "#111827" : "#f8fafc",
      border: `1px solid ${tableColors.border}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    }
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.sectionTitle}>⚙️ הגדרות חישוב</h2>
      
      {/* בחירת עיר */}
      <div style={formStyles.citySection}>
        <label style={formStyles.label}>
          📍 בחר/י עיר
        </label>
        <CityCombobox
          language="he"
          limit={8}
          onSelect={(place) =>
            setForm((f) => ({ ...f, lat: place.lat, lon: place.lon }))
          }
        />
      </div>

      {/* נתונים בסיסיים */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ ...formStyles.sectionTitle, fontSize: 16, marginBottom: 12 }}>
          📅 נתונים בסיסיים
        </h3>
        <div style={formStyles.gridContainer}>
          <label style={formStyles.label}>
            🗓️ תאריך לידה
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              style={formStyles.input}
              onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
            />
          </label>
          
          <label style={formStyles.label}>
            🕐 שעת לידה
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={onChange}
              style={formStyles.input}
              onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
            />
          </label>
          
          <label style={formStyles.label}>
            🌍 קו רוחב
            <input
              name="lat"
              type="number"
              step="0.0001"
              value={form.lat}
              onChange={onChangeNum}
              style={formStyles.input}
              placeholder="32.0853"
              onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
            />
          </label>
          
          <label style={formStyles.label}>
            🗺️ קו אורך
            <input
              name="lon"
              type="number"
              step="0.0001"
              value={form.lon}
              onChange={onChangeNum}
              style={formStyles.input}
              placeholder="34.7818"
              onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
            />
          </label>
        </div>
      </div>

      {/* הגדרות מתקדמות */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ ...formStyles.sectionTitle, fontSize: 16, marginBottom: 12 }}>
          ⚙️ הגדרות מתקדמות
        </h3>
        <div style={formStyles.gridContainer}>
          <label style={formStyles.label}>
            🏠 שיטת בתים
            <select
              name="houseSystem"
              value={form.houseSystem}
              onChange={onChange}
              style={formStyles.select}
            >
              <option value="placidus">Placidus</option>
              <option value="koch">Koch</option>
              <option value="equal-house">Equal</option>
              <option value="whole-sign">Whole Sign</option>
            </select>
          </label>
          
          <label style={formStyles.label}>
            ♈ זודיאק
            <select
              name="zodiac"
              value={form.zodiac}
              onChange={onChange}
              style={formStyles.select}
            >
              <option value="tropical">Tropical</option>
              <option value="sidereal">Sidereal</option>
            </select>
          </label>
          
          <label style={formStyles.label}>
            🔗 מצב היבטים
            <select
              value={aspectMode}
              onChange={(e) => setAspectMode(e.target.value)}
              style={formStyles.select}
            >
              <option value="degree">לפי מעלות (עם אורב)</option>
              <option value="sign">לפי מזלות בלבד</option>
              <option value="none">ללא היבטים</option>
            </select>
          </label>
          
          <label style={formStyles.label}>
            📐 אורב (מעלות) {aspectMode !== "degree" ? "— לא בשימוש" : ""}
            <input
              type="number"
              step="0.1"
              value={orb}
              onChange={(e) => setOrb(parseFloat(e.target.value))}
              disabled={aspectMode !== "degree"}
              style={{
                ...formStyles.input,
                opacity: aspectMode !== "degree" ? 0.5 : 1,
                cursor: aspectMode !== "degree" ? "not-allowed" : "text"
              }}
              placeholder="7.0"
              onFocus={(e) => aspectMode === "degree" && Object.assign(e.target.style, formStyles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
            />
          </label>
          
          <label style={formStyles.label}>
            🔢 פורמט בתים
            <select
              value={houseFormat}
              onChange={(e) => setHouseFormat(e.target.value)}
              style={formStyles.select}
            >
              <option value="arabic">מספרים רגילים (1, 2, 3...)</option>
              <option value="roman">ספרות רומיות (I, II, III...)</option>
            </select>
          </label>
        </div>
      </div>

      {/* בחירת פלנטות לפרופיל יסודות/איכויות */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3 style={{ ...formStyles.sectionTitle, fontSize: 16, margin: 0, border: "none", padding: 0 }}>
            🪐 פלנטות לחישוב יסודות/איכויות
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button 
              onClick={setDefault} 
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                backgroundColor: isDark ? "#374151" : "#f9fafb",
                color: tableColors.textPrimary,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isDark ? "#4b5563" : "#f3f4f6";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isDark ? "#374151" : "#f9fafb";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ⭐ ברירת מחדל
            </button>
            <button 
              onClick={selectAll} 
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${isDark ? "#059669" : "#10b981"}`,
                backgroundColor: isDark ? "#059669" : "#10b981",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isDark ? "#047857" : "#059669";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isDark ? "#059669" : "#10b981";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ✅ בחר הכל
            </button>
            <button 
              onClick={clearAll} 
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${isDark ? "#dc2626" : "#ef4444"}`,
                backgroundColor: isDark ? "#dc2626" : "#ef4444",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isDark ? "#b91c1c" : "#dc2626";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isDark ? "#dc2626" : "#ef4444";
                e.target.style.transform = "translateY(0)";
              }}
            >
              ❌ נקה הכל
            </button>
          </div>
        </div>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            background: isDark ? "#111827" : "#f8fafc",
            border: `1px solid ${tableColors.border}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
          {PROFILE_ALL_KEYS.map((k) => (
            <label
              key={k}
              style={{ 
                display: "flex", 
                gap: 8, 
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: profileKeys.includes(k) 
                  ? (isDark ? "#1f2937" : "#ffffff")
                  : "transparent",
                border: profileKeys.includes(k)
                  ? `2px solid ${isDark ? "#3b82f6" : "#2563eb"}`
                  : `2px solid transparent`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                userSelect: "none",
              }}
              onMouseOver={(e) => {
                if (!profileKeys.includes(k)) {
                  e.target.style.backgroundColor = isDark ? "#1f2937" : "#ffffff";
                  e.target.style.borderColor = isDark ? "#4b5563" : "#d1d5db";
                }
              }}
              onMouseOut={(e) => {
                if (!profileKeys.includes(k)) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "transparent";
                }
              }}
            >
              <input
                type="checkbox"
                checked={profileKeys.includes(k)}
                onChange={() => toggleKey(k)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: isDark ? "#3b82f6" : "#2563eb",
                  cursor: "pointer"
                }}
              />
              <span style={{ 
                fontSize: 14, 
                fontWeight: profileKeys.includes(k) ? 600 : 400,
                color: tableColors.textPrimary
              }}>
                {PLANET_NAMES_HE[k]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          onClick={onSubmit}
          disabled={loading}
          style={{ padding: "10px 14px", fontWeight: 600 }}
        >
          {loading ? "מחשב/ת…" : "חשב/י מפה 🚀"}
        </button>
        {error && <span style={{ color: "crimson" }}>⚠️ {error}</span>}
      </div>
    </div>
  );
}
