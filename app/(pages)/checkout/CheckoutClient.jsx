"use client";

import { cart } from "@/lib/signals/signals-store";
import { useComputed, useSignals } from "@preact/signals-react/runtime";
import { useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { EmptyCart } from "@/components/checkout/EmptyCart";

export function CheckoutClient() {
  useSignals();
  const router = useRouter();
  
  const cartItems = useComputed(() => Object.values(cart));

  const handleReturnToProducts = () => {
    router.push("/products");
  };

  // אם העגלה ריקה, הצג רכיב עגלה ריקה
  if (cartItems.value.length === 0) {
    return <EmptyCart onReturnToProducts={handleReturnToProducts} />;
  }

  return <CheckoutForm />;
}