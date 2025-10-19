"use client";

import { useThemeState } from "../../../hooks/useThemeState";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../../../../components/ui/dropdown-menu";

export default function HeaderDropdown({ icon, label, minWidth = "min-w-[16rem]", children }) {
  const { isDark } = useThemeState();
  const triggerCls = `${isDark ? "bg-neutral-900/60 border-neutral-700 text-neutral-100 hover:bg-neutral-800/80" : "bg-white/60 border-neutral-200 text-neutral-900 hover:bg-white"} px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors`;
  const contentBase = isDark ? "bg-neutral-900 text-neutral-100 border-neutral-700" : "bg-white text-neutral-900 border-neutral-200";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerCls}>
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className={`${contentBase} rounded-xl ${minWidth}`}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
