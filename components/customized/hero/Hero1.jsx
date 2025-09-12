import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero1 = () => {
  return (
    <section className="relative min-h-[calc(100dvh-5rem)] center px-6 overflow-hidden">
      <Image
        src="/images/background-image.png"
        alt="background image"
        fill
        priority
        className="absolute inset-0 object-cover"
      />
      <div className="absolute top-10 md:top-20 md:right-30 p-4 col-center md:items-start text-white max-w-md md:max-w-3xl">
        {/* <Badge variant="secondary" className="rounded-full py-1 border-border" asChild>
          <Link href="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge> */}
        <h1 className="mt-6">
          זולפה - הסל הזול ביותר למשפחה שלך
        </h1>
        <p className="mt-6 md:text-lg max-w-100">
          בזולפה תוכלו למצוא פירות וירקות, מוצרי מזון יבשים, חד פעמי, מוצרי
          תינוקות, מוצרים לבית ועוד..
        </p>
        <div className="mt-12 flex items-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="size-5" /> Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
