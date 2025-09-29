"use client";

import { useState, useEffect } from 'react';

export function useServerPrices() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductCatalog();
  }, []);

  const fetchProductCatalog = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch product catalog');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductPrice = (productId) => {
    return products[productId]?.price || 0;
  };

  const isProductInStock = (productId) => {
    return products[productId]?.inStock ?? false;
  };

  const validateCartItems = (cartItems) => {
    const errors = [];
    
    for (const item of cartItems) {
      const product = products[item.id];
      if (!product) {
        errors.push(`מוצר לא נמצא: ${item.id}`);
        continue;
      }
      
      if (!product.inStock) {
        errors.push(`מוצר לא במלאי: ${product.name}`);
      }
      
      // בדיקת מחיר (אזהרה אם המחיר בקליינט שונה מהשרת)
      if (item.price && Math.abs(item.price - product.price) > 0.01) {
        console.warn(`Price mismatch for ${item.id}: client=${item.price}, server=${product.price}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const calculateServerTotal = (cartItems) => {
    let total = 0;
    const breakdown = [];
    
    for (const item of cartItems) {
      const product = products[item.id];
      if (product) {
        const itemTotal = product.price * (item.quantity || 1);
        total += itemTotal;
        breakdown.push({
          ...product,
          quantity: item.quantity || 1,
          itemTotal: Math.round(itemTotal * 100) / 100
        });
      }
    }
    
    return {
      total: Math.round(total * 100) / 100,
      breakdown
    };
  };

  return {
    products,
    loading,
    error,
    getProductPrice,
    isProductInStock,
    validateCartItems,
    calculateServerTotal,
    refetch: fetchProductCatalog
  };
}