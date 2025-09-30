"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cart } from "@/lib/signals/signals-store";
import { useComputed, useSignals } from "@preact/signals-react/runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Shield, Truck, Clock } from "lucide-react";
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
    <div className={`relative space-y-8 ${showStickyButton ? 'pb-24 xl:pb-0' : ''}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-1/3 w-96 h-96 bg-purple-400/5 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-400/5 dark:bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Order Summary */}
      <MobileOrderSummary
        cartItems={cartItems.value}
        totalPrice={totalPrice.value}
        itemsCount={itemsCount.value}
        isOpen={mobileOrderSummaryOpen}
        onToggle={() => setMobileOrderSummaryOpen(!mobileOrderSummaryOpen)}
      />
      
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-8 xl:gap-12 xl:items-start">
        {/* טופס התשלום */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:col-span-7 space-y-8 order-2 xl:order-1"
        >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">
            
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

            {/* Security badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50"
            >
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-medium">תשלום מאובטח</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">משלוח מהיר</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">זמינות 24/7</span>
                </div>
              </div>
            </motion.div>

            {/* כפתור שליחה - רק במובייל וטאבלט */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="xl:hidden"
            >
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border-0"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    מעבד הזמנה...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>השלם הזמנה • ₪{totalPrice.value.toFixed(2)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>

      {/* סיכום ההזמנה */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="xl:col-span-5 order-1 xl:order-2 xl:sticky xl:top-20 xl:self-start"
      >
        <OrderSummary 
          cartItems={cartItems.value}
          totalPrice={totalPrice.value}
          itemsCount={itemsCount.value}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={form.formState.isSubmitting}
        />
      </motion.div>
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