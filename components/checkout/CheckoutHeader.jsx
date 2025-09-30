import { CheckCircle } from "lucide-react";

export function CheckoutHeader() {
  return (
    <div className="mb-8 md:mb-12 text-center">
      <div className="relative">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-gray-100 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
          השלמת ההזמנה
        </h1>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-70"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
        מלא את הפרטים בטופס המאובטח שלנו כדי להשלים את ההזמנה שלך בבטחה
      </p>
      

    </div>
  );
}