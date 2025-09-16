"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// shadcn/ui components (adjust import paths to your setup)
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * DynamicShadForm
 * - Builds a beautiful shadcn/ui form from a fields configuration array
 * - Uses react-hook-form; supports basic Zod validation (optional per field)
 *
 * Supported field types:
 * text | email | number | password | textarea | select | checkbox | switch | radio | date | file
 *
 * Field config shape (examples at bottom):
 * {
 *   name: "fullName",
 *   label: "שם מלא",
 *   type: "text",
 *   placeholder: "הקלד/י שם",
 *   required: true,
 *   description: "השם שיופיע בחשבונית",
 *   defaultValue: "",
 *   options: [ // for select/radio only
 *     { label: "אפשרות א'", value: "a" },
 *     { label: "אפשרות ב'", value: "b" },
 *   ],
 *   validate: z.string().min(2, "לפחות 2 תווים"), // optional Zod schema for this field
 * }
 */
export default  function DynamicForm({ fields = [], onSubmit, title = "טופס" }) {
  // Build a Zod schema from provided field-level validate rules; fallback to permissive schema
  const fieldSchemas = {};
  fields.forEach((f) => {
    if (f.validate) fieldSchemas[f.name] = f.validate;
    else {
      // Basic defaults per type
      let base = z.any();
      if (
        ["text", "password", "email", "textarea", "date", "file"].includes(
          f.type
        )
      )
        base = z.any();
      if (f.type === "number")
        base = z.coerce.number({ invalid_type_error: "מספר בלבד" });
      if (f.required)
        base = base.refine((v) => (f.type === "checkbox" ? v === true : !!v), {
          message: "שדה חובה",
        });
      fieldSchemas[f.name] = base;
    }
  });
  const schema = z.object(fieldSchemas);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, f) => {
      acc[f.name] =
        f.defaultValue ??
        (f.type === "checkbox" || f.type === "switch" ? false : "");
      return acc;
    }, {}),
    mode: "onSubmit",
  });

  function renderField(field) {
    const { name, label, type, placeholder, description, options } = field;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
      case "file": {
        const inputType = type === "textarea" ? undefined : type;
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="text-right">
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <Input
                    type={inputType}
                    placeholder={placeholder}
                    {...field}
                    value={type === "file" ? undefined : field.value}
                    onChange={(e) => {
                      if (type === "file")
                        field.onChange(e.target.files?.[0] ?? null);
                      else field.onChange(e);
                    }}
                  />
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case "textarea": {
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem dir="rtl" className="text-right">
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <Textarea rows={4} placeholder={placeholder} {...field} />
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case "select": {
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem dir="rtl" className="text-right">
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder || "בחר/י"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(options || []).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case "checkbox": {
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem
                dir="rtl"
                className="flex flex-row items-start gap-3 rounded-lg border p-3 text-right"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  {label && <FormLabel>{label}</FormLabel>}
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case "switch": {
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem
                dir="rtl"
                className="flex items-center justify-between rounded-lg border p-3 text-right"
              >
                <div className="space-y-1">
                  {label && <FormLabel>{label}</FormLabel>}
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      case "radio": {
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem dir="rtl" className="text-right space-y-3">
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-2"
                  >
                    {(options || []).map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={`${name}-${opt.value}`}
                          value={opt.value}
                        />
                        <Label htmlFor={`${name}-${opt.value}`}>
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }

      default:
        return (
          <div key={name} className="text-sm text-red-500">
            Unsupported field type: <span className="font-mono">{type}</span>
          </div>
        );
    }
  }

  const handleSubmit = (data) => {
    // If you need file upload, data.file will be a File object (if such field exists)
    if (onSubmit) onSubmit(data);
    else alert("Submitted!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl" dir="rtl">
          {title}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 p-4"
          dir="rtl"
        >
          <CardContent className="grid gap-6">
            {fields.map((f) => renderField(f))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              אפס
            </Button>
            <Button type="submit">שליחה</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

/** -------------------------------------------------
 * Demo usage (you can delete below and just import DynamicShadForm)
 * Put this component into any Next.js App Router page.
 * ------------------------------------------------- */
/* export default function DemoForm() {
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
    alert("נתונים נשלחו!\n" + JSON.stringify(data, null, 2));
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-background">
      <DynamicForm
        title="רישום משתמש"
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
} */
