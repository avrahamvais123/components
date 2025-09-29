"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemes } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Create a client
const queryClient = new QueryClient();

// PayPal configuration
const paypalOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", // נדרש להוסיף את ה-Client ID בקובץ .env
  currency: "USD",
  intent: "capture",
};

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={paypalOptions}>
          <NextThemes
            attribute="class" // מוסיף/מסיר את .dark על ה-<html>
            defaultTheme="system" // light | dark | system
            enableSystem
            disableTransitionOnChange // בלי הבזקי מעבר
          >
            {children}
          </NextThemes>
        </PayPalScriptProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
