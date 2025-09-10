"use client";
import { Button } from "@/components/ui/button";
import {  useDeepSignal } from "deepsignal/react";

//const store = deepSignal({ count: 0, test: "hello" });

export default function Home() {
  const store = useDeepSignal({ count: 0, test: "hello" });
  //useSignals(); // חשוב כדי ש-React "ישמע" לקריאות לסיגנלים בזמן רנדר
  return (
    <div className="h-dvh test">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello, DeepSignal!</h1>
        <p className="text-lg">Count: {store.count}</p>
        <p className="text-lg">test: {store.test}</p>
        <Button onClick={() => (store.count += 1)}>Increment</Button>
        <Button onClick={() => (store.test = "world")}>change test</Button>
      </div>
    </div>
  );
}
