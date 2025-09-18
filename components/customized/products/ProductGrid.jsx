"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

/**
 * ProductGrid (Defensive Edition)
 * ------------------------------------------------------
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
 */
export default function ProductGrid({
  products = [],
  currency = "₪",
  onAdd,
  onFavToggle,
}) {
  const safeProducts = useMemo(() => sanitizeProducts(products), [products]);

  return (
    <div className="full p-8 min-h-[calc(100dvh-4rem)]">
      <div className="max-w-9xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
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
/* export const validProducts = [
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
]; */

/* export const productsWithNulls = [
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
]; */

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
