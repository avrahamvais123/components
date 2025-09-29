"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MobileOrderSummary({ cartItems, totalPrice, itemsCount, isOpen, onToggle }) {
  return (
    <div className="xl:hidden">
      <Card className="mb-4">
        <CardContent className="p-3">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  סיכום הזמנה ({itemsCount} פריטים)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">₪{totalPrice.toFixed(2)}</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </Button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* רשימת מוצרים */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cartItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">{item.title}</h4>
                          <p className="text-xs text-gray-500">כמות: {item.quantity}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-xs">₪{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* חישוב מחירים */}
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
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
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-base">
                      <span>סה"כ לתשלום:</span>
                      <span>₪{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}