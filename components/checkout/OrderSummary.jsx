"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { OrderSummaryItem } from "./OrderSummaryItem";

export function OrderSummary({ cartItems, totalPrice, itemsCount, onSubmit, isSubmitting }) {

  return (
    <div className="space-y-6">
      {/* סיכום מוצרים */}
      <Card className="order-summary-desktop xl:max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                סיכום ההזמנה
              </CardTitle>
              <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                {itemsCount} פריטים בעגלה
              </CardDescription>
            </div>
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4"></div>
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
          <div className="hidden xl:block flex-shrink-0 mt-auto pt-4">
            <button 
              onClick={onSubmit}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 pulse-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  מעבד הזמנה...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>השלם הזמנה • ₪{totalPrice.toFixed(2)}</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* תכונות אבטחה */}
          <div className="text-center space-y-3 pt-4 mt-auto border-t border-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3 gap-3 xl:gap-2 2xl:gap-3">
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[11px] text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <Shield className="w-3 h-3 xl:w-3 xl:h-3 text-green-500" />
                <span className="font-medium">תשלום מאובטח</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[11px] text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                <Truck className="w-3 h-3 xl:w-3 xl:h-3 text-blue-500" />
                <span className="font-medium">משלוח חינם מ-₪200</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs xl:text-[11px] text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
                <Clock className="w-3 h-3 xl:w-3 xl:h-3 text-purple-500" />
                <span className="font-medium">משלוח 3-5 ימים</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
