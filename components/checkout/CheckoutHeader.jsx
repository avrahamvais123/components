import { CheckCircle } from "lucide-react";

export function CheckoutHeader() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">השלמת ההזמנה</h1>
      <p className="text-gray-600 text-lg">מלא את הפרטים כדי להשלים את ההזמנה</p>
      
      {/* סרגל התקדמות */}
      <div className="flex items-center justify-center gap-4 mt-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-green-600">עגלת קניות</span>
        </div>
        
        <div className="h-0.5 w-12 bg-gray-300"></div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            2
          </div>
          <span className="text-sm font-medium text-blue-600">פרטי תשלום</span>
        </div>
        
        <div className="h-0.5 w-12 bg-gray-300"></div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">
            3
          </div>
          <span className="text-sm font-medium text-gray-500">אישור הזמנה</span>
        </div>
      </div>
    </div>
  );
}