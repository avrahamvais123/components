/**
 * פורמט מחיר עם סמל מטבע
 * @param {number} amount - הסכום
 * @param {string} currency - קוד המטבע (USD, EUR, ILS וכו')
 * @param {string} locale - המקום (he-IL, en-US וכו')
 * @returns {string} המחיר המפורמט
 */
export function formatPrice(amount, currency = 'USD', locale = 'he-IL') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * המרת מטבע (פונקציה בסיסית - בפרודקשן צריך API אמיתי)
 * @param {number} amount - הסכום
 * @param {string} fromCurrency - מטבע המקור
 * @param {string} toCurrency - מטבע היעד
 * @returns {Promise<number>} הסכום המומר
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  // זוהי דוגמה בסיסית - בפרודקשן השתמש ב-API כמו exchangerate-api.com
  const exchangeRates = {
    'USD': { 'ILS': 3.7, 'EUR': 0.85 },
    'ILS': { 'USD': 0.27, 'EUR': 0.23 },
    'EUR': { 'USD': 1.18, 'ILS': 4.35 },
  };

  if (fromCurrency === toCurrency) return amount;
  
  const rate = exchangeRates[fromCurrency]?.[toCurrency];
  if (!rate) {
    throw new Error(`המרה לא נתמכת מ-${fromCurrency} ל-${toCurrency}`);
  }
  
  return Math.round(amount * rate * 100) / 100;
}

/**
 * בדיקת תקינות סכום
 * @param {number} amount - הסכום לבדיקה
 * @returns {boolean} האם הסכום תקין
 */
export function isValidAmount(amount) {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

/**
 * עיגול סכום לשני מקומות אחרי הנקודה
 * @param {number} amount - הסכום לעיגול
 * @returns {number} הסכום מעוגל
 */
export function roundAmount(amount) {
  return Math.round(amount * 100) / 100;
}