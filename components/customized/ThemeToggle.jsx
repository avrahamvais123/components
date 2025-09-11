"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  console.log("theme: ", theme);
  const effective = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => {
        setTheme(effective === "dark" ? "light" : "dark");
        console.log("ThemeToggle: ");
      }}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border bg-background text-foreground"
    >
      {effective === "dark" ? "☀️ מצב בהיר" : "🌙 מצב כהה"}
    </button>
  );
}
