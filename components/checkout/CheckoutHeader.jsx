import { CheckCircle } from "lucide-react";

export function CheckoutHeader() {
  return (
    <div className="mb-6 md:mb-8 text-center">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">השלמת ההזמנה</h1>
      <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto">מלא את הפרטים כדי להשלים את ההזמנה</p>
      
      {/* סרגל התקדמות */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mt-4 md:mt-6 mb-6 md:mb-8 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">
            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <span className="text-xs md:text-sm font-medium text-green-600 whitespace-nowrap">עגלת קניות</span>
        </div>
        
        <div className="h-0.5 w-6 md:w-12 bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
        
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold flex-shrink-0">
            2
          </div>
          <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">פרטי תשלום</span>
        </div>
        
        <div className="h-0.5 w-6 md:w-12 bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
        
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-xs md:text-sm font-bold flex-shrink-0">
            3
          </div>
          <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">אישור הזמנה</span>
        </div>
      </div>
    </div>
  );
}