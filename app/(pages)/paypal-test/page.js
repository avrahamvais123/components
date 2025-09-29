"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayPalButton } from "@/components/checkout/PayPalButton";
import { PayPalSetupChecker } from "@/components/checkout/PayPalSetupChecker";
import { formatPrice } from "@/lib/currency";

export default function PayPalTestPage() {
  const [testAmount, setTestAmount] = useState(10);
  const [testCurrency, setTestCurrency] = useState('USD');
  const [lastResult, setLastResult] = useState(null);

  const handleSuccess = (details) => {
    setLastResult({ type: 'success', data: details });
    console.log('Payment successful:', details);
  };

  const handleError = (error) => {
    setLastResult({ type: 'error', data: error });
    console.error('Payment error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">בדיקת PayPal</h1>
          <p className="text-gray-600 text-center">עמוד לבדיקה ופיתוח של אינטגרציית PayPal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* בדיקת הגדרות */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>סטטוס מערכת</CardTitle>
              </CardHeader>
              <CardContent>
                <PayPalSetupChecker />
              </CardContent>
            </Card>

            {/* הגדרות בדיקה */}
            <Card>
              <CardHeader>
                <CardTitle>הגדרות בדיקה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">סכום לבדיקה</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    max="1000"
                    value={testAmount}
                    onChange={(e) => setTestAmount(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency">מטבע</Label>
                  <select
                    id="currency"
                    value={testCurrency}
                    onChange={(e) => setTestCurrency(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md"
                  >
                    <option value="USD">USD - דולר אמריקאי</option>
                    <option value="EUR">EUR - יורו</option>
                    <option value="ILS">ILS - שקל ישראלי</option>
                  </select>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-600">
                    <strong>סכום כולל לתשלום:</strong> {formatPrice(testAmount, testCurrency)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* אזור התשלום */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>בדיקת תשלום PayPal</CardTitle>
              </CardHeader>
              <CardContent>
                {testAmount > 0 ? (
                  <PayPalButton
                    cartItems={[{ 
                      id: 'milk', 
                      quantity: Math.max(1, Math.floor(testAmount / 4.99)),
                      name: 'חלב - מוצר בדיקה'
                    }]}
                    currency={testCurrency}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    הזן סכום גדול מ-0 לבדיקה
                  </div>
                )}
              </CardContent>
            </Card>

            {/* תוצאות */}
            {lastResult && (
              <Card className={lastResult.type === 'success' ? 'border-green-200' : 'border-red-200'}>
                <CardHeader>
                  <CardTitle className={lastResult.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {lastResult.type === 'success' ? 'תשלום הצליח!' : 'שגיאה בתשלום'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                    {JSON.stringify(lastResult.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* מידע נוסף */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>פרטי בדיקה לSandbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">חשבון בדיקה:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside ml-4">
                <li>Email: sb-buyer@personal.example.com</li>
                <li>Password: password123</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">כרטיס אשראי לבדיקה:</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside ml-4">
                <li>מספר: 4032033317844390</li>
                <li>תאריך תפוגה: כל תאריך עתידי</li>
                <li>CVV: כל 3 ספרות</li>
              </ul>
            </div>
            <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
              <strong>שים לב:</strong> זהו עמוד בדיקה בלבד. בפרודקשן יש להסיר או להגן על עמוד זה.
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/checkout'} variant="outline">
            חזור לעמוד Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}