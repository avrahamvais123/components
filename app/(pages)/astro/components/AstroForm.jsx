import React from 'react';
import { PROFILE_ALL_KEYS, PROFILE_DEFAULT_INCLUDE, PLANET_NAMES_HE } from '../hooks/useAstroCalc';
import CityCombobox from './CityCombobox';
import { useTheme } from '../hooks/useTheme';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            ⚙️ הגדרות חישוב
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* בחירת עיר */}
        <div className="space-y-2">
          <Label className="text-base flex items-center gap-2">
            📍 בחר/י עיר
          </Label>
          <div className="bg-muted/30 rounded-lg p-4">
            <CityCombobox
              language="he"
              limit={8}
              onSelect={(place) =>
                setForm((f) => ({ ...f, lat: place.lat, lon: place.lon }))
              }
            />
          </div>
        </div>

        {/* נתונים בסיסיים */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📅 נתונים בסיסיים
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                🗓️ תאריך לידה
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                🕐 שעת לידה
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={onChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lat" className="flex items-center gap-2">
                🌍 קו רוחב
              </Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={onChangeNum}
                placeholder="32.0853"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lon" className="flex items-center gap-2">
                🗺️ קו אורך
              </Label>
              <Input
                id="lon"
                name="lon"
                type="number"
                step="0.0001"
                value={form.lon}
                onChange={onChangeNum}
                placeholder="34.7818"
              />
            </div>
          </div>
        </div>

        {/* הגדרות מתקדמות */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            ⚙️ הגדרות מתקדמות
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                🏠 שיטת בתים
              </Label>
              <Select
                value={form.houseSystem}
                onValueChange={(value) => setForm({...form, houseSystem: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placidus">Placidus</SelectItem>
                  <SelectItem value="koch">Koch</SelectItem>
                  <SelectItem value="equal-house">Equal</SelectItem>
                  <SelectItem value="whole-sign">Whole Sign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                ♈ זודיאק
              </Label>
              <Select
                value={form.zodiac}
                onValueChange={(value) => setForm({...form, zodiac: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tropical">Tropical</SelectItem>
                  <SelectItem value="sidereal">Sidereal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="flex items-center gap-2 cursor-help">
                    🔗 מצב היבטים
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>בחירת שיטת חישוב היבטים: מדויק (מעלות), מהיר (מזלות) או כלל</p>
                </TooltipContent>
              </Tooltip>
              <Select
                value={aspectMode}
                onValueChange={setAspectMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">לפי מעלות (עם אורב)</SelectItem>
                  <SelectItem value="sign">לפי מזלות בלבד</SelectItem>
                  <SelectItem value="none">ללא היבטים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="flex items-center gap-2 cursor-help">
                    📐 אורב (מעלות) {aspectMode !== "degree" ? "— לא בשימוש" : ""}
                  </Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>הטווח המקסימלי בו היבט נחשב תקף. ברירת מחדל: 7 מעלות</p>
                </TooltipContent>
              </Tooltip>
              <Input
                type="number"
                step="0.1"
                value={orb}
                onChange={(e) => setOrb(parseFloat(e.target.value))}
                disabled={aspectMode !== "degree"}
                placeholder="7.0"
                className={aspectMode !== "degree" ? "opacity-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                🔢 פורמט בתים
              </Label>
              <Select
                value={houseFormat}
                onValueChange={setHouseFormat}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">מספרים רגילים (1, 2, 3...)</SelectItem>
                  <SelectItem value="roman">ספרות רומיות (I, II, III...)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* בחירת פלנטות לפרופיל יסודות/איכויות */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🪐 פלנטות לחישוב יסודות/איכויות
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={setDefault}
                className="gap-1"
              >
                ⭐ ברירת מחדל
              </Button>
              <Button 
                type="button"
                variant="default" 
                size="sm"
                onClick={selectAll}
                className="bg-emerald-500 hover:bg-emerald-600 gap-1"
              >
                ✅ בחר הכל
              </Button>
              <Button 
                type="button"
                variant="destructive" 
                size="sm"
                onClick={clearAll}
                className="gap-1"
              >
                ❌ נקה הכל
              </Button>
            </div>
          </div>
          
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bg-muted/30 rounded-lg p-4">
            {PROFILE_ALL_KEYS.map((k) => (
              <div key={k} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={k}
                  checked={profileKeys.includes(k)}
                  onCheckedChange={() => toggleKey(k)}
                />
                <Label
                  htmlFor={k}
                  className={`text-sm cursor-pointer transition-colors ${
                    profileKeys.includes(k) 
                      ? "font-semibold" 
                      : "font-normal"
                  }`}
                >
                  {PLANET_NAMES_HE[k]}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            size="lg"
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                מחשב/ת…
              </span>
            ) : (
              "חשב/י מפה 🚀"
            )}
          </Button>
          {error && (
            <div className="flex items-center px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              ⚠️ {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}
