import ProductGrid from "@/components/customized/products/ProductGrid";
import React from "react";
import Image from "next/image";

const Page = async (porps) => {
  const searchParams = await porps.searchParams;
  const productName = searchParams?.name ?? "";

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-accent">
      <div className="relative w-full h-100 overflow-hidden">
        <div className="absolute inset-0 z-10 full bg-neutral-900/70 center">
          <div className="col-center gap-4 max-w-5xl">
            <h1 className="font-bold text-white">{productName}</h1>
            <p className="text-white text-center">
              מוצרי חלב ומשקאות חלב הם חלק מרכזי מתזונה יומיומית מאוזנת. הם
              מספקים מקור חשוב לסידן, חלבון וערכים תזונתיים חיוניים, ותורמים
              לשמירה על אורח חיים בריא. אצלנו תמצאו מגוון מוצרי חלב ומשקאות
              איכותיים, טריים ובסטנדרט גבוה, המתאימים לכל המשפחה.
            </p>
          </div>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1506617420156-8e4536971650?q=80&w=3223&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dg"
          alt="image hero"
          width={400}
          height={100}
          className="absolute inset-0 full object-cover"
        />
      </div>
      <ProductGrid />
    </div>
  );
};

export default Page;
