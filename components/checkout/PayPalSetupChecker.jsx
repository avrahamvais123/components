"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function PayPalSetupChecker() {
  const [setupStatus, setSetupStatus] = useState('checking');
  const [checks, setChecks] = useState({
    clientId: false,
    environment: false,
    scriptLoaded: false,
  });

  useEffect(() => {
    const checkSetup = () => {
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
      
      const newChecks = {
        clientId: !!clientId && clientId !== 'your-paypal-client-id-here',
        environment: ['sandbox', 'live'].includes(environment),
        scriptLoaded: !!window.paypal,
      };
      
      setChecks(newChecks);
      
      const allPassed = Object.values(newChecks).every(Boolean);
      setSetupStatus(allPassed ? 'success' : 'error');
    };

    // בדיקה ראשונית
    checkSetup();
    
    // בדיקה נוספת אחרי טעינת הסקריפט
    const timer = setTimeout(checkSetup, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (setupStatus === 'checking') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span>בודק הגדרות PayPal...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${setupStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm ${setupStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          סטטוס הגדרות PayPal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          {checks.clientId ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span>Client ID מוגדר</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {checks.environment ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span>סביבת עבודה תקינה</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {checks.scriptLoaded ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span>סקריפט PayPal נטען</span>
        </div>
        
        {setupStatus === 'error' && (
          <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-700">
            יש לוודא שמשתני הסביבה מוגדרים נכון ב-.env.local
          </div>
        )}
      </CardContent>
    </Card>
  );
}