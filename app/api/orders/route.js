import { NextResponse } from 'next/server';
import { calculateCartTotal } from '../products/route.js';

// מידע זמני למשתמש - בפרודקשן יהיה מסד נתונים אמיתי
let orders = [];

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // בדיקת תקינות הנתונים
    if (!orderData.paymentDetails || !orderData.cartItems || !Array.isArray(orderData.cartItems)) {
      return NextResponse.json(
        { error: 'נתונים חסרים או לא תקינים' }, 
        { status: 400 }
      );
    }

    if (orderData.cartItems.length === 0) {
      return NextResponse.json(
        { error: 'העגלה ריקה' }, 
        { status: 400 }
      );
    }

    // חישוב הסכום בצד השרת (אבטחה!)
    const serverCalculation = calculateCartTotal(orderData.cartItems);
    const shippingCost = orderData.shippingCost || 0;
    const tax = orderData.tax || 0;
    const discount = orderData.discount || 0;
    const serverTotal = serverCalculation.subtotal + shippingCost + tax - discount;

    // יצירת הזמנה חדשה עם סכומים מחושבים בשרת
    const newOrder = {
      id: generateOrderId(),
      paymentDetails: orderData.paymentDetails,
      paymentMethod: orderData.paymentMethod,
      cartItems: orderData.cartItems,
      serverCalculation: {
        subtotal: serverCalculation.subtotal,
        shippingCost,
        tax,
        discount,
        total: Math.round(serverTotal * 100) / 100,
      },
      currency: orderData.currency || 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timestamp: orderData.timestamp,
    };

    // שמירת ההזמנה (בפרודקשן - במסד נתונים)
    orders.push(newOrder);

    // שליחת אימייל אישור (אופציונלי)
    // await sendOrderConfirmationEmail(newOrder);

    console.log('New order created:', newOrder.id);

    return NextResponse.json({ 
      success: true,
      orderId: newOrder.id,
      message: 'ההזמנה נשמרה בהצלחה'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' }, 
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      // החזרת הזמנה ספציפית
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        return NextResponse.json(
          { error: 'הזמנה לא נמצאה' }, 
          { status: 404 }
        );
      }
      return NextResponse.json(order);
    } else {
      // החזרת כל ההזמנות (למטרות פיתוח בלבד)
      return NextResponse.json({ 
        orders: orders.slice(-10), // 10 הזמנות אחרונות בלבד
        total: orders.length 
      });
    }

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'שגיאה פנימית בשרת' }, 
      { status: 500 }
    );
  }
}

// יצירת מזהה הזמנה ייחודי
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `ORDER-${timestamp}-${random}`.toUpperCase();
}