import { NextResponse } from 'next/server';

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

    // יצירת הזמנה חדשה
    const newOrder = {
      id: generateOrderId(),
      ...orderData,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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