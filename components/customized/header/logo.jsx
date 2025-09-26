import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({ className }) => {
  return (
    <Link href="/" className="h-10 w-auto">
      <Image
        src="/images/logo-dark.png"
        alt="Logo light"
        width={200}
        height={100}
        className={cn("object-contain full dark:hidden", className)}
        priority
      />
      <Image
        src="/images/logo-light.png"
        alt="Logo dark"
        width={200}
        height={100}
        className={cn("object-contain full hidden dark:block", className)}
        priority
      />
    </Link>
  );
};
