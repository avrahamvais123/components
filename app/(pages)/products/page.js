"use client";

import ProductGrid from "@/components/customized/products/ProductGrid";
import React from "react";
import { medusa } from "@/lib/medusa";
import Image from "next/image";

const products = [
  // 🥛 חלב ומשקאות חלב
  {
    id: 1,
    title: "חלב 3%",
    description: "חלב פרה 1 ליטר, תנובה.",
    price: 6.9,
    image:
      "https://images.unsplash.com/photo-1634141510639-d691d86f47be?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
    hot: true,
  },
  {
    id: 2,
    title: "חלב 1%",
    description: "חלב דל שומן 1 ליטר.",
    price: 6.5,
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 3,
    title: "חלב סויה",
    description: "משקה סויה טבעי ללא לקטוז.",
    price: 12.9,
    image:
      "https://images.unsplash.com/photo-1722518252679-3a77ae458836?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
    sale: true,
  },
  {
    id: 4,
    title: "חלב שקדים",
    description: "חלב צמחי על בסיס שקדים.",
    price: 14.5,
    image:
      "https://images.unsplash.com/photo-1601436423474-51738541c1b1?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 5,
    title: "שוקו בקבוק",
    description: 'שוקו קר 500 מ"ל.',
    price: 8.9,
    image:
      "https://plus.unsplash.com/premium_photo-1663853293850-6099a76d4c51?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 6,
    title: "חלב נטול לקטוז",
    description: "1 ליטר, תנובה נטול לקטוז.",
    price: 9.9,
    image:
      "https://images.unsplash.com/photo-1553301803-768cd4a59b9c?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },

  // 🧀 גבינות
  {
    id: 7,
    title: "גבינת קוטג'",
    description: "5% שומן, גביע 250 גרם.",
    price: 7.9,
    image:
      "https://plus.unsplash.com/premium_photo-1663127123513-a11369f67c8c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
    hot: true,
  },
  {
    id: 8,
    title: "גבינה צהובה",
    description: "פרוסות 28% שומן, 200 גרם.",
    price: 15.9,
    image:
      "https://plus.unsplash.com/premium_photo-1700004499998-7036bab69a46?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 9,
    title: "גבינת מוצרלה",
    description: "מגורדת, 200 גרם.",
    price: 13.9,
    image:
      "https://images.unsplash.com/photo-1674526498355-e20c280bc6ef?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 10,
    title: "גבינה בולגרית",
    description: "16% שומן, קוביות במים.",
    price: 12.9,
    image:
      "https://plus.unsplash.com/premium_photo-1700612684956-2a6b996d6df7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
  },
  {
    id: 11,
    title: "גבינת שמנת",
    description: "30% שומן, 200 גרם.",
    price: 11.9,
    image:
      "https://images.unsplash.com/photo-1663447170676-99f1ec83931a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quantity: 1,
    sale: true,
  },

  // 🥣 יוגורטים
  {
    id: 12,
    title: "יוגורט טבעי",
    description: "3% שומן, גביע 200 גרם.",
    price: 4.9,
    image: "https://images.unsplash.com/photo-1565958011703-44e266f64668",
    quantity: 1,
  },
  {
    id: 13,
    title: "יוגורט יווני",
    description: "10% שומן, 150 גרם.",
    price: 5.9,
    image: "https://images.unsplash.com/photo-1604908812812-8ecb2f7a78a1",
    quantity: 1,
    hot: true,
  },
  {
    id: 14,
    title: "יוגורט עם תות",
    description: "יוגורט פרי 0% שומן, 150 גרם.",
    price: 5.5,
    image: "https://images.unsplash.com/photo-1626082825044-3fb9f3d2bff9",
    quantity: 1,
  },
  {
    id: 15,
    title: "יוגורט עם אפרסק",
    description: "יוגורט פרי, 150 גרם.",
    price: 5.5,
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac61",
    quantity: 1,
  },
  {
    id: 16,
    title: "יוגורט לשתייה",
    description: '500 מ"ל, בטעמים שונים.',
    price: 9.9,
    image: "https://images.unsplash.com/photo-1565958011703-44e266f64668",
    quantity: 1,
  },

  // 🌾 חמאה ומרגרינה
  {
    id: 17,
    title: "חמאה מתוקה",
    description: "200 גרם, תנובה.",
    price: 12.9,
    image: "https://images.unsplash.com/photo-1632324348946-cc0d9ff556c0",
    quantity: 1,
    hot: true,
  },
  {
    id: 18,
    title: "חמאה מלוחה",
    description: "200 גרם.",
    price: 13.5,
    image: "https://images.unsplash.com/photo-1589187155479-039a7ec9af1c",
    quantity: 1,
  },
  {
    id: 19,
    title: "מרגרינה לאפייה",
    description: "חבילת 200 גרם.",
    price: 6.9,
    image: "https://images.unsplash.com/photo-1602526218858-65b2f0d04583",
    quantity: 1,
  },
  {
    id: 20,
    title: "חמאה אורגנית",
    description: "חמאה אורגנית, 200 גרם.",
    price: 15.9,
    image: "https://images.unsplash.com/photo-1617196037570-c0a0a8d5d6d4",
    quantity: 1,
    sale: true,
  },
  {
    id: 21,
    title: "חמאת שום",
    description: "חמאת שום ועשבי תיבול.",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1617196037570-c0a0a8d5d6d4",
    quantity: 1,
  },
];

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
              איכותיים, טריים ובסטנדרט גבוה, המתאימים לכל המשפחה.{" "}
            </p>
          </div>
        </div>
        <Image
          src="/images/background-image.png"
          alt="image hero"
          width={400}
          height={100}
          className="absolute inset-0 full object-cover"
        />
      </div>
      <ProductGrid products={products} />
    </div>
  );
};

export default Page;
