"use client";

export default function AstroForm({ form, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 items-end">
      <label className="flex flex-col gap-1">
        <span>תאריך לידה</span>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className="border rounded p-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>שעת לידה (מקומית)</span>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={onChange}
          className="border rounded p-2"
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>קו־רוחב (lat)</span>
        <input
          type="text"
          inputMode="decimal"
          name="lat"
          value={form.lat}
          onChange={onChange}
          className="border rounded p-2"
          placeholder="לדוגמה: 31.778"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>קו־אורך (lon)</span>
        <input
          type="text"
          inputMode="decimal"
          name="lon"
          value={form.lon}
          onChange={onChange}
          className="border rounded p-2"
          placeholder="לדוגמה: 35.235"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>House System</span>
        <select
          name="houseSystem"
          value={form.houseSystem}
          onChange={onChange}
          className="border rounded p-2"
        >
          <option value="placidus">Placidus</option>
          <option value="whole-sign">Whole Sign</option>
          <option value="equal-house">Equal</option>
          <option value="koch">Koch</option>
          <option value="regiomontanus">Regiomontanus</option>
          <option value="campanus">Campanus</option>
          <option value="topocentric">Topocentric</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span>Zodiac</span>
        <select
          name="zodiac"
          value={form.zodiac}
          onChange={onChange}
          className="border rounded p-2"
        >
          <option value="tropical">Tropical</option>
          <option value="sidereal">Sidereal</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="md:col-span-2 bg-black text-white rounded p-3"
      >
        {loading ? "מחשב..." : "חשב מפה"}
      </button>
    </form>
  );
}
