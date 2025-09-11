"use client";

import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "next-themes";

export const Logo = () => {
  const { theme, systemTheme, setTheme } = useTheme();
  const effective = theme === "system" ? systemTheme : theme;

  return (
    <Image
      src={`/images/logo-${effective === "dark" ? "white" : "black"}.png`}
      width={200}
      height={100}
      className="h-9 w-auto"
    />
  );
};
