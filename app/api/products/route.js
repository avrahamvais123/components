import { NextResponse } from 'next/server';

// מחירי מוצרים (יכול להיות גם ממסד נתונים)
const PRODUCT_CATALOG = {
  'product-1': {
    id: 'product-1',
    name: 'מוצר ראשון',
    price: 25.99,
    currency: 'USD',
    category: 'electronics',
    inStock: true,
  },
  'product-2': {
    id: 'product-2',
    name: 'מוצר שני',
    price: 15.50,
    currency: 'USD',
    category: 'clothing',
    inStock: true,
  },
  'product-3': {
    id: 'product-3',
    name: 'מוצר שלישי',
    price: 89.99,
    currency: 'USD',
    category: 'books',
    inStock: false,
  },
  'milk': {
    id: 'milk',
    name: 'חלב',
    price: 4.99,
    currency: 'USD',
    category: 'dairy',
    inStock: true,
  },
};

// קבלת מידע על מוצר בודד
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (productId) {
      const product = PRODUCT_CATALOG[productId];
      if (!product) {
        return NextResponse.json(
          { error: 'מוצר לא נמצא' }, 
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    } else {
      // החזרת כל הקטלוג
      return NextResponse.json(PRODUCT_CATALOG);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' }, 
      { status: 500 }
    );
  }
}

// עדכון מחיר מוצר (למטרות ניהול)
export async function PUT(request) {
  try {
    const { id, price, inStock } = await request.json();

    if (!id || !PRODUCT_CATALOG[id]) {
      return NextResponse.json(
        { error: 'מוצר לא נמצא' }, 
        { status: 404 }
      );
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return NextResponse.json(
          { error: 'מחיר לא תקין' }, 
          { status: 400 }
        );
      }
      PRODUCT_CATALOG[id].price = price;
    }

    if (inStock !== undefined) {
      PRODUCT_CATALOG[id].inStock = Boolean(inStock);
    }

    return NextResponse.json(PRODUCT_CATALOG[id]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' }, 
      { status: 500 }
    );
  }
}

// פונקציה לחישוב סכום עגלה (להשתמש מקומות אחרים)
export function calculateCartTotal(cartItems) {
  if (!Array.isArray(cartItems)) {
    throw new Error('Cart items must be an array');
  }

  let total = 0;
  const itemsBreakdown = [];

  for (const item of cartItems) {
    const product = PRODUCT_CATALOG[item.id];
    if (!product) {
      throw new Error(`מוצר לא נמצא: ${item.id}`);
    }

    if (!product.inStock) {
      throw new Error(`מוצר לא במלאי: ${product.name}`);
    }

    const quantity = parseInt(item.quantity) || 1;
    const itemTotal = product.price * quantity;
    
    total += itemTotal;
    itemsBreakdown.push({
      ...product,
      quantity,
      itemTotal: Math.round(itemTotal * 100) / 100,
    });
  }

  return {
    subtotal: Math.round(total * 100) / 100,
    items: itemsBreakdown,
    currency: 'USD', // או לפי המוצר הראשון
  };
}