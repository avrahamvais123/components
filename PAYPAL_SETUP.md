# PayPal Integration Setup Guide

## הוראות הגדרה עבור PayPal

### 1. יצירת חשבון PayPal Developer

1. עבור לאתר [PayPal Developer](https://developer.paypal.com/)
2. התחבר או צור חשבון חדש
3. עבור ל"My Apps & Credentials"

### 2. יצירת אפליקציה חדשה

1. לחץ על "Create App"
2. בחר שם לאפליקציה
3. בחר "Sandbox" לפיתוח או "Live" לפרודקשן
4. בחר "Default Application" תחת Merchant
5. לחץ "Create App"

### 3. קבלת פרטי ה-API

לאחר יצירת האפליקציה, תקבל:
- **Client ID** - מזהה ציבורי
- **Client Secret** - מזהה סודי (לא לחשוף!)

### 4. הגדרת משתני הסביבה

צור או עדכן את הקובץ `.env.local` בשורש הפרויקט:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-actual-client-id-here
PAYPAL_CLIENT_SECRET=your-actual-client-secret-here
PAYPAL_ENVIRONMENT=sandbox
```

⚠️ **חשוב**: אל תעלה את ה-Client Secret לגיט! הוסף את `.env.local` ל`.gitignore`

### 5. הגדרת Webhooks (אופציונלי)

לקבלת התראות על סטטוס התשלומים:

1. בדשבורד PayPal, עבור ל"Webhooks"
2. לחץ "Create Webhook"
3. הוסף את ה-URL: `https://your-domain.com/api/paypal/webhook`
4. בחר את האירועים הרלוונטיים:
   - Payment capture completed
   - Payment capture denied
   - Checkout order approved

### 6. בדיקת הגדרה

1. הפעל את האפליקציה: `npm run dev`
2. עבור לעמוד Checkout
3. בחר תשלום PayPal
4. השתמש בפרטי בדיקה של PayPal Sandbox

### פרטי בדיקה לSandbox

**חשבון בדיקה:**
- Email: `sb-buyer@personal.example.com`
- Password: `password123`

או השתמש בכרטיס בדיקה:
- מספר: 4032033317844390
- תאריך תפוגה: כל תאריך עתידי
- CVV: כל 3 ספרות

### שגיאות נפוצות ופתרונות

#### שגיאה: "Client ID is invalid"
- בדוק שה-Client ID נכון ב-.env.local
- בדוק שהסביבה (sandbox/live) תואמת לחשבון

#### שגיאה: "CORS error"
- בדוק שה-domain מוגדר בהגדרות האפליקציה בPayPal

#### התשלום לא עובר
- בדוק ש-Webhook URLs מוגדרים נכון
- בדוק את הלוגים בדשבורד PayPal

### מעבר לפרודקשן

כאשר האפליקציה מוכנה:

1. צור אפליקציה חדשה עם "Live" environment
2. עדכן את משתני הסביבה:
   ```env
   PAYPAL_ENVIRONMENT=live
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-live-client-id
   PAYPAL_CLIENT_SECRET=your-live-client-secret
   ```
3. בדוק שכל הפונקציות עובדות עם תשלומים אמיתיים

### מידע נוסף

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)
- [PayPal Sandbox Testing](https://developer.paypal.com/developer/accounts/)