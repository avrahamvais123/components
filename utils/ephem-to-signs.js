// utils/ephem-to-signs.js
const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function norm360(x) {
  // מבטיח תחום 0..360
  const y = x % 360;
  return y < 0 ? y + 360 : y;
}

export function signFromLongitude(longitudeDd) {
  const idx = Math.floor(norm360(longitudeDd) / 30);
  return SIGNS[idx];
}

export function degWithinSign(longitudeDd) {
  return norm360(longitudeDd) % 30; // 0..30 (כמה מעלות בתוך המזל)
}

export function toSignMap(ephem) {
  const obs = ephem?.observed ?? {};
  const keys = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];

  const out = {};
  for (const k of keys) {
    const lon = obs?.[k]?.apparentLongitudeDd;
    if (typeof lon === "number") {
      out[k] = signFromLongitude(lon);
      // אם תרצה גם את המעלות בתוך המזל:
      out[`${k}Deg`] = +degWithinSign(lon).toFixed(2);
      // ואם חשוב לך לדעת נסיגה:
      out[`${k}Rx`] = !!obs?.[k]?.is_retrograde;
    }
  }
  return out;
}
