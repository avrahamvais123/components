"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cart } from "@/lib/signals/signals-store";
import { useComputed, useSignals } from "@preact/signals-react/runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CreditCard, MapPin, Package, Shield, Truck, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LoadingButton } from "@/components/ui/loading";

const checkoutFormSchema = z.object({
  // פרטי משלוח
  firstName: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  
  // כתובת
  address: z.string().min(5, "כתובת חייבת להכיל לפחות 5 תווים"),
  city: z.string().min(2, "עיר חייבת להכיל לפחות 2 תווים"),
  postalCode: z.string().min(5, "מיקוד חייב להכיל לפחות 5 ספרות"),
  
  // אופן תשלום
  paymentMethod: z.enum(["credit", "paypal", "bit"], {
    required_error: "יש לבחור אופן תשלום",
  }),
  
  // פרטי כרטיס אשראי (אופציונלי - רק אם בחר בכרטיס אשראי)
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
  
  // הערות
  notes: z.string().optional(),
  
  // אישורים
  termsAccepted: z.boolean().refine(val => val, "חובה לאשר את התנאים"),
  marketingEmails: z.boolean().optional(),
});

export default function CheckoutPage() {
  useSignals();
  const router = useRouter();
  
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

  // אם העגלה ריקה, הפנה חזרה למוצרים
  if (cartItems.value.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle>העגלה ריקה</CardTitle>
            <CardDescription>
              לא נמצאו מוצרים בעגלה. אנא הוסף מוצרים לפני שתמשיך לתשלום.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => router.push("/products")} 
              className="w-full"
            >
              חזור למוצרים
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* כותרת */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">השלמת ההזמנה</h1>
          <p className="text-gray-600 text-lg">מלא את הפרטים כדי להשלים את ההזמנה</p>
          
          {/* סרגל התקדמות */}
          <div className="mt-6 mb-8">
            <ProgressBar
              currentStep={1}
              steps={[
                { title: "עגלת קניות", description: "בחירת מוצרים" },
                { title: "פרטי תשלום", description: "מילוי פרטים" },
                { title: "אישור הזמנה", description: "סיום התהליך" }
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* טופס התשלום */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* פרטי משלוח */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      פרטי משלוח
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>שם פרטי</FormLabel>
                            <FormControl>
                              <Input placeholder="הכנס שם פרטי" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>שם משפחה</FormLabel>
                            <FormControl>
                              <Input placeholder="הכנס שם משפחה" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>כתובת אימייל</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מספר טלפון</FormLabel>
                          <FormControl>
                            <Input placeholder="050-1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* כתובת משלוח */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      כתובת משלוח
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>רחוב ומספר בית</FormLabel>
                          <FormControl>
                            <Input placeholder="רחוב הרצל 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>עיר</FormLabel>
                            <FormControl>
                              <Input placeholder="תל אביב" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מיקוד</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* אופן תשלום */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      אופן תשלום
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
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
                      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <FormField
                          control={form.control}
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
                          control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* הערות נוספות */}
                <Card>
                  <CardHeader>
                    <CardTitle>הערות נוספות (אופציונלי)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="הוסף הערות למשלוח או להזמנה..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* תנאים והסכמות */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              אני מסכים/ה ל<span className="text-blue-600 underline">תנאי השימוש</span> ול<span className="text-blue-600 underline">מדיניות הפרטיות</span>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              אני מעוניין/ת לקבל הצעות מיוחדות ועדכונים באימייל
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* כפתור שליחה - רק במובייל */}
                <div className="lg:hidden">
                  <LoadingButton 
                    type="submit" 
                    className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors"
                    loading={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "מעבד הזמנה..." : `השלם הזמנה • ₪${totalPrice.value.toFixed(2)}`}
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>

          {/* סיכום ההזמנה */}
          <div className="space-y-6">
            {/* סיכום מוצרים */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>סיכום ההזמנה</CardTitle>
                <CardDescription>{itemsCount.value} פריטים</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* רשימת מוצרים */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.value.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                        <p className="text-sm text-gray-500">כמות: {item.quantity}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">₪{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* חישוב מחירים */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>סה"כ מוצרים:</span>
                    <span>₪{totalPrice.value.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>משלוח:</span>
                    <span className="text-green-600 font-medium">חינם</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>הנחה:</span>
                    <span>-₪0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>סה"כ לתשלום:</span>
                    <span>₪{totalPrice.value.toFixed(2)}</span>
                  </div>
                </div>

                {/* כפתור שליחה - רק בדסקטופ */}
                <div className="hidden lg:block">
                  <LoadingButton 
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors"
                    loading={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "מעבד הזמנה..." : "השלם הזמנה"}
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </LoadingButton>
                </div>

                {/* תכונות אבטחה */}
                <div className="text-center space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>תשלום מאובטח ומוצפן</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>משלוח חינם על הזמנות מעל ₪200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}