"use client";

import { Button } from "@/components/ui/button";
import { useSignal } from "@preact/signals-react";

export default function Home() {
  const count = useSignal(0, { name: "count" });
  return (
    <div className="h-dvh test">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello, Preact Signal!</h1>
        <p className="text-lg">Count: {count}</p>
        <Button onClick={() => count.value++}>Increment</Button>
      </div>
    </div>
  );
}
