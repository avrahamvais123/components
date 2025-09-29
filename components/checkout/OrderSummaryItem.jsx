"use client";

import { motion } from "framer-motion";

export function OrderSummaryItem({ item, index }) {
  return (
    <motion.div 
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 xl:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors hover:shadow-sm"
    >
      <div className="w-12 h-12 xl:w-10 xl:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm xl:text-xs text-gray-900 dark:text-gray-100 truncate mb-1 xl:mb-0.5 leading-tight">{item.title}</h4>
        <div className="flex items-center justify-between xl:mt-1">
          <div className="text-xs xl:text-[10px] text-gray-600 dark:text-gray-400">
            <span className="font-medium">כמות:</span>
            <span className="ml-1 font-semibold text-gray-800 dark:text-gray-200">{item.quantity}</span>
          </div>
          <div className="text-left">
            <span className="font-bold text-sm xl:text-xs text-gray-900 dark:text-gray-100">₪{(item.price * item.quantity).toLocaleString()}</span>
            {item.quantity > 1 && (
              <div className="text-[10px] xl:text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">₪{item.price.toLocaleString()} × {item.quantity}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}