import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Logo = ({ imageClassName, wrapperClassName }) => {
  return (
    <Link href="/" className={cn("h-10 w-auto", wrapperClassName)}>
      <Image
        src="/images/logo-dark.png"
        alt="Logo light"
        width={200}
        height={100}
        className={cn("object-contain full dark:hidden", imageClassName)}
        priority
      />
      <Image
        src="/images/logo-light.png"
        alt="Logo dark"
        width={200}
        height={100}
        className={cn("object-contain full hidden dark:block", imageClassName)}
        priority
      />
    </Link>
  );
};
