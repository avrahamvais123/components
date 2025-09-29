"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import { motion } from "framer-motion";

export function PayPalButton({ amount, currency = "USD", onSuccess, onError, disabled = false }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [loading, setLoading] = useState(false);

  const createOrder = async (data, actions) => {
    setLoading(true);
    try {
      // יצירת הזמנה דרך ה-API שלנו
      const response = await fetch('/api/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency }),
      });

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      return orderData.orderID;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    try {
      // לכידת התשלום דרך ה-API שלנו
      const response = await fetch('/api/paypal', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const details = await response.json();
      
      if (!response.ok) {
        throw new Error(details.error || 'Failed to capture payment');
      }

      // שמירת ההזמנה במסד הנתונים
      const orderResult = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentDetails: details,
          paymentMethod: 'paypal',
          total: amount,
          currency: currency,
          timestamp: new Date().toISOString(),
        }),
      });

      const orderData = await orderResult.json();
      
      if (orderResult.ok) {
        onSuccess?.(details, orderData);
      } else {
        throw new Error(orderData.error || 'Failed to save order');
      }
    } catch (error) {
      console.error("PayPal payment error:", error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const onErrorHandler = (error) => {
    console.error("PayPal error:", error);
    onError?.(error);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-2">טוען PayPal...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="paypal-container"
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        disabled={loading || disabled}
      />
      {loading && (
        <div className="mt-2 text-center text-sm text-gray-600">
          מעבד תשלום...
        </div>
      )}
    </motion.div>
  );
}