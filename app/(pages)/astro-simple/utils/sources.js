/** שמות מזלות (0° טלה, כל 30°) */
export const SIGNS = [
  "טלה",
  "שור",
  "תאומים",
  "סרטן",
  "אריה",
  "בתולה",
  "מאזניים",
  "עקרב",
  "קשת",
  "גדי",
  "דלי",
  "דגים",
];

// גליפים של המזלות לפי אינדקס 0..11
export const SIGN_GLYPHS = [
  "♈︎",
  "♉︎",
  "♊︎",
  "♋︎",
  "♌︎",
  "♍︎",
  "♎︎",
  "♏︎",
  "♐︎",
  "♑︎",
  "♒︎",
  "♓︎",
];

// מיפוי יסודות ואיכויות לפי אינדקס מזל (0: טלה, 1: שור, ... 11: דגים)
export const ELEMENT_KEY_BY_SIGN_INDEX = [
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
  "fire",
  "earth",
  "air",
  "water",
];
export const QUALITY_KEY_BY_SIGN_INDEX = [
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
  "cardinal",
  "fixed",
  "mutable",
];
export const ELEMENT_NAME_HE = {
  fire: "אש",
  earth: "אדמה",
  air: "אוויר",
  water: "מים",
};
export const QUALITY_NAME_HE = {
  cardinal: "קרדינלי",
  fixed: "קבוע",
  mutable: "משתנה",
};

// בחירות ברירת מחדל למדדי יסודות/איכויות
export const DEFAULT_STATS_KEYS = [
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

// רשימת פלנטות זמינה לבחירה (כולל אופציונליות)
export const STATS_CHOICES = [
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
  "chiron",
  "lilith",
  "truenode",
];

/** תרגומי פלנטות/נקודות לעברית לפי key/label נפוצים */
export const PLANET_NAMES_HE_BY_KEY = {
  sun: "שמש",
  moon: "ירח",
  mercury: "מרקורי",
  venus: "ונוס",
  mars: "מרס",
  jupiter: "צדק",
  saturn: "שבתאי",
  uranus: "אורנוס",
  neptune: "נפטון",
  pluto: "פלוטו",
  chiron: "כירון",
  truenode: "ראש דרקון",
  meannode: "ראש דרקון (ממוצע)",
  northnode: "ראש דרקון",
  southnode: "זנב דרקון",
  lilith: "לילית",
  ascendant: "מזל עולה",
  midheaven: "מרום השמים",
  sirius: "סיריוס",
};

/** גליפים לפלנטות/נקודות */
export const PLANET_GLYPHS_BY_KEY = {
  sun: "☉",
  moon: "☾",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  chiron: "⚷",
  truenode: "☊",
  meannode: "☊",
  northnode: "☊",
  southnode: "☋",
  lilith: "⚸",
  ascendant: "ASC",
  midheaven: "MC",
  sirius: "★",
};
export const PLANET_GLYPHS_BY_EN = {
  Sun: "☉",
  Moon: "☾",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
  Chiron: "⚷",
  "True Node": "☊",
  "Mean Node": "☊",
  "North Node": "☊",
  "South Node": "☋",
  Lilith: "⚸",
  Ascendant: "ASC",
  Midheaven: "MC",
  Sirius: "★",
};

/** גליפים להיבטים */
export const ASPECT_GLYPHS = {
  conjunction: "☌",
  opposition: "☍",
  trine: "△",
  square: "□",
  sextile: "✶",
  semisextile: "⚺",
  quincunx: "⚻",
};
export const PLANET_NAMES_HE_BY_EN = {
  Sun: "שמש",
  Moon: "ירח",
  Mercury: "מרקורי",
  Venus: "ונוס",
  Mars: "מרס",
  Jupiter: "צדק",
  Saturn: "שבתאי",
  Uranus: "אורנוס",
  Neptune: "נפטון",
  Pluto: "פלוטו",
  Chiron: "כירון",
  "True Node": "ראש דרקון",
  "Mean Node": "ראש דרקון (ממוצע)",
  "North Node": "ראש דרקון",
  "South Node": "זנב דרקון",
  Lilith: "לילית",
  Ascendant: "מזל עולה",
  Midheaven: "מרום השמים",
  Sirius: "סיריוס",
};

/** סוגי היבטים לבחירה */
export const ASPECT_TYPES = [
  { key: 'conjunction', labelHe: 'צמידות', labelEn: 'conjunction' },
  { key: 'opposition', labelHe: 'מולות', labelEn: 'opposition' },
  { key: 'trine', labelHe: 'טריין', labelEn: 'trine' },
  { key: 'square', labelHe: 'ריבוע', labelEn: 'square' },
  { key: 'sextile', labelHe: 'שישית', labelEn: 'sextile' },
  { key: 'semisextile', labelHe: 'חצי־שישית', labelEn: 'semisextile' },
  { key: 'quincunx', labelHe: 'קווינקנקס', labelEn: 'quincunx' },
  { key: 'semisquare', labelHe: 'חצי־ריבוע', labelEn: 'semisquare' },
  { key: 'sesquiquadrate', labelHe: 'ריבוע־וחצי', labelEn: 'sesquiquadrate' },
  { key: 'quintile', labelHe: 'קווינטיל', labelEn: 'quintile' },
  { key: 'biquintile', labelHe: 'בי־קווינטיל', labelEn: 'biquintile' }
];

/** היבטים עיקריים (ברירת מחדל) */
export const DEFAULT_ASPECT_TYPES = [
  'conjunction', 'opposition', 'trine', 'square', 'sextile'
];

/** כל סוגי ההיבטים */
export const ALL_ASPECT_TYPES = ASPECT_TYPES.map(a => a.key);

// אורב ברירת מחדל לכל סוג היבט (במעלות)
export const DEFAULT_ASPECT_ORBS = {
  conjunction: 8,
  opposition: 8,
  square: 7,
  trine: 7,
  sextile: 6,
  semisextile: 2,
  quincunx: 3,
  semisquare: 2,
  sesquiquadrate: 2,
  quintile: 1.5,
  biquintile: 1.5,
};

/** תרגומי בתים לעברית */
export const HOUSE_ORDINALS_HE = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שביעי",
  "שמיני",
  "תשיעי",
  "עשירי",
  "אחד עשר",
  "שנים עשר",
];

export const HOUSE_LABELS_HE_BY_EN = {
  First: "ראשון",
  Second: "שני",
  Third: "שלישי",
  Fourth: "רביעי",
  Fifth: "חמישי",
  Sixth: "שישי",
  Seventh: "שביעי",
  Eighth: "שמיני",
  Ninth: "תשיעי",
  Tenth: "עשירי",
  Eleventh: "אחד עשר",
  Twelfth: "שנים עשר",
};