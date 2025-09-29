"use client";

import { motion } from "framer-motion";

export function OrderSummaryItem({ item, index }) {
  return (
    <motion.div 
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow"
    >
      <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.title}</h4>
        <p className="text-sm text-gray-500">כמות: {item.quantity}</p>
      </div>
      <div className="text-left">
        <p className="font-medium">₪{(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </motion.div>
  );
}