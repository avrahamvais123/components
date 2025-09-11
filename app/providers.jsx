"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemes } from "next-themes";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <NextThemes
        attribute="class" // מוסיף/מסיר את .dark על ה-<html>
        defaultTheme="system" // light | dark | system
        enableSystem
        disableTransitionOnChange // בלי הבזקי מעבר
      >
        {children}
      </NextThemes>
    </SessionProvider>
  );
}
