import ProductGrid from "@/components/customized/products/ProductGrid";
import React from "react";
import { medusa } from "@/lib/medusa";
import Image from "next/image";

const products = [
  {
    id: 1,
    title: "חלב טרי",
    description: "1 ליטר, תנובה.",
    price: 11.9,
    image: "/images/milk.jpg",
    quantity: 1,
    hot: true,
    sale: true,
  },
  {
    id: 2,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 1,
  },
  {
    id: 3,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 1,
  },
  {
    id: 4,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 1,
  },
  {
    id: 5,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 1,
  },
  {
    id: 6,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 1,
  },
];

const Page = async (porps) => {
  const searchParams = await porps.searchParams;
  const productName = searchParams?.name ?? "";

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-accent">
      <div className="relative w-full h-100 overflow-hidden">
        <div className="absolute inset-0 z-10 full bg-black/30" />
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
