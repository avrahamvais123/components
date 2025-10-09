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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg dark:shadow-2xl mb-6 transition-all duration-200">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
        ⚙️ הגדרות חישוב
      </h2>
      
      {/* בחירת עיר */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
        <label className="block mb-2 font-semibold text-sm text-gray-900 dark:text-gray-100">
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          📅 נתונים בסיסיים
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🗓️ תאריך לידה
            </span>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🕐 שעת לידה
            </span>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🌍 קו רוחב
            </span>
            <input
              name="lat"
              type="number"
              step="0.0001"
              value={form.lat}
              onChange={onChangeNum}
              placeholder="32.0853"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🗺️ קו אורך
            </span>
            <input
              name="lon"
              type="number"
              step="0.0001"
              value={form.lon}
              onChange={onChangeNum}
              placeholder="34.7818"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </label>
        </div>
      </div>

      {/* הגדרות מתקדמות */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          ⚙️ הגדרות מתקדמות
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🏠 שיטת בתים
            </span>
            <select
              name="houseSystem"
              value={form.houseSystem}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            >
              <option value="placidus">Placidus</option>
              <option value="koch">Koch</option>
              <option value="equal-house">Equal</option>
              <option value="whole-sign">Whole Sign</option>
            </select>
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              ♈ זודיאק
            </span>
            <select
              name="zodiac"
              value={form.zodiac}
              onChange={onChange}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            >
              <option value="tropical">Tropical</option>
              <option value="sidereal">Sidereal</option>
            </select>
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🔗 מצב היבטים
            </span>
            <select
              value={aspectMode}
              onChange={(e) => setAspectMode(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            >
              <option value="degree">לפי מעלות (עם אורב)</option>
              <option value="sign">לפי מזלות בלבד</option>
              <option value="none">ללא היבטים</option>
            </select>
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              📐 אורב (מעלות) {aspectMode !== "degree" ? "— לא בשימוש" : ""}
            </span>
            <input
              type="number"
              step="0.1"
              value={orb}
              onChange={(e) => setOrb(parseFloat(e.target.value))}
              disabled={aspectMode !== "degree"}
              placeholder="7.0"
              className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 outline-none ${
                aspectMode !== "degree" 
                  ? "opacity-50 cursor-not-allowed" 
                  : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 cursor-text"
              }`}
            />
          </label>
          
          <label className="block">
            <span className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
              🔢 פורמט בתים
            </span>
            <select
              value={houseFormat}
              onChange={(e) => setHouseFormat(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            >
              <option value="arabic">מספרים רגילים (1, 2, 3...)</option>
              <option value="roman">ספרות רומיות (I, II, III...)</option>
            </select>
          </label>
        </div>
      </div>

      {/* בחירת פלנטות לפרופיל יסודות/איכויות */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🪐 פלנטות לחישוב יסודות/איכויות
          </h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={setDefault} 
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer text-xs font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              ⭐ ברירת מחדל
            </button>
            <button 
              onClick={selectAll} 
              className="px-3 py-2 rounded-lg border border-emerald-500 bg-emerald-500 text-white cursor-pointer text-xs font-medium transition-all duration-200 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              ✅ בחר הכל
            </button>
            <button 
              onClick={clearAll} 
              className="px-3 py-2 rounded-lg border border-red-500 bg-red-500 text-white cursor-pointer text-xs font-medium transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              ❌ נקה הכל
            </button>
          </div>
        </div>
        
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          {PROFILE_ALL_KEYS.map((k) => (
            <label
              key={k}
              className={`flex gap-2 items-center p-2 rounded-lg cursor-pointer transition-all duration-200 select-none
                ${profileKeys.includes(k) 
                  ? "bg-white dark:bg-gray-800 border-2 border-blue-500 shadow-sm" 
                  : "border-2 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <input
                type="checkbox"
                checked={profileKeys.includes(k)}
                onChange={() => toggleKey(k)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span className={`text-sm transition-colors duration-200 ${
                profileKeys.includes(k) 
                  ? "font-semibold text-gray-900 dark:text-gray-100" 
                  : "font-normal text-gray-700 dark:text-gray-300"
              }`}>
                {PLANET_NAMES_HE[k]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 text-gray-100 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {loading ? "מחשב/ת… ⏳" : "חשב/י מפה 🚀"}
        </button>
        {error && (
          <div className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
