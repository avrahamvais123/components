import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-slate-900/50 dark:to-indigo-950/30 py-6 md:py-8 lg:py-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
      </div>
      
      <div className="container relative mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <CheckoutHeader />
        <CheckoutClient />
      </div>
    </div>
  );
}