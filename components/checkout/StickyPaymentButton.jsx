"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export function StickyPaymentButton({ onSubmit, isSubmitting, totalPrice, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-lg"
    >
      <div className="container mx-auto max-w-md">
        <Button 
          onClick={onSubmit}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-200 transform active:scale-95"
          disabled={isSubmitting}
        >
          <CreditCard className="w-5 h-5" />
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>מעבד הזמנה...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>השלם תשלום</span>
              <span className="font-bold">₪{totalPrice.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
        
        {/* מקום לנשימה מתחת לכפתור */}
        <div className="h-2"></div>
      </div>
    </motion.div>
  );
}