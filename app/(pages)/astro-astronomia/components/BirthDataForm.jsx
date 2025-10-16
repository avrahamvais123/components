"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BirthDataForm = ({ onCalculate, isLoading }) => {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    latitude: '',
    longitude: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  // דוגמה מהירה לבדיקה
  const loadSampleData = () => {
    setFormData({
      birthDate: '1990-06-15',
      birthTime: '14:30',
      latitude: '32.0853',
      longitude: '34.7818',
      location: 'תל אביב'
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.birthDate) {
      newErrors.birthDate = 'תאריך לידה נדרש';
    }

    if (!formData.birthTime) {
      newErrors.birthTime = 'שעת לידה נדרשת';
    }

    if (!formData.latitude || isNaN(formData.latitude) || 
        formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'קו רוחב חייב להיות בין -90 ל-90';
    }

    if (!formData.longitude || isNaN(formData.longitude) || 
        formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'קו אורך חייב להיות בין -180 ל-180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // דוגמאות למיקומים נפוצים
  const commonLocations = [
    { name: 'תל אביב', lat: 32.0853, lng: 34.7818 },
    { name: 'ירושלים', lat: 31.7683, lng: 35.2137 },
    { name: 'חיפה', lat: 32.7940, lng: 34.9896 },
    { name: 'באר שבע', lat: 31.2518, lng: 34.7915 },
    { name: 'אילת', lat: 29.5581, lng: 34.9482 }
  ];

  const setLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location.name,
      latitude: location.lat.toString(),
      longitude: location.lng.toString()
    }));
    setErrors({});
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">פרטי לידה</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* תאריך לידה */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">תאריך לידה</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className={errors.birthDate ? 'border-red-500' : ''}
            />
            {errors.birthDate && (
              <p className="text-sm text-red-500">{errors.birthDate}</p>
            )}
          </div>

          {/* שעת לידה */}
          <div className="space-y-2">
            <Label htmlFor="birthTime">שעת לידה</Label>
            <Input
              id="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              className={errors.birthTime ? 'border-red-500' : ''}
            />
            {errors.birthTime && (
              <p className="text-sm text-red-500">{errors.birthTime}</p>
            )}
            <p className="text-sm text-gray-600">
              חשוב מאוד לדייק בשעה - הבדל של דקות בודדות יכול להשפיע על התוצאה
            </p>
          </div>

          {/* מיקום */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>מיקום הלידה</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {commonLocations.map((location) => (
                  <Button
                    key={location.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(location)}
                    className="text-sm"
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">קו רוחב (Latitude)</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="32.0853"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={errors.latitude ? 'border-red-500' : ''}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">קו אורך (Longitude)</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="34.7818"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={errors.longitude ? 'border-red-500' : ''}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude}</p>
                )}
              </div>
            </div>

            {formData.location && (
              <p className="text-sm text-blue-600">
                מיקום נבחר: {formData.location}
              </p>
            )}
          </div>

          {/* כפתורי פעולה */}
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? 'מחשב...' : 'חשב מפת לידה'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full" 
              onClick={loadSampleData}
              disabled={isLoading}
            >
              🎯 טען דוגמה מהירה לבדיקה
            </Button>
          </div>
        </form>

        {/* הסבר קצר */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">מידע חשוב:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• שעת הלידה חייבת להיות מדויקת ככל האפשר</li>
            <li>• ניתן לבחור מיקום נפוץ או להזין קואורדינטות ידנית</li>
            <li>• המחשבון מבוסס על הספריה האסטרונומית Astronomia</li>
            <li>• התוצאות כוללות את כל הכוכבים הראשיים והבתים</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthDataForm;
