import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <CheckoutHeader />
        <CheckoutClient />
      </div>
    </div>
  );
}