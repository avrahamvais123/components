import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }) => {
  return (
    <>
      <Image
        src="/images/logo-dark.png"
        alt="Logo light"
        width={200}
        height={100}
        className={cn("object-contain h-9 w-auto dark:hidden", className)}
        priority
      />
      <Image
        src="/images/logo-light.png"
        alt="Logo dark"
        width={200}
        height={100}
        className={cn("object-contain h-9 w-auto hidden dark:block", className)}
        priority
      />
    </>
  );
};
