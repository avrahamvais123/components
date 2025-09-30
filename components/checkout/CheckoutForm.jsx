"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cart } from "@/lib/signals/signals-store";
import { useComputed, useSignals } from "@preact/signals-react/runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ShippingDetails } from "./ShippingDetails";
import { ShippingAddress } from "./ShippingAddress";
import { PaymentMethod } from "./PaymentMethod";
import { NotesAndTerms } from "./NotesAndTerms";
import { OrderSummary } from "./OrderSummary";
import { MobileOrderSummary } from "./MobileOrderSummary";
import { StickyPaymentButton } from "./StickyPaymentButton";
import { checkoutFormSchema } from "./checkoutSchema";
import { useState, useEffect } from "react";

export function CheckoutForm() {
  useSignals();
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [mobileOrderSummaryOpen, setMobileOrderSummaryOpen] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);

  // Show sticky button when scrolling down on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 200; // Show after scrolling 200px
      setShowStickyButton(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const cartItems = useComputed(() => Object.values(cart));
  const totalPrice = useComputed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  const itemsCount = useComputed(() => 
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "credit",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      notes: "",
      termsAccepted: false,
      marketingEmails: false,
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values) => {
    try {
      console.log("Form submitted:", values);
      console.log("Cart items:", cartItems.value);
      
      // כאן תהיה הלוגיקה של שליחת ההזמנה לשרת
      // לדוגמה:
      // await submitOrder({ ...values, items: cartItems.value, total: totalPrice.value });
      
      // ניקוי העגלה לאחר הזמנה מוצלחת
      Object.keys(cart).forEach(key => delete cart[key]);
      
      // הפניה לעמוד אישור
      router.push("/order-success");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <div className={`space-y-6 ${showStickyButton ? 'pb-24 xl:pb-0' : ''}`}>
      {/* Mobile Order Summary */}
      <MobileOrderSummary
        cartItems={cartItems.value}
        totalPrice={totalPrice.value}
        itemsCount={itemsCount.value}
        isOpen={mobileOrderSummaryOpen}
        onToggle={() => setMobileOrderSummaryOpen(!mobileOrderSummaryOpen)}
      />
      
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 xl:gap-8 xl:items-start">
        {/* טופס התשלום */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:col-span-7 space-y-6 order-2 xl:order-1"
        >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <ShippingDetails control={form.control} />
            
            <ShippingAddress control={form.control} />
            
            <PaymentMethod 
              control={form.control} 
              watchPaymentMethod={watchPaymentMethod}
              cartItems={cartItems.value}
              currency={selectedCurrency}
              shippingCost={0}
              tax={0}
              discount={0}
            />
            
            <NotesAndTerms control={form.control} />

            {/* כפתור שליחה - רק במובייל וטאבלט */}
            <div className="xl:hidden">
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "מעבד הזמנה..." : `השלם הזמנה • ₪${totalPrice.value.toFixed(2)}`}
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>

      {/* סיכום ההזמנה */}
      <div className="xl:col-span-5 order-1 xl:order-2 xl:sticky xl:top-20 xl:self-start">
        <OrderSummary 
          cartItems={cartItems.value}
          totalPrice={totalPrice.value}
          itemsCount={itemsCount.value}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={form.formState.isSubmitting}
        />
      </div>
    </div>
    
    {/* Sticky Payment Button for Mobile */}
    <StickyPaymentButton
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={form.formState.isSubmitting}
      totalPrice={totalPrice.value}
      isVisible={showStickyButton}
    />
    </div>
  );
}