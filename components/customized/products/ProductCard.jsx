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
import { cart } from "@/lib/signals/signals-store";

export default function ProductCard({ key, product, currency = "₪" }) {
  useSignals(); // מאזין לכל קריאה של סיגנלים/פרוקסי במהלך הרנדר

  // סיגנל מקומי (לא useState)
  const fav = useSignal(false);

  const inc = () => {
    product.quantity = clamp(product.quantity + 1, 1, 99);
  };

  const dec = () => {
    product.quantity = clamp(product.quantity - 1, 1, 99);
  };

  const quantityChange = (e) => {
    const num = parseInt(e.currentTarget.value, 10);
    product.quantity = Number.isFinite(num) ? clamp(num, 1, 99) : 1;
  };

  const toggleFav = () => {
    fav.value = !fav.value;
    onFavToggle?.(product.id, fav.value);
  };

  const handleAdd = () => {
    console.log("הוספת מוצר לעגלה:", product);
    console.log("cart: ", cart);

    if (cart.find((p) => p.id === product.id)) {
      // מוצר כבר קיים בעגלה, אפשר להציג הודעה או לעדכן כמות
      console.log("המוצר כבר קיים בעגלה.");

      const index = cart.findIndex((p) => p.id === product.id);
      cart[index].quantity++;
    } else {
      cart.push(product);
    }
  };

  return (
    <Card
      key={key}
      className="full overflow-hidden p-2 gap-2 group hover:border-neutral-600 transition-all shadow-none"
    >
      <div className="relative">
        {/* Favorite */}
        <button
          onClick={toggleFav}
          aria-label={fav.value ? "הסר ממועדפים" : "הוסף למועדפים"}
          className={cn(
            "absolute top-3 right-3 z-20 p-2 rounded-full bg-white/50 backdrop-blur hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              fav.value ? "fill-red-500 text-red-500" : "text-foreground/70"
            )}
          />
        </button>

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

      <CardFooter className="px-4 py-2 center justify-between">
        {/* Qty stepper */}
        <div className="flex items-center rounded-full border bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-r-full text-red-600 hover:text-white hover:bg-red-600"
            onClick={inc}
            aria-label="הוסף כמות"
          >
            ＋
          </Button>
          <input
            type="text"
            className="w-8 text-center focus-within:outline-none appearance-none"
            value={product.quantity}
            onInput={quantityChange}
            aria-live="polite"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-l-full text-red-600 hover:text-white hover:bg-red-600"
            onClick={dec}
            aria-label="הפחת כמות"
          >
            −
          </Button>
        </div>

        <Button
          className="rounded-full h-8 bg-red-600 hover:bg-red-500 border border-red-600"
          onClick={handleAdd}
        >
          <ShoppingCart className="size-4" /> הוסף לסל
        </Button>
      </CardFooter>
    </Card>
  );
}

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
