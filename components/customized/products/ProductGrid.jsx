"use client";

import React, { Fragment } from "react";
import ProductCard from "./ProductCard";
import { useSignals } from "@preact/signals-react/runtime";
import { products } from "@/lib/signals/signals-products";

export default function ProductGrid() {
  useSignals();

  return (
    <div className="full p-8 min-h-[calc(100dvh-4rem)] bg-white dark:bg-neutral-950">
      <div className="max-w-9xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {products.map((p, idx) => (
          <Fragment key={p?.id ?? idx}>
            <ProductCard product={p} />
          </Fragment>
        ))}
      </div>
      {products.length === 0 && (
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
