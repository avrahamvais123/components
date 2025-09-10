import { useSignals } from "@preact/signals-react/runtime";
import { deepSignal, useDeepSignal } from "deepsignal/react";


export const store = deepSignal({ count: 0, test: "hello" });