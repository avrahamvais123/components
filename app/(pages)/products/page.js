import ProductGrid from "@/components/customized/products/ProductGrid";
import React from "react";
import { medusa } from "@/lib/medusa";

const products = [
  {
    id: 1,
    title: "חלב טרי",
    description: "1 ליטר, תנובה.",
    price: 11.9,
    image: "/images/milk.jpg",
    quantity: 10,
    hot: true,
    sale: true,
  },
  {
    id: 2,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
  },
  {
    id: 3,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
  },
  {
    id: 4,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
  },
  {
    id: 5,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
  },
  {
    id: 6,
    title: "שוקו",
    description: "1 ליטר, שוקו תנובה.",
    price: 18.9,
    image: "/images/milk.jpg",
    quantity: 10,
  },
];

const Page = async (porps) => {
  const searchParams = await porps.searchParams;
  const productName = searchParams?.name ?? "";

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-accent">
      <ProductGrid products={products} />
    </div>
  );
};

export default Page;
