"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, convertCurrency } from "@/lib/currency";
import { motion } from "framer-motion";

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'דולר אמריקאי', symbol: '$' },
  { code: 'EUR', name: 'יורו', symbol: '€' },
  { code: 'ILS', name: 'שקל ישראלי', symbol: '₪' },
];

export function PricingSummary({ 
  subtotal, 
  shipping = 0, 
  tax = 0, 
  discount = 0,
  defaultCurrency = 'USD',
  onCurrencyChange,
  onTotalChange 
}) {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [convertedAmounts, setConvertedAmounts] = useState({
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    discount: discount,
  });

  const total = convertedAmounts.subtotal + convertedAmounts.shipping + convertedAmounts.tax - convertedAmounts.discount;

  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === selectedCurrency) return;

    try {
      const convertedSubtotal = await convertCurrency(subtotal, defaultCurrency, newCurrency);
      const convertedShipping = await convertCurrency(shipping, defaultCurrency, newCurrency);
      const convertedTax = await convertCurrency(tax, defaultCurrency, newCurrency);
      const convertedDiscount = await convertCurrency(discount, defaultCurrency, newCurrency);

      setConvertedAmounts({
        subtotal: convertedSubtotal,
        shipping: convertedShipping,
        tax: convertedTax,
        discount: convertedDiscount,
      });

      setSelectedCurrency(newCurrency);
      
      const newTotal = convertedSubtotal + convertedShipping + convertedTax - convertedDiscount;
      onCurrencyChange?.(newCurrency);
      onTotalChange?.(newTotal, newCurrency);
    } catch (error) {
      console.error('Currency conversion error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>סיכום הזמנה</CardTitle>
            <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>סכום ביניים</span>
            <span>{formatPrice(convertedAmounts.subtotal, selectedCurrency)}</span>
          </div>
          
          {convertedAmounts.shipping > 0 && (
            <div className="flex justify-between">
              <span>משלוח</span>
              <span>{formatPrice(convertedAmounts.shipping, selectedCurrency)}</span>
            </div>
          )}
          
          {convertedAmounts.tax > 0 && (
            <div className="flex justify-between">
              <span>מס</span>
              <span>{formatPrice(convertedAmounts.tax, selectedCurrency)}</span>
            </div>
          )}
          
          {convertedAmounts.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>הנחה</span>
              <span>-{formatPrice(convertedAmounts.discount, selectedCurrency)}</span>
            </div>
          )}
          
          <hr className="my-3" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>סכום כולל</span>
            <span>{formatPrice(total, selectedCurrency)}</span>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            המחיר כולל את כל העמלות והמיסים
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}