import React from "react";

const Page = async (porps) => {
  const searchParams = await porps.searchParams;
  const productName = searchParams?.name ?? "";
  return <div className="min-h-[calc(100dvh-5rem)] center">{productName}</div>;
};

export default Page;
