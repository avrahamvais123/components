"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const effective = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(effective === "dark" ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border bg-background text-foreground"
    >
      {effective === "dark" ? "☀️ מצב בהיר" : "🌙 מצב כהה"}
    </button>
  );
}
