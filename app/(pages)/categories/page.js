import React from "react";

const Page = async (porps) => {
  const { searchParams } = await porps;
  const name = searchParams?.name ?? "";
  return <div className="min-h-[calc(100dvh-5rem)] center">{name}</div>;
};

export default Page;
