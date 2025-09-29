import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 md:py-6 lg:py-8">
      <div className="container mx-auto px-3 md:px-4 lg:px-6 max-w-7xl">
        <CheckoutHeader />
        <CheckoutClient />
      </div>
    </div>
  );
}