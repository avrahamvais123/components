"use client";

import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export const Logo = () => {
  return (
    <div className="relative h-9 w-[200px]">
      <Image
        src="/images/logo-dark.png"
        alt="Logo light"
        fill
        className="object-contain dark:hidden"
        priority
      />
      <Image
        src="/images/logo-light.png"
        alt="Logo dark"
        fill
        className="object-contain hidden dark:block"
        priority
      />
    </div>
  );
};
