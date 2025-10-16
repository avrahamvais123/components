"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// ייבוא מותנה כדי למנוע שגיאות
let calculateFullAstroChart = null;
let checkSwissephAvailability = null;
let getSignFromLongitude = null;
let formatDegree = null;
let calculateAspects = null;
let getElementalDistribution = null;
let AspectsDisplay = null;
let DetailedChart = null;
let saveChart = null;
let getSavedCharts = null;
let deleteChart = null;
let exportChart = null;
let importChart = null;

// נסיון טעינה של הקומפוננטות
try {
  const astroCalcModule = require('./components/astroCalculations');
  calculateFullAstroChart = astroCalcModule.calculateFullAstroChart;
  checkSwissephAvailability = astroCalcModule.checkSwissephAvailability;
  getSignFromLongitude = astroCalcModule.getSignFromLongitude;
  formatDegree = astroCalcModule.formatDegree;
} catch (error) {
  console.warn('Could not load astroCalculations:', error.message);
}

try {
  const aspectsModule = require('./components/aspects');
  calculateAspects = aspectsModule.calculateAspects;
  getElementalDistribution = aspectsModule.getElementalDistribution;
} catch (error) {
  console.warn('Could not load aspects:', error.message);
}

try {
  AspectsDisplay = require('./components/AspectsDisplay').default;
} catch (error) {
  console.warn('Could not load AspectsDisplay:', error.message);
}

try {
  DetailedChart = require('./components/DetailedChart').default;
} catch (error) {
  console.warn('Could not load DetailedChart:', error.message);
}

try {
  const storageModule = require('./components/chartStorage');
  saveChart = storageModule.saveChart;
  getSavedCharts = storageModule.getSavedCharts;
  deleteChart = storageModule.deleteChart;
  exportChart = storageModule.exportChart;
  importChart = storageModule.importChart;
} catch (error) {
  console.warn('Could not load chartStorage:', error.message);
}

const AstroCalculator = () => {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    latitude: '',
    longitude: ''
  });
  const [astroChart, setAstroChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [swissephAvailable, setSwissephAvailable] = useState(false);
  const [aspects, setAspects] = useState([]);
  const [elementalDistribution, setElementalDistribution] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  const [savedCharts, setSavedCharts] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chartName, setChartName] = useState('');

  // רשימת הכוכבים לחישוב
  const celestialBodies = {
    0: 'שמש (Sun)',
    1: 'ירח (Moon)',
    2: 'מרקורי (Mercury)',
    3: 'ונוס (Venus)',
    4: 'מרס (Mars)',
    5: 'יופיטר (Jupiter)',
    6: 'סטורן (Saturn)',
    7: 'אורנוס (Uranus)',
    8: 'נפטון (Neptune)',
    9: 'פלוטו (Pluto)',
    15: 'כירון (Chiron)',
    // מחושב בנפרד
    'lilith': 'לילית (Lilith)'
  };

  const signs = [
    'טלה', 'שור', 'תאומים', 'סרטן', 'אריה', 'בתולה',
    'מאזניים', 'עקרב', 'קשת', 'גדי', 'דלי', 'דגים'
  ];

  const houses = [
    'בית ראשון - אישיות',
    'בית שני - רכוש וערכים',
    'בית שלישי - תקשורת',
    'בית רביעי - בית ומשפחה',
    'בית חמישי - יצירתיות ואהבה',
    'בית שישי - עבודה ובריאות',
    'בית שביעי - שותפויות',
    'בית שמיני - טרנספורמציה',
    'בית תשיעי - פילוסופיה',
    'בית עשירי - קריירה',
    'בית אחד עשר - חברות',
    'בית שנים עשר - רוחניות'
  ];

  // בדיקת זמינות הספרייה בטעינת הקומפוננטה
  useEffect(() => {
    const checkLibrary = async () => {
      try {
        if (checkSwissephAvailability) {
          const available = await checkSwissephAvailability();
          setSwissephAvailable(available);
        } else {
          setSwissephAvailable(false);
        }
      } catch (error) {
        console.log('SwissEph not available, using mock data');
        setSwissephAvailable(false);
      }
    };
    
    checkLibrary();
    loadSavedCharts();
  }, []);

  const loadSavedCharts = () => {
    try {
      if (getSavedCharts) {
        const charts = getSavedCharts();
        setSavedCharts(charts);
      } else {
        setSavedCharts([]);
      }
    } catch (error) {
      console.error('Error loading saved charts:', error);
      setSavedCharts([]);
    }
  };

  const handleInputChange = (field, value) => {
    setBirthData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateInputs = () => {
    if (!birthData.date || !birthData.time || !birthData.latitude || !birthData.longitude) {
      setError('יש למלא את כל השדות');
      return false;
    }

    const lat = parseFloat(birthData.latitude);
    const lng = parseFloat(birthData.longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('נתוני הקואורדינטות לא תקינים');
      return false;
    }

    return true;
  };

  const calculateAstroChart = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');

    try {
      let chart;
      
      if (swissephAvailable && calculateFullAstroChart) {
        // חישוב אמיתי עם swisseph-wasm
        console.log('Using SwissEph for calculations...');
        chart = await calculateFullAstroChart(birthData);
      } else {
        // חישוב מדומה אם הספרייה לא זמינה
        console.log('Using mock data...');
        chart = await calculateMockChart();
      }
      
      setAstroChart(chart);
      
      // חישוב אספקטים וחלוקה אלמנטלית
      if (chart && chart.planets) {
        if (calculateAspects) {
          const chartAspects = calculateAspects(chart.planets);
          setAspects(chartAspects);
        }
        if (getElementalDistribution) {
          const distribution = getElementalDistribution(chart.planets);
          setElementalDistribution(distribution);
        }
      }
    } catch (err) {
      console.error('Calculation error:', err);
      setError('שגיאה בחישוב המפה האסטרולוגית: ' + err.message);
    }

    setLoading(false);
  };

  const handleSaveChart = () => {
    if (!astroChart || !saveChart) return;
    
    try {
      const chartData = {
        birthData,
        chart: astroChart,
        aspects,
        elementalDistribution
      };
      
      saveChart(chartData, chartName);
      loadSavedCharts();
      setShowSaveDialog(false);
      setChartName('');
      setError('');
    } catch (err) {
      setError('שגיאה בשמירת המפה: ' + err.message);
    }
  };

  const handleLoadChart = (savedChart) => {
    setBirthData(savedChart.birthData);
    setAstroChart(savedChart.chart);
    setAspects(savedChart.aspects || []);
    setElementalDistribution(savedChart.elementalDistribution || null);
    setError('');
  };

  const handleDeleteChart = (chartId) => {
    if (!deleteChart) return;
    
    try {
      deleteChart(chartId);
      loadSavedCharts();
    } catch (err) {
      setError('שגיאה במחיקת המפה: ' + err.message);
    }
  };

  const handleExportChart = () => {
    if (!astroChart || !exportChart) return;
    
    try {
      const chartData = {
        birthData,
        chart: astroChart,
        aspects,
        elementalDistribution
      };
      
      exportChart(chartData, chartName || 'מפה אסטרולוגית');
    } catch (err) {
      setError('שגיאה בייצוא המפה: ' + err.message);
    }
  };

  const handleImportChart = (event) => {
    const file = event.target.files[0];
    if (!file || !importChart) return;
    
    importChart(file)
      .then(chartData => {
        setBirthData(chartData.birthData);
        setAstroChart(chartData.chart);
        setAspects(chartData.aspects || []);
        setElementalDistribution(chartData.elementalDistribution || null);
        setError('');
      })
      .catch(err => {
        setError('שגיאה בייבוא המפה: ' + err.message);
      });
  };

  // פונקציה לחישוב מזל מקו אורך
  const calculateSignFromLongitude = (longitude) => {
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex % 12];
  };

  // פונקציה לחישוב מעלות ודקות
  const calculateDegreeMinutes = (longitude) => {
    const degree = longitude % 30;
    const minutes = (degree % 1) * 60;
    return `${Math.floor(degree)}°${Math.floor(minutes)}'`;
  };

  // פונקציה לקביעת בית לפי קו אורך
  const determineHouseFromLongitude = (planetLongitude, ascendantLongitude) => {
    let house = Math.floor((planetLongitude - ascendantLongitude + 360) / 30) + 1;
    if (house > 12) house -= 12;
    if (house < 1) house += 12;
    return house;
  };

  // חישוב מדומה - לשימוש כאשר swisseph-wasm לא זמין
  const calculateMockChart = async () => {
    // סימולציה של זמן חישוב
    await new Promise(resolve => setTimeout(resolve, 1500));

    // חישוב דינמי בסיסי לפי התאריך
    const birthDate = new Date(birthData.date + 'T' + birthData.time);
    const dayOfYear = Math.floor((birthDate - new Date(birthDate.getFullYear(), 0, 0)) / 86400000);
    const latitude = parseFloat(birthData.latitude) || 32.0853;
    
    // חישוב אסצנדנט משוער לפי שעה וקו רוחב
    const timeOffset = (birthDate.getHours() + birthDate.getMinutes() / 60) * 15; // 15 מעלות לשעה
    const latitudeOffset = latitude * 1.5; // השפעת קו הרוחב
    const ascendantLong = (timeOffset + latitudeOffset + dayOfYear) % 360;
    
    // חישוב מיקומי כוכבי לכת דינמי (משוער)
    const sunLongitude = (dayOfYear - 80) * (360 / 365.25); // שמש מתחילה בטלה ב-21 במרץ
    
    const planetData = [
      { id: 0, name: 'שמש (Sun)', longitude: sunLongitude % 360, speed: 0.9856 },
      { id: 1, name: 'ירח (Moon)', longitude: (sunLongitude + dayOfYear * 13) % 360, speed: 13.1764 },
      { id: 2, name: 'מרקורי (Mercury)', longitude: (sunLongitude + Math.sin(dayOfYear * 0.1) * 25) % 360, speed: 1.3833 },
      { id: 3, name: 'ונוס (Venus)', longitude: (sunLongitude + dayOfYear * 0.6) % 360, speed: 1.2021 },
      { id: 4, name: 'מרס (Mars)', longitude: (sunLongitude + dayOfYear * 0.5) % 360, speed: 0.5240 },
      { id: 5, name: 'יופיטר (Jupiter)', longitude: (sunLongitude + dayOfYear * 0.08) % 360, speed: 0.0831 },
      { id: 6, name: 'סטורן (Saturn)', longitude: (sunLongitude + dayOfYear * 0.03) % 360, speed: 0.0335 },
      { id: 7, name: 'אורנוס (Uranus)', longitude: (sunLongitude + dayOfYear * 0.012) % 360, speed: 0.0117 },
      { id: 8, name: 'נפטון (Neptune)', longitude: (sunLongitude + dayOfYear * 0.006) % 360, speed: 0.0060 },
      { id: 9, name: 'פלוטו (Pluto)', longitude: (sunLongitude + dayOfYear * 0.004) % 360, speed: 0.0039 },
      { id: 15, name: 'כירון (Chiron)', longitude: (sunLongitude + dayOfYear * 0.04) % 360, speed: 0.0407 },
      { id: 'lilith', name: 'לילית (Lilith)', longitude: (sunLongitude + dayOfYear * 0.11) % 360, speed: 0.1107 }
    ];

    const planets = {};
    planetData.forEach(planet => {
      const sign = calculateSignFromLongitude(planet.longitude);
      const degree = calculateDegreeMinutes(planet.longitude);
      const house = determineHouseFromLongitude(planet.longitude, ascendantLong);
      
      planets[planet.id] = {
        name: planet.name,
        longitude: planet.longitude,
        sign: sign,
        degree: degree,
        house: house,
        speed: planet.speed
      };
    });

    // חישוב בתים נכון
    const houses = {};
    for (let i = 1; i <= 12; i++) {
      const houseLongitude = (ascendantLong + (i - 1) * 30) % 360;
      houses[i] = {
        longitude: houseLongitude,
        sign: calculateSignFromLongitude(houseLongitude),
        degree: calculateDegreeMinutes(houseLongitude)
      };
    }

    const mockPositions = {
      planets: planets,
      houses: houses,
      ascendant: { 
        longitude: ascendantLong, 
        sign: calculateSignFromLongitude(ascendantLong), 
        degree: calculateDegreeMinutes(ascendantLong) 
      },
      midheaven: { 
        longitude: (ascendantLong + 270) % 360, 
        sign: calculateSignFromLongitude((ascendantLong + 270) % 360), 
        degree: calculateDegreeMinutes((ascendantLong + 270) % 360) 
      }
    };

    return mockPositions;
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">מחשבון אסטרולוגי מתקדם</h1>
          <p className="text-gray-600">הזן את פרטי הלידה שלך לקבלת מפה אסטרולוגית מלאה</p>
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
          {/* טופס הזנת נתונים */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">פרטי לידה</h2>
            
            {/* הודעה על מצב הספרייה */}
            <div className={`p-3 rounded-md mb-4 text-sm ${
              swissephAvailable 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              {swissephAvailable 
                ? '✓ מנוע החישובים האסטרולוגיים פעיל - תקבל חישובים מדויקים של Swiss Ephemeris'
                : '⚠️ מנוע החישובים לא זמין - מוצגים חישובים משוערים לפי התאריך והמיקום'
              }
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">תאריך לידה</Label>
                <Input
                  id="date"
                  type="date"
                  value={birthData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="time">שעת לידה</Label>
                <Input
                  id="time"
                  type="time"
                  value={birthData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="latitude">קו רוחב (Latitude)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="לדוגמה: 32.0853 (תל אביב)"
                  value={birthData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  🌐 חיפוש קואורדינטות: Google Maps → לחיצה ימנית על המיקום
                </div>
              </div>

              <div>
                <Label htmlFor="longitude">קו אורך (Longitude)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="לדוגמה: 34.7818 (תל אביב)"
                  value={birthData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 mt-1">
                  ירושלים: 31.7683, 35.2137 | חיפה: 32.8156, 34.9892
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                onClick={calculateAstroChart}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? 'מחשב מפה אסטרולוגית...' : 'חשב מפה אסטרולוגית'}
              </Button>

              {astroChart && (
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  variant="outline"
                  className="w-full mt-2"
                >
                  שמור מפה
                </Button>
              )}

              {/* דוגמאות מהירות */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">דוגמאות מהירות:</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setBirthData({
                      date: '1990-07-15',
                      time: '14:30',
                      latitude: '32.0853',
                      longitude: '34.7818'
                    })}
                    className="text-xs text-blue-600 hover:underline block"
                  >
                    15/7/1990, 14:30, תל אביב
                  </button>
                  <button
                    onClick={() => setBirthData({
                      date: '1985-03-21',
                      time: '09:15',
                      latitude: '31.7683',
                      longitude: '35.2137'
                    })}
                    className="text-xs text-blue-600 hover:underline block"
                  >
                    21/3/1985, 09:15, ירושלים
                  </button>
                  <button
                    onClick={() => setBirthData({
                      date: '1995-12-05',
                      time: '20:45',
                      latitude: '32.8156',
                      longitude: '34.9892'
                    })}
                    className="text-xs text-blue-600 hover:underline block"
                  >
                    5/12/1995, 20:45, חיפה
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* תוצאות */}
          <Card className="p-6 xl:col-span-2">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'chart'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  מפה אסטרולוגית
                </button>
                <button
                  onClick={() => setActiveTab('aspects')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'aspects'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  אספקטים
                </button>
                <button
                  onClick={() => setActiveTab('detailed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'detailed'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  מפורט
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  מפות שמורות
                </button>
              </div>
            </div>
            
            {!astroChart && !loading && (
              <div className="text-center text-gray-500 py-12">
                הזן פרטי לידה וחשב את המפה האסטרולוגית
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p>מחשב מיקומי כוכבי לכת ובתים...</p>
              </div>
            )}

            {astroChart && activeTab === 'chart' && (
              <div className="space-y-6">
                {/* כוכבי לכת */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">כוכבי לכת</h3>
                  <div className="grid gap-3">
                    {Object.entries(astroChart.planets).map(([id, planet]) => {
                      if (!planet || !planet.name) return null;
                      
                      return (
                        <div key={id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{planet.name}</span>
                          <div className="text-left">
                            <div className="text-sm text-gray-600">
                              {planet.sign} {planet.degree}
                            </div>
                            <div className="text-xs text-gray-500">
                              בית {planet.house}
                            </div>
                            {planet.speed && (
                              <div className="text-xs text-blue-500">
                                מהירות: {planet.speed.toFixed(4)}°/יום
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* נקודות מיוחדות */}
                {astroChart.ascendant && astroChart.midheaven && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">נקודות מיוחדות</h3>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">אסצנדנט (AC)</span>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">
                            {astroChart.ascendant.sign} {astroChart.ascendant.degree}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">MC (תווי השמים)</span>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">
                            {astroChart.midheaven.sign} {astroChart.midheaven.degree}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* בתים */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">בתים אסטרולוגיים</h3>
                  <div className="grid gap-2">
                    {houses.map((house, index) => {
                      const houseNumber = index + 1;
                      const houseData = astroChart.houses[houseNumber];
                      
                      if (!houseData) return null;
                      
                      return (
                        <div key={houseNumber} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                          <span className="text-sm">{house}</span>
                          <span className="text-sm font-mono">
                            {houseData.sign} {houseData.degree}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {astroChart && activeTab === 'aspects' && AspectsDisplay && (
              <AspectsDisplay 
                aspects={aspects} 
                elementalDistribution={elementalDistribution}
              />
            )}

            {astroChart && activeTab === 'aspects' && !AspectsDisplay && (
              <div className="text-center py-8 text-gray-500">
                רכיב האספקטים לא זמין
              </div>
            )}

            {astroChart && activeTab === 'detailed' && DetailedChart && (
              <DetailedChart astroChart={astroChart} />
            )}

            {astroChart && activeTab === 'detailed' && !DetailedChart && (
              <div className="text-center py-8 text-gray-500">
                התצוגה המפורטת לא זמינה
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">מפות שמורות</h3>
                
                {/* כפתורי ייבוא וייצוא */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleExportChart}
                    disabled={!astroChart}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    ↓ ייצוא מפה
                  </Button>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportChart}
                      className="hidden"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                      ↑ ייבוא מפה
                    </Button>
                  </label>
                </div>

                {savedCharts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    אין מפות שמורות
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedCharts.map(chart => (
                      <div key={chart.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{chart.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(chart.createdAt).toLocaleDateString('he-IL')} - {chart.birthData.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleLoadChart(chart)}
                            size="sm"
                            variant="outline"
                          >
                            טען
                          </Button>
                          <Button
                            onClick={() => handleDeleteChart(chart.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            מחק
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* הערות והסברים */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">הערות שימוש</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• להתקנת הספרייה הרץ: <code className="bg-gray-100 px-2 py-1 rounded">npm install swisseph-wasm</code></p>
            <p>• הקואורדינטות צריכות להיות במעלות עשרוניות (לדוגמה: תל אביב 32.0853, 34.7818)</p>
            <p>• המחשבון כולל: שמש, ירח, מרקורי, ונוס, מרס, יופיטר, סטורן, אורנוס, נפטון, פלוטו, כירון ולילית</p>
            <p>• מציג גם את כל 12 הבתים האסטרולוגיים, אסצנדנט ו-MC</p>
            <p>• {swissephAvailable ? 'החישובים מתבצעים עם מנוע Swiss Ephemeris המדויק' : 'כרגע מוצגים חישובים משוערים בסיסיים - התקן את הספרייה לחישובים מדויקים'}</p>
          </div>
        </Card>

        {/* דיאלוג שמירה */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">שמירת מפה אסטרולוגית</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chartName">שם המפה</Label>
                  <Input
                    id="chartName"
                    value={chartName}
                    onChange={(e) => setChartName(e.target.value)}
                    placeholder="הזן שם למפה..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveChart}
                    className="flex-1"
                    disabled={!chartName.trim()}
                  >
                    שמור
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSaveDialog(false);
                      setChartName('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  return <AstroCalculator />;
};

export default Page;
