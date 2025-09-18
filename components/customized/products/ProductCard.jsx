"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Flame, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import SafeImage from "../images/SafeImage";

/**
 * ProductCard expects a *normalized* product (see normalizeProduct).
 */

export default function ProductCard({ product, currency, onAdd, onFavToggle }) {
  // product is guaranteed to have defaults by normalizeProduct
  const [qty, setQty] = useState(product.quantity);
  const [fav, setFav] = useState(false);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));
  const quantityChange = (e) => {
    const val = e.target.value;
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setQty(1);
    } else {
      setQty(clamp(num, 1, 99));
    }
  };
  const toggleFav = () => {
    setFav((f) => {
      const next = !f;
      try {
        onFavToggle?.(product.id, next);
      } catch {}
      return next;
    });
  };

  const handleAdd = () => {
    try {
      onAdd?.({ ...product, quantity: qty });
    } catch {}
  };

  // Prefer symmetrical layout (works fine for RTL containers)
  return (
    <Card className="full overflow-hidden p-2 gap-2 group hover:border-neutral-600 transition-all shadow-none">
      <div className="relative">
        {/* Favorite (always above image) */}
        <button
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
        </button>

        {/* Badges (always above image) */}
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

        {/* Image (kept below overlays) */}
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

      <CardHeader className="">
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
          {/* Qty stepper */}
          <div className="flex items-center rounded-full border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-r-full"
              onClick={inc}
              aria-label="הוסף כמות"
            >
              ＋
            </Button>
            <input
              type="text"
              className="w-8 text-center focus-within:outline-none appearance-none"
              value={qty}
              onChange={quantityChange}
              aria-live="polite"
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-l-full"
              onClick={dec}
              aria-label="הפחת כמות"
            >
              −
            </Button>
          </div>
        </div>
      </CardContent>

      {/* <Separator className="my-2" /> */}

      <CardFooter className="px-4 py-2">
        <Button className="w-full" onClick={handleAdd}>
          <ShoppingCart className="size-4 ms-2" /> הוסף לסל
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
