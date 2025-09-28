"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Flame, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import SafeImage from "../images/SafeImage";
import React from "react";
import { useSignal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { cart, favorities } from "@/lib/signals/signals-store";

export default function ProductCard({ product, currency = "₪" }) {
  useSignals(); // מאזין לכל קריאה של סיגנלים/פרוקסי במהלך הרנדר

  const inc = () => {
    product.quantity = clamp((product.quantity ?? 0) + 1, 1, 99);
    // עדכון כמות בעגלה או הוספה לעגלה אם לא קיים
    const id = product.id;
    if (!id) return;
    if (cart[id]) {
      cart[id].quantity = product.quantity;
    } else {
      cart[id] = { ...product };
    }
  };

  const dec = () => {
    product.quantity = clamp((product.quantity ?? 1) - 1, 1, 99);
    // עדכון כמות בעגלה או הוספה לעגלה אם לא קיים
    const id = product.id;
    if (!id) return;
    if (cart[id]) {
      cart[id].quantity = product.quantity;
    } else {
      cart[id] = { ...product };
    }
  };

  const quantityChange = (e) => {
    const num = parseInt(e.currentTarget.value, 10);
    product.quantity = Number.isFinite(num) ? clamp(num, 1, 99) : 1;
    // עדכון כמות בעגלה או הוספה לעגלה אם לא קיים
    const id = product.id;
    if (!id) return;
    if (cart[id]) {
      cart[id].quantity = product.quantity;
    } else {
      cart[id] = { ...product };
    }
  };

  const toggleFav = () => {};

  const handleAdd = () => {
    console.log("הוספת מוצר לעגלה:🔵", product);
    console.log("cart🟡: ", cart);

    const id = product.id;
    if (!id) return; // הגנה – חובה ID

    // אם הכמות התחלתית היא 0 או לא קיימת – נהפוך אותה ל-1
    const nextQty =
      product.quantity && Number.isFinite(product.quantity)
        ? product.quantity
        : 0;
    if (nextQty <= 0) {
      product.quantity = 1; // זה יגרום לרנדר מחדש ולהציג את ה־QtyStepper
    }

    // אם כבר יש בעגלה – נוסיף את הכמות הנוכחית של המוצר (עכשיו לפחות 1)
    if (cart[id]) {
      cart[id].quantity += product.quantity;
    } else {
      cart[id] = { ...product };
    }

    console.log("product.quantity🟣:", product.quantity);
    console.log("cart[id].quantity🟢:", cart[id].quantity);
  };
  console.log('cart: ', cart);

  return (
    <Card className="full overflow-hidden p-2 gap-2 group hover:border-neutral-600 transition-all shadow-none">
      <div className="relative">
        {/* Favorite */}
        {/* <button
          onClick={toggleFav}
          aria-label={fav ? "הסר ממועדפים" : "הוסף למועדפים"}
          className={cn(
            "absolute top-3 right-3 z-20 p-2 rounded-full bg-white/50 backdrop-blur hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              fav ? "fill-red-500 text-red-500" : "text-foreground/70"
            )}
          />
        </button> */}

        {/* Badges */}
        <div className="absolute z-20 top-3 flex gap-2 left-3">
          {product.hot && (
            <Badge className="bg-red-600 text-white hover:bg-red-600 inline-flex items-center gap-1">
              חם <Flame className="size-3" />
            </Badge>
          )}
          {product.sale && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-500 inline-flex items-center gap-1">
              מבצע <Percent className="size-3" />
            </Badge>
          )}
        </div>

        {/* Image */}
        <div className="relative z-0 rounded-md aspect-square overflow-hidden">
          {product.image ? (
            <SafeImage
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              wrapperClassName=""
              className="full object-cover transition-transform duration-300"
            />
          ) : (
            <div className="full grid place-items-center text-muted-foreground">
              אין תמונה
            </div>
          )}
        </div>
      </div>

      <CardHeader>
        <h3 className="text-base font-semibold line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground -mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold tracking-tight">
            {currency}
            {formatPrice(product.price)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-2 center justify-end">
        {/* Qty stepper */}
        {product.quantity ? (
          <QtyStepper
            quantity={product.quantity}
            onInc={inc}
            onDec={dec}
            onChange={quantityChange}
          />
        ) : (
          <Button
            className="rounded-full h-8 bg-red-600 hover:bg-red-500 border border-red-600"
            onClick={handleAdd}
          >
            <ShoppingCart className="size-4" /> הוסף לסל
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

const Calculator = ({ price, quantity, currency = "₪" }) => {
  const total = price * quantity;
  return (
    <div className="text-sm text-muted-foreground">
      {quantity} x {currency}
      {formatPrice(price)} = {currency}
      <span className="font-bold text-foreground">{formatPrice(total)}</span>
    </div>
  );
};

const QtyStepper = ({ quantity, onInc, onDec, onChange }) => {
  return (
    <div className="flex items-center rounded-full border bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-r-full text-red-600 hover:text-white hover:bg-red-600"
        onClick={onInc}
        aria-label="הוסף כמות"
      >
        ＋
      </Button>
      <input
        type="text"
        className="w-8 text-center focus-within:outline-none appearance-none"
        value={quantity}
        onInput={onChange}
        aria-live="polite"
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-l-full text-red-600 hover:text-white hover:bg-red-600"
        onClick={onDec}
        aria-label="הפחת כמות"
      >
        −
      </Button>
    </div>
  );
};

/* --------- utils --------- */
function formatPrice(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "0.00";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
