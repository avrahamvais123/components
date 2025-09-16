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
      </div>
    </div>
  );
}
