"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PaymentStatus({ status, error, details }) {
  if (status === 'idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <Card>
        <CardContent className="p-4">
          {status === 'processing' && (
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <div>
                <div className="font-medium">מעבד תשלום...</div>
                <div className="text-sm text-gray-500">אנא המתן בזמן עיבוד התשלום</div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">התשלום הושלם בהצלחה!</div>
                {details?.id && (
                  <div className="text-sm text-gray-500">
                    מספר עסקה: {details.id}
                  </div>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-3 text-red-600">
              <XCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">שגיאה בתשלום</div>
                <div className="text-sm text-gray-500">
                  {error || 'אירעה שגיאה לא צפויה. אנא נסה שוב.'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}