import React from "react";
import { clamp } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function QuantityCalculator({ quantity, onQuantityChange }) {
  const increment = () => {
    const newQuantity = clamp((quantity ?? 0) + 1, 1, 99);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    const newQuantity = clamp((quantity ?? 0) - 1, 1, 99);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="quantity-calculator">
      <Button onClick={decrement}>-</Button>
      <span>{quantity}</span>
      <Button onClick={increment}>+</Button>
    </div>
  );
}
