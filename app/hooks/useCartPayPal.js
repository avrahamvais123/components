"use client";

import { useState, useCallback, useEffect } from 'react';
import { cart } from '@/lib/signals/signals-store';
import { useSignals, useComputed } from '@preact/signals-react/runtime';

export function useCartPayPal() {
  useSignals();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const cartItems = useComputed(() => Object.values(cart));
  const cartTotal = useComputed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  const handlePayPalSuccess = useCallback(async (paymentDetails) => {
    setIsProcessingPayment(true);
    
    try {
      // שליחת פרטי ההזמנה לשרת
      const orderData = {
        paymentDetails,
        cartItems: cartItems.value,
        total: cartTotal.value,
        paymentMethod: 'paypal',
        timestamp: new Date().toISOString(),
      };

      // כאן תהיה קריאה לAPI של השרת
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // ניקוי העגלה לאחר הזמנה מוצלחת
        Object.keys(cart).forEach(key => delete cart[key]);
        
        return { success: true, orderId: paymentDetails.id };
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      return { success: false, error: error.message };
    } finally {
      setIsProcessingPayment(false);
    }
  }, [cartItems, cartTotal]);

  const validateCart = useCallback(() => {
    if (cartItems.value.length === 0) {
      throw new Error('העגלה ריקה');
    }
    
    if (cartTotal.value <= 0) {
      throw new Error('סכום לא תקין');
    }

    // בדיקת זמינות מוצרים (אופציונלי)
    const unavailableItems = cartItems.value.filter(item => !item.available);
    if (unavailableItems.length > 0) {
      throw new Error(`המוצרים הבאים לא זמינים: ${unavailableItems.map(item => item.name).join(', ')}`);
    }

    return true;
  }, [cartItems, cartTotal]);

  return {
    cartItems: cartItems.value,
    cartTotal: cartTotal.value,
    isProcessingPayment,
    handlePayPalSuccess,
    validateCart,
    isEmpty: cartItems.value.length === 0,
    itemCount: cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  };
}