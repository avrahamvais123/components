import * as z from "zod";

export const checkoutFormSchema = z.object({
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