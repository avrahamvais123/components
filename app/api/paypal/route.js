import { NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.PAYPAL_ENVIRONMENT === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Import the product catalog
import { calculateCartTotal } from '../products/route.js';

// Calculate total amount based on cart items (server-side validation)
async function calculateOrderTotal(cartItems, shippingCost = 0, tax = 0, discount = 0) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('עגלת קניות ריקה או לא תקינה');
  }

  // חישוב סכום על בסיס מחירי השרת בלבד
  const cartCalculation = calculateCartTotal(cartItems);
  
  const subtotal = cartCalculation.subtotal;
  const total = subtotal + shippingCost + tax - discount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost: Math.round(shippingCost * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    items: cartCalculation.items,
  };
}

// Create PayPal order
export async function POST(request) {
  try {
    const { cartItems, currency = 'USD', shippingCost = 0, tax = 0, discount = 0 } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    // חישוב הסכום בצד השרת (לא סומכים על הקליינט!)
    const calculatedAmounts = calculateOrderTotal(cartItems, shippingCost, tax, discount);

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: calculatedAmounts.total.toString(),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: calculatedAmounts.subtotal.toString(),
              },
              shipping: {
                currency_code: currency,
                value: calculatedAmounts.shippingCost.toString(),
              },
              tax_total: {
                currency_code: currency,
                value: calculatedAmounts.tax.toString(),
              },
              discount: {
                currency_code: currency,
                value: calculatedAmounts.discount.toString(),
              },
            },
          },
          items: calculatedAmounts.items.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: currency,
              value: item.price.toString(),
            },
            quantity: item.quantity.toString(),
            sku: item.id,
          })),
        },
      ],
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (response.ok) {
      return NextResponse.json({ 
        orderID: order.id,
        calculatedTotal: calculatedAmounts.total,
        breakdown: calculatedAmounts 
      });
    } else {
      console.error('PayPal order creation error:', order);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }
  } catch (error) {
    console.error('PayPal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Capture PayPal order
export async function PATCH(request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();

    if (response.ok) {
      return NextResponse.json(captureData);
    } else {
      console.error('PayPal capture error:', captureData);
      return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}