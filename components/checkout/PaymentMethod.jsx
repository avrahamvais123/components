"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { PayPalButton } from "./PayPalButton";
import { PaymentStatus } from "./PaymentStatus";
import { PayPalSetupChecker } from "./PayPalSetupChecker";
import { PriceValidator } from "./PriceValidator";
import { usePaymentHandler } from "@/app/hooks/usePaymentHandler";

export function PaymentMethod({ control, watchPaymentMethod, cartItems = [], currency = "USD", shippingCost = 0, tax = 0, discount = 0 }) {
  const {
    paymentStatus,
    paymentError,
    paymentDetails,
    handlePaymentSuccess,
    handlePaymentError,
    setProcessing,
  } = usePaymentHandler();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            אופן תשלום
          </CardTitle>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5" />
                          <div>
                            <div className="font-medium">כרטיס אשראי</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                          <div>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-500">תשלום מאובטח דרך PayPal</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="bit" id="bit" />
                      <Label htmlFor="bit" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">B</div>
                          <div>
                            <div className="font-medium">Bit</div>
                            <div className="text-sm text-gray-500">תשלום דרך אפליקציית Bit</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* פרטי כרטיס אשראי */}
          {watchPaymentMethod === "credit" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 p-4 border rounded-lg bg-gray-50"
            >
              <FormField
                control={control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר כרטיס</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="cardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם בעל הכרטיס</FormLabel>
                    <FormControl>
                      <Input placeholder="שם כפי שמופיע על הכרטיס" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תאריך תפוגה</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* PayPal תשלום */}
          {watchPaymentMethod === "paypal" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 p-4 border rounded-lg bg-gray-50"
            >
              <PayPalSetupChecker />
              <PriceValidator cartItems={cartItems} currency={currency} />
              <div className="text-center text-sm text-gray-600 mb-4">
                לחץ על הכפתור למטה כדי להמשיך לתשלום דרך PayPal
              </div>
              <PayPalButton
                cartItems={cartItems}
                currency={currency}
                shippingCost={shippingCost}
                tax={tax}
                discount={discount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
              />
              <PaymentStatus 
                status={paymentStatus} 
                error={paymentError} 
                details={paymentDetails} 
              />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}