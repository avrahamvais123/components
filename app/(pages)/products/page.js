import ProductGrid from "@/components/customized/ProductGrid";
import React from "react";
import { medusa } from "@/lib/medusa";

const products = [
  {
    id: 1,
    title: "חלב טרי",
    description: "1 ליטר, תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
    hot: true,
    sale: true,
  },
];

const Page = async (porps) => {
  const searchParams = await porps.searchParams;
  const productName = searchParams?.name ?? "";

  return (
    <div className="min-h-[calc(100dvh-5rem)] center">
      <ProductGrid products={products} />
    </div>
  );
};

export default Page;
