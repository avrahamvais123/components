"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { OrderSummaryItem } from "./OrderSummaryItem";

export function OrderSummary({ cartItems, totalPrice, itemsCount, onSubmit, isSubmitting }) {

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* סיכום מוצרים */}
      <Card className="sticky top-8 lg:top-24 max-h-[calc(100vh-8rem)] lg:max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>סיכום ההזמנה</CardTitle>
          <CardDescription>{itemsCount} פריטים</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* רשימת מוצרים */}
          <div className="flex-1 min-h-0 relative">
            <div className="space-y-3 overflow-y-auto max-h-52 scrollbar-thin hover:scrollbar-thumb-gray-400 scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-colors">
              {cartItems.map((item, index) => (
                <OrderSummaryItem key={item.id} item={item} index={index} />
              ))}
            </div>
            {/* אינדיקטור גלילה עם מידע על כמות פריטים */}
            {cartItems.length > 4 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                <div className="absolute bottom-1 right-2 text-xs text-gray-500 font-medium">
                  +{cartItems.length - 4} פריטים נוספים
                </div>
              </div>
            )}
          </div>

          <Separator className="flex-shrink-0" />

          {/* חישוב מחירים */}
          <div className="flex-shrink-0 space-y-2">
            <div className="flex justify-between text-sm">
              <span>סה"כ מוצרים:</span>
              <span>₪{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>משלוח:</span>
              <span className="text-green-600 font-medium">חינם</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>הנחה:</span>
              <span>-₪0.00</span>
            </div>
            <Separator className="flex-shrink-0" />
            <div className="flex justify-between font-bold text-lg">
              <span>סה"כ לתשלום:</span>
              <span>₪{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* כפתור שליחה - רק בדסקטופ */}
          <div className="hidden lg:block flex-shrink-0">
            <button 
              onClick={onSubmit}
              className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "מעבד הזמנה..." : "השלם הזמנה"}
            </button>
          </div>

          {/* תכונות אבטחה */}
          <div className="flex-shrink-0 text-center space-y-2 pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>תשלום מאובטח ומוצפן</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span>משלוח חינם על הזמנות מעל ₪200</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>זמן משלוח: 3-5 ימי עסקים</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}