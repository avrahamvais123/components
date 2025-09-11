"use client";

import Hero01 from "@/components/customized/hero/hero-01";
import { ThemeToggle } from "@/components/customized/ThemeToggle";
import Features6 from "@/components/features/Features6";
import Features7 from "@/components/features/Features7";
import { store } from "@/lib/signals-store";
import { useSignals } from "@preact/signals-react/runtime";
import { useSession } from "next-auth/react";

export default function Home() {
  useSignals(); // חשוב כדי ש-React "ישמע" לקריאות לסיגנלים בזמן רנדר
  const { data: session } = useSession();
  console.log("session: ", session);
  console.log('store: ', store);

  return (
    <div className="h-dvh bg-muted">
      <Hero01 />
      <Features6 />
      {/* <Features7 /> */}
    </div>
  );
}
