"use client";

import DynamicForm from "@/components/customized/form/DynamicForm";
import Hero1 from "@/components/customized/hero/Hero1";
import { ThemeToggle } from "@/components/customized/utils/ThemeToggle";
import Features6 from "@/components/features/Features6";
import Features7 from "@/components/features/Features7";
import { store } from "@/lib/signals-store";
import { useSignals } from "@preact/signals-react/runtime";
import { useDeepSignal } from "deepsignal/react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import {
  NumberField,
  Label,
  Group,
  Input,
  Button,
  FieldError,
  Text,
} from "react-aria-components";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const fields = [
  {
    name: "fullName",
    label: "שם מלא",
    type: "text",
    placeholder: "הקלד/י שם",
    required: true,
    validate: z.string().min(2, "לפחות 2 תווים"),
  },
  {
    name: "email",
    label: "אימייל",
    type: "email",
    placeholder: "name@example.com",
    required: true,
    validate: z.string().email("אימייל לא תקין"),
  },
  {
    name: "age",
    label: "גיל",
    type: "number",
    placeholder: "18",
    description: "מספרים בלבד",
  },
  {
    name: "password",
    label: "סיסמה",
    type: "password",
    required: true,
    validate: z.string().min(6, "לפחות 6 תווים"),
  },
  {
    name: "bio",
    label: "על עצמי",
    type: "textarea",
    placeholder: "כמה מילים...",
  },
  {
    name: "role",
    label: "תפקיד",
    type: "select",
    placeholder: "בחר/י תפקיד",
    options: [
      { label: "מנהל/ת", value: "admin" },
      { label: "עורך/ת", value: "editor" },
      { label: "משתמש/ת", value: "user" },
    ],
    required: true,
  },
  {
    name: "plan",
    label: "בחירת מסלול",
    type: "radio",
    options: [
      { label: "בסיסי", value: "basic" },
      { label: "מתקדם", value: "pro" },
      { label: "ארגוני", value: "enterprise" },
    ],
    required: true,
  },
  {
    name: "terms",
    label: "אני מאשר/ת את התנאים",
    type: "checkbox",
    required: true,
  },
  {
    name: "newsletter",
    label: "קבלת עדכונים במייל",
    type: "switch",
    defaultValue: true,
  },
  { name: "startDate", label: "תאריך התחלה", type: "date" },
  { name: "attachment", label: "קובץ צרופה", type: "file" },
];

function handleSubmit(data) {
  console.log("Submitted data:", data);
}

export default function Home() {
  useSignals(); // חשוב כדי ש-React "ישמע" לקריאות לסיגנלים בזמן רנדר
  const { data: session } = useSession();
  console.log("session: ", session);
  console.log("store: ", store);

  return (
    <div className="bg-muted">
      <Hero1 />
      <Features6 />
      {/* <Features7 /> */}
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-background">
        <DynamicForm
          title="רישום משתמש"
          fields={fields}
          onSubmit={handleSubmit}
        />

        <NumberField
          defaultValue={1024}
          minValue={0}
          className="group/num w-full"
        >
          <div className="mb-1 flex items-baseline justify-between">
            <Label
              className={cn(
                "text-sm font-medium text-zinc-800 dark:text-zinc-100",
                "group-data-[invalid]/num:text-red-600"
              )}
            >
              רוחב (px)
            </Label>
          </div>

          <Group
            className={`
            flex items-stretch w-full overflow-hidden rounded-xl border bg-white
            border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 transition
            focus-within:ring-2 focus-within:ring-zinc-950/10 dark:focus-within:ring-white/10
            data-[invalid]:border-red-500 data-[invalid]:focus-within:ring-red-500/20
            data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed
          `}
          >
            <Button
              slot="decrement"
              className={`
              grid place-items-center px-3 min-h-10 aspect-square
              border-e border-zinc-300 dark:border-zinc-700
              hover:bg-zinc-50 dark:hover:bg-zinc-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/10
              aria-[disabled=true]:opacity-40
            `}
            >
              <Minus size={18} />
            </Button>

            <Input
              className={`
              w-full px-3 text-base leading-none bg-transparent outline-none
              text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              text-center sm:text-start
            `}
              placeholder="0"
            />

            <Button
              slot="increment"
              className={`
              grid place-items-center px-3 min-h-10 aspect-square
              border-s border-zinc-300 dark:border-zinc-700
              hover:bg-zinc-50 dark:hover:bg-zinc-800
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/10
              aria-[disabled=true]:opacity-40
            `}
            >
              <Plus size={18} />
            </Button>
          </Group>

          <FieldError className="mt-1 text-xs text-red-600" />
        </NumberField>
      </div>
    </div>
  );
}
