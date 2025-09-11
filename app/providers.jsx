"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemes } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemes
          attribute="class" // מוסיף/מסיר את .dark על ה-<html>
          defaultTheme="system" // light | dark | system
          enableSystem
          disableTransitionOnChange // בלי הבזקי מעבר
        >
          {children}
        </NextThemes>
      </QueryClientProvider>
    </SessionProvider>
  );
}
