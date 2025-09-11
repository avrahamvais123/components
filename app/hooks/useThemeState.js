// app/hooks/useThemeState.js
"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function useThemeState() {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme === "system" ? resolvedTheme : theme) : undefined;
  const isDark = current === "dark";

  const toggleTheme = useCallback(() => {
    if (!mounted) return;
    const cur = theme === "system" ? resolvedTheme : theme; // "light" | "dark"
    setTheme(cur === "dark" ? "light" : "dark");
  }, [mounted, theme, resolvedTheme, setTheme]);

  const cycleTheme = useCallback(() => {
    if (!mounted) return;
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }, [mounted, theme, setTheme]);

  return {
    mounted,
    theme,
    resolvedTheme,
    systemTheme,
    isDark,
    setTheme,
    toggleTheme,
    cycleTheme,
  };
}
