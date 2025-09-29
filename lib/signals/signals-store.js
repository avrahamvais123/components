import { deepSignal } from "deepsignal/react";

export const store = deepSignal({ count: 0, test: "hello" });

export const cart = deepSignal({});
export const favorities = deepSignal([]);
export const ui = deepSignal({ 
  cartModalOpen: false 
});

/* אפשר להשתמש בסיגנלים הגלובליים אבל לשים בכל קומפוננטה את זה */
// import { useSignals } from "@preact/signals-react/runtime";

/* ואפשר להשתמש ישירות בקומפוננטה בסיגנליים מקומיים ככה */
// import { useDeepSignal } from "deepsignal/react";
