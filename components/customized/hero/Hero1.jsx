import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero1 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[url('/images/background-image.png')] bg-no-repeat bg-cover">
      <div className="text-center max-w-3xl">
        {/* <Badge variant="secondary" className="rounded-full py-1 border-border" asChild>
          <Link href="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge> */}
        <h1
          className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          זולפה - הסל הזל ביותר למשפחה שלך
        </h1>
        <p className="mt-6 md:text-lg">
          בזולפה תוכלו למצוא פירות וירקות,
           מוצרי מזון יבשים, חד פעמי, מוצרי תינוקות, מוצרים לבית ועוד..
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none">
            <CirclePlay className="size-5" /> Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero1;
