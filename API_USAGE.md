# API לחישוב מפות אסטרולוגיות

## כתובת ה-API
```
POST /api/astro/calculate
```

## דוגמה לשימוש

### JavaScript/Fetch
```javascript
const calculateChart = async () => {
  try {
    const response = await fetch('/api/astro/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // נתונים חובה
        date: "2010-03-16",           // פורמט: YYYY-MM-DD
        time: "10:00",               // פורמט: HH:MM
        lat: 32.0853,                // קו רוחב (מספר)
        lon: 34.7818,                // קו אורך (מספר)
        
        // הגדרות אופציונליות
        houseSystem: "placidus",     // placidus, koch, equal-house, whole-sign
        zodiac: "tropical",          // tropical, sidereal
        aspectMode: "degree",        // none, sign, degree
        orb: 7,                      // אורב במעלות (רק עבור aspectMode: "degree")
        aspects: [                   // סוגי היבטים לחישוב
          "conjunction", 
          "sextile", 
          "square", 
          "trine", 
          "opposition"
        ],
        profileIncludeKeys: [        // פלנטות לכלול בפרופיל
          "sun", "moon", "mercury", "venus", "mars"
        ]
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('תוצאות המפה:', data.data);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('שגיאה בחישוב:', error);
    throw error;
  }
};
```

### cURL
```bash
curl -X POST http://localhost:3000/api/astro/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2010-03-16",
    "time": "10:00",
    "lat": 32.0853,
    "lon": 34.7818,
    "houseSystem": "placidus",
    "zodiac": "tropical",
    "aspectMode": "degree",
    "orb": 7,
    "profileIncludeKeys": ["sun", "moon", "mercury", "venus", "mars"]
  }'
```

### Python
```python
import requests
import json

def calculate_astro_chart(date, time, lat, lon, **kwargs):
    url = "http://localhost:3000/api/astro/calculate"
    
    payload = {
        "date": date,
        "time": time,
        "lat": lat,
        "lon": lon,
        **kwargs
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    if data.get("success"):
        return data["data"]
    else:
        raise Exception(data.get("error", "Unknown error"))

# דוגמה לשימוש
try:
    result = calculate_astro_chart(
        date="2010-03-16",
        time="10:00",
        lat=32.0853,
        lon=34.7818,
        houseSystem="placidus",
        aspectMode="degree",
        orb=7
    )
    print("המפה חושבה בהצלחה!")
    print(f"אופק: {result['angles']['ascendant']['signName']}")
except Exception as e:
    print(f"שגיאה: {e}")
```

## מבנה התגובה

### הצלחה (200)
```json
{
  "success": true,
  "data": {
    "meta": {
      "houseSystem": "placidus",
      "zodiac": "tropical",
      "timestamp": "2025-10-10T12:00:00.000Z",
      "input": {
        "date": "2010-03-16",
        "time": "10:00",
        "lat": 32.0853,
        "lon": 34.7818
      }
    },
    "angles": {
      "ascendant": {
        "deg": 125.4567,
        "signName": "אריה",
        "signGlyph": "♌︎",
        "degText": "5°27'",
        "degOnlyText": "5°"
      },
      "midheaven": { /* ... */ }
    },
    "houses": [ /* מערך 12 בתים */ ],
    "planets": [ /* מערך פלנטות */ ],
    "aspects": [ /* מערך היבטים */ ],
    "profile": {
      "considered": ["sun", "moon", "mercury", "venus", "mars"],
      "elements": {
        "counts": { "fire": 2, "earth": 1, "air": 1, "water": 1 },
        "percents": { "fire": 40, "earth": 20, "air": 20, "water": 20 },
        "missing": []
      },
      "qualities": { /* ... */ }
    }
  }
}
```

### שגיאה (400/500)
```json
{
  "success": false,
  "error": "תיאור השגיאה",
  "details": "פרטים נוספים על השגיאה"
}
```

## פרמטרים

### חובה
- `date` (string): תאריך לידה בפורמט YYYY-MM-DD
- `time` (string): שעת לידה בפורמט HH:MM  
- `lat` (number): קו רוחב
- `lon` (number): קו אורך

### אופציונליים
- `houseSystem` (string): שיטת חלוקת בתים - "placidus" | "koch" | "equal-house" | "whole-sign"
- `zodiac` (string): סוג זודיאק - "tropical" | "sidereal" 
- `aspectMode` (string): מצב חישוב היבטים - "none" | "sign" | "degree"
- `orb` (number): אורב במעלות (רק עבור aspectMode: "degree")
- `aspects` (array): רשימת סוגי היבטים לחישוב
- `profileIncludeKeys` (array): פלנטות לכלול בחישוב פרופיל יסודות/איכויות
- `profileExcludeKeys` (array): פלנטות להחריג מחישוב פרופיל

## פלנטות זמינות
- `sun` - שמש
- `moon` - ירח  
- `mercury` - מרקורי
- `venus` - ונוס
- `mars` - מרס
- `jupiter` - צדק
- `saturn` - שבתאי
- `uranus` - אורנוס
- `neptune` - נפטון
- `pluto` - פלוטו
- `chiron` - כירון
- `sirius` - סיריוס

## סוגי היבטים
- `conjunction` - חיבור (0°)
- `semisextile` - חצי סקסטיל (30°)
- `sextile` - סקסטיל (60°)
- `square` - ריבוע (90°)
- `trine` - משולש (120°)
- `quincunx` - קווינקונקס (150°)
- `opposition` - ניגוד (180°)

## הערות
- כל הזמנים הם בזמן מקומי
- התוצאות כוללות פרטים בעברית
- ה-API תומך בחישובים מורכבים כולל היבטים ופרופיל יסודות
