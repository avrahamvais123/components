"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, DollarSign } from "lucide-react";
import { useServerPrices } from "@/app/hooks/useServerPrices";
import { formatPrice } from "@/lib/currency";

export function PriceValidator({ cartItems, currency = "USD" }) {
  const { products, loading, validateCartItems, calculateServerTotal } = useServerPrices();
  const [validation, setValidation] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);

  useEffect(() => {
    if (!loading && cartItems.length > 0) {
      const validationResult = validateCartItems(cartItems);
      setValidation(validationResult);

      const serverCalculation = calculateServerTotal(cartItems);
      const clientTotal = cartItems.reduce((sum, item) => 
        sum + ((item.price || 0) * (item.quantity || 1)), 0
      );

      setPriceComparison({
        clientTotal: Math.round(clientTotal * 100) / 100,
        serverTotal: serverCalculation.total,
        difference: Math.round((serverCalculation.total - clientTotal) * 100) / 100,
        breakdown: serverCalculation.breakdown
      });
    }
  }, [cartItems, products, loading]);

  if (loading) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
            <span>בודק מחירים...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!validation || !priceComparison) {
    return null;
  }

  const hasErrors = !validation.isValid;
  const hasPriceDifference = Math.abs(priceComparison.difference) > 0.01;

  return (
    <Card className={`border-2 ${hasErrors ? 'border-red-200 bg-red-50' : hasPriceDifference ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm flex items-center gap-2 ${hasErrors ? 'text-red-700' : hasPriceDifference ? 'text-yellow-700' : 'text-green-700'}`}>
          {hasErrors ? <XCircle className="w-4 h-4" /> : 
           hasPriceDifference ? <AlertTriangle className="w-4 h-4" /> : 
           <CheckCircle className="w-4 h-4" />}
          בדיקת מחירים
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        
        {/* שגיאות */}
        {validation.errors.length > 0 && (
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div key={index} className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </div>
            ))}
          </div>
        )}

        {/* השוואת מחירים */}
        {!hasErrors && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">סכום מחושב בשרת:</span>
                <div className="font-semibold text-green-600">
                  {formatPrice(priceComparison.serverTotal, currency)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">סכום מהקליינט:</span>
                <div className={`font-semibold ${hasPriceDifference ? 'text-yellow-600' : 'text-green-600'}`}>
                  {formatPrice(priceComparison.clientTotal, currency)}
                </div>
              </div>
            </div>

            {hasPriceDifference && (
              <div className="bg-yellow-100 p-2 rounded text-sm">
                <div className="font-semibold text-yellow-800">
                  הבדל במחיר: {formatPrice(Math.abs(priceComparison.difference), currency)}
                </div>
                <div className="text-yellow-700">
                  המערכת תשתמש במחיר המחושב בשרת לביטחון
                </div>
              </div>
            )}
          </div>
        )}

        {/* פירוט פריטים */}
        {!hasErrors && priceComparison.breakdown.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
              פירוט פריטים ({priceComparison.breakdown.length})
            </summary>
            <div className="mt-2 space-y-1 bg-white p-2 rounded border">
              {priceComparison.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.itemTotal, currency)}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {!hasErrors && !hasPriceDifference && (
          <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
            ✓ כל המחירים תקינים ומסונכרנים
          </div>
        )}
      </CardContent>
    </Card>
  );
}