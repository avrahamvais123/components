"use client";

import React, { useMemo, useState } from "react";
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
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ProductGrid (Defensive Edition)
 * ------------------------------------------------------
 * FIX: Keeps favorite (heart) & badges above the image while it scales.
 * - Added z-20 to the heart button and badges
 * - Ensured the image wrapper is z-0
 *
 * Props:
 *  - products: Array of possibly-partial product items
 *      {
 *        id?: string | number
 *        title?: string
 *        description?: string
 *        price?: number
 *        image?: string
 *        quantity?: number
 *        hot?: boolean
 *        sale?: boolean
 *      }
 *  - currency?: string             // e.g. "₪" or "$"
 *  - onAdd?: (item) => void        // called when Add button clicked
 *  - onFavToggle?: (id, isFav) => void // called when favorite toggled
 *
 * Notes:
 *  - RTL-friendly: wrap parent with dir="rtl".
 *  - Uses shadcn/ui + TailwindCSS.
 */
export default function ProductGrid({
  products = [],
  currency = "₪",
  onAdd,
  onFavToggle,
}) {
  const safeProducts = useMemo(() => sanitizeProducts(products), [products]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {safeProducts.map((p, idx) => (
          <ProductCard
            key={p.id ?? `product-${idx}`}
            product={p}
            currency={currency}
            onAdd={onAdd}
            onFavToggle={onFavToggle}
          />
        ))}
      </div>
      {safeProducts.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          לא נמצאו מוצרים להצגה.
        </p>
      )}
    </div>
  );
}

/**
 * ProductCard expects a *normalized* product (see normalizeProduct).
 */
function ProductCard({ product, currency, onAdd, onFavToggle }) {
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
    <Card className="overflow-hidden pt-0 group shadow-none border border-border hover:shadow-xl shadow-light-50 transition-shadow duration-200">
      <div className="relative">
        {/* Favorite (always above image) */}
        <button
          onClick={toggleFav}
          aria-label={fav ? "הסר ממועדפים" : "הוסף למועדפים"}
          className={cn(
            "absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
        <div className="relative z-0 aspect-square overflow-hidden bg-muted/30">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-muted-foreground">
              אין תמונה
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-base font-semibold leading-tight line-clamp-2">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
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

      <Separator className="my-2" />

      <CardFooter className="pt-0">
        <Button className="w-full" onClick={handleAdd}>
          <ShoppingCart className="h-4 w-4 ms-2" /> הוסף לסל
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---------------------- Utils ----------------------
function sanitizeProducts(input) {
  if (!Array.isArray(input)) {
    console.warn("ProductGrid: 'products' is not an array. Received:", input);
    return [];
  }
  return input.map((item, idx) => normalizeProduct(item, idx)).filter(Boolean);
}

function normalizeProduct(raw, idx) {
  if (!raw || typeof raw !== "object") {
    console.warn(
      `ProductGrid: Skipping product at index ${idx} because it is not an object.`,
      raw
    );
    return null;
  }
  const id = raw.id ?? `product-${idx}`;
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title
      : "מוצר ללא שם";
  const description =
    typeof raw.description === "string" ? raw.description : "";
  const price =
    typeof raw.price === "number" && Number.isFinite(raw.price) ? raw.price : 0;
  const image = typeof raw.image === "string" ? raw.image : "";
  const qtyRaw = Number(raw.quantity);
  const quantity = Number.isFinite(qtyRaw) ? clamp(qtyRaw, 1, 99) : 1;
  const hot = Boolean(raw.hot);
  const sale = Boolean(raw.sale);

  return { id, title, description, price, image, quantity, hot, sale };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function formatPrice(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "0.00";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------- Example Usage ----------------------
/**
 * Example usage in a Next.js page or component (RTL):
 *
 * <section dir="rtl" className="p-4 lg:p-6">
 *   <ProductGrid
 *     currency="₪"
 *     products={validProducts}
 *     onAdd={(item) => console.log("Add to cart:", item)}
 *     onFavToggle={(id, isFav) => console.log("Fav toggled:", id, isFav)}
 *   />
 * </section>
 */

// ---------------------- Test Cases ----------------------
// Keep these for quick manual verification.
export const validProducts = [
  {
    id: 1,
    title: "קפה שחור",
    description: "250 גר׳ טחון טרי.",
    price: 18.9,
    image: "/images/coffee.jpg",
    hot: true,
  },
  {
    id: 2,
    title: "שמן זית כתית",
    description: "750 מ" + "ל, קורטינה.",
    price: 39.0,
    image: "/images/olive-oil.jpg",
    sale: true,
  },
  {
    id: 3,
    title: "פסטה פנה",
    description: "500 גר׳ חיטת דורום.",
    price: 7.5,
    image: "/images/pasta.jpg",
  },
  {
    id: 4,
    title: "טחינה",
    description: "400 גר׳ אל-ארז.",
    price: 14.9,
    image: "/images/tahini.jpg",
    hot: true,
    sale: true,
  },
];

export const productsWithNulls = [
  null,
  undefined,
  42,
  { title: "ללא מחיר", description: "אין price מוגדר", image: "" },
  { id: "A-7", title: "רק שם", price: 0 },
  { id: "A-8", description: "רק תיאור", price: 12.3 },
  { id: "A-9", title: "כמות לא חוקית", price: 10, quantity: -5 },
  {
    id: "A-10",
    title: "מוצר תקין",
    description: "בדיקה",
    price: 22.9,
    hot: true,
  },
];

/* export function ProductGridTestCases() {
  return (
    <div className="space-y-10 p-4" dir="rtl">
      <section>
        <h2 className="text-lg font-bold mb-2">מוצרים תקינים</h2>
        <ProductGrid
          products={validProducts}
          currency="₪"
          onAdd={console.log}
          onFavToggle={console.log}
        />
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">
          מערך עם null/undefined/לא תקין
        </h2>
        <ProductGrid
          products={productsWithNulls}
          currency="₪"
          onAdd={console.log}
          onFavToggle={console.log}
        />
      </section>
      <section>
        <h2 className="text-lg font-bold mb-2">ריק (אמור להציג הודעה קצרה)</h2>
        <ProductGrid products={[]} currency="₪" />
      </section>
    </div>
  );
}
 */
