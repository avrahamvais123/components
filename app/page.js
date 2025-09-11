"use client";

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
      <div className="full col center gap-4">
        
      </div>
    </div>
  );
}
