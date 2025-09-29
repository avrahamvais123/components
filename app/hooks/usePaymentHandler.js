"use client";

import { useState, useCallback } from 'react';

export function usePaymentHandler() {
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [paymentError, setPaymentError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePaymentSuccess = useCallback((details) => {
    setPaymentStatus('success');
    setPaymentDetails(details);
    setPaymentError(null);
    
    // כאן אפשר להוסיף לוגיקה נוספת כמו:
    // - שליחת אימייל אישור
    // - עדכון מסד הנתונים
    // - ניתוב לעמוד אישור
    console.log('Payment successful:', details);
  }, []);

  const handlePaymentError = useCallback((error) => {
    setPaymentStatus('error');
    setPaymentError(error.message || 'אירעה שגיאה בתשלום');
    setPaymentDetails(null);
    console.error('Payment error:', error);
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentStatus('idle');
    setPaymentError(null);
    setPaymentDetails(null);
  }, []);

  const setProcessing = useCallback(() => {
    setPaymentStatus('processing');
    setPaymentError(null);
  }, []);

  return {
    paymentStatus,
    paymentError,
    paymentDetails,
    handlePaymentSuccess,
    handlePaymentError,
    resetPayment,
    setProcessing,
    isProcessing: paymentStatus === 'processing',
    isSuccess: paymentStatus === 'success',
    isError: paymentStatus === 'error',
  };
}