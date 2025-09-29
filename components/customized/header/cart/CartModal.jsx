"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cart, ui } from "@/lib/signals/signals-store";
import {
  useComputed,
  useSignals,
  useSignalEffect,
} from "@preact/signals-react/runtime";
import { deepSignal } from "deepsignal/react";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { signal } from "@preact/signals-react";

const openModal = signal(false); // ✅ נשמר בין רנדרים

const CartModal = () => {
  useSignals(); // נדרש לשימוש ב-signals

  const cartCount = useComputed(() => Object.keys(cart).length);
  const cartItems = useComputed(() => Object.values(cart));
  const totalPrice = useComputed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  console.log("Component rendered 🔴"); // כדי לראות מתי יש רנדר

  useSignalEffect(() => {
    console.log("openModal: ", openModal.value);
  });

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // אם הכמות 0 או פחות, נמחק מהעגלה
      delete cart[productId];
    } else {
      // נעדכן את הכמות בעגלה
      if (cart[productId]) {
        cart[productId].quantity = newQuantity;
      }
    }
  };

  const removeFromCart = (productId) => {
    delete cart[productId];
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingCart className="size-6 text-foreground/70" />
          {cartCount.value > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white center rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartCount.value}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>עגלת הקניות שלך</SheetTitle>
          <SheetDescription>
            {cartCount.value === 0 
              ? "העגלה שלך ריקה" 
              : `יש לך ${cartCount.value} מוצרים בעגלה`
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4">
            {cartCount.value === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">העגלה שלך ריקה</p>
                <p className="text-sm text-muted-foreground">הוסף מוצרים כדי להתחיל</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.value.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">₪{item.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-red-100 text-red-600 mr-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer with total and checkout */}
          {cartCount.value > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center font-semibold">
                <span>סה"כ:</span>
                <span>₪{totalPrice.value.toFixed(2)}</span>
              </div>
              
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                המשך לתשלום
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;
