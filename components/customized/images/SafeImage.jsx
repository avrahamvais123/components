"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SafeImage({
  src,
  alt,
  fallback,
  className,
  fallbackClassName,
  wrapperClassName,
  ...props
}) {
  const [isError, setIsError] = useState(false);

  return (
    <div className={cn("relative full center", wrapperClassName)}>
      {isError ? (
        <Image
          {...props}
          className={cn("size-1/2", fallbackClassName)}
          src={fallback ?? "/images/empty-image.png"}
          alt={alt}
        />
      ) : (
        <Image
          {...props}
          className={cn("object-cover size-[70%]", className)}
          src={src}
          alt={alt}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
}
