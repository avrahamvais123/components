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
      <Card className="order-summary-desktop xl:max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg md:text-xl">סיכום ההזמנה</CardTitle>
          <CardDescription>{itemsCount} פריטים</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden p-4 xl:p-5 2xl:p-6 space-y-4 pb-6">
          {/* רשימת מוצרים - עם גלילה */}
          <div className="relative flex-1 min-h-0">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">המוצרים שלך</h3>
            <div className="overflow-y-auto order-items-scroll transition-colors xl:max-h-[45vh]" 
                 style={{ maxHeight: cartItems.length > 3 ? '280px' : 'auto' }}>
              <div className="space-y-2 xl:space-y-1.5">
                {cartItems.map((item, index) => (
                  <OrderSummaryItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
            {/* אינדיקטור גלילה */}
            {cartItems.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent pointer-events-none">
                <div className="absolute bottom-1 right-2 left-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded">יותר מוצרים למטה</span>
                  <span className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded font-medium">↓ {cartItems.length - 3}</span>
                </div>
              </div>
            )}
          </div>

          {/* חישוב מחירים - תמיד גלוי */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 xl:p-3 rounded-lg space-y-2.5 xl:space-y-2 border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex justify-between text-sm xl:text-sm text-gray-900 dark:text-gray-100">
              <span>סה"כ מוצרים:</span>
              <span className="font-medium">₪{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm xl:text-sm text-gray-900 dark:text-gray-100">
              <span>משלוח:</span>
              <span className="text-green-600 dark:text-green-400 font-medium">חינם</span>
            </div>
            <div className="flex justify-between text-sm xl:text-sm text-green-600 dark:text-green-400">
              <span>הנחה:</span>
              <span className="font-medium">-₪0.00</span>
            </div>
            <hr className="border-gray-300 dark:border-gray-600" />
            <div className="flex justify-between font-bold text-lg xl:text-base text-primary dark:text-primary">
              <span>סה"כ לתשלום:</span>
              <span>₪{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* כפתור שליחה - רק בדסקטופ */}
          <div className="hidden xl:block flex-shrink-0 mt-auto pt-3">
            <button 
              onClick={onSubmit}
              className="w-full h-11 xl:h-10 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "מעבד הזמנה..." : "השלם הזמנה • ₪" + totalPrice.toFixed(2)}
            </button>
          </div>

          {/* תכונות אבטחה */}
          <div className="text-center space-y-2 pt-2 xl:pt-1 mt-auto border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3 gap-2 xl:gap-1 2xl:gap-2">
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[10px] text-gray-600 dark:text-gray-400">
                <Shield className="w-3 h-3 xl:w-2.5 xl:h-2.5" />
                <span>תשלום מאובטח</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[10px] text-gray-600 dark:text-gray-400">
                <Truck className="w-3 h-3 xl:w-2.5 xl:h-2.5" />
                <span>משלוח חינם מ-₪200</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[10px] text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 xl:w-2.5 xl:h-2.5" />
                <span>משלוח 3-5 ימים</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
