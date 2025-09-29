"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(() => 
    `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* הודעת הצלחה ראשית */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            ההזמנה בוצעה בהצלחה!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-gray-600 mb-4"
          >
            תודה על הרכישה שלך
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Badge variant="secondary" className="text-lg px-4 py-2">
              מספר הזמנה: {orderNumber}
            </Badge>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* פרטי ההזמנה */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                פרטי ההזמנה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">מספר הזמנה:</span>
                <span className="font-mono text-sm">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">תאריך הזמנה:</span>
                <span>{new Date().toLocaleDateString('he-IL')}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">סטטוס:</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  אושרה
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">זמן משלוח משוער:</span>
                <span className="text-blue-600 font-medium">3-5 ימי עסקים</span>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* מה הלאה? */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                מה הלאה?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">אימייל אישור</h4>
                  <p className="text-sm text-blue-700">נשלח אליך אימייל עם פרטי ההזמנה ומספר המעקב</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                <Package className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">הכנת ההזמנה</h4>
                  <p className="text-sm text-orange-700">ההזמנה תוכן ותשלח תוך 1-2 ימי עסקים</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">משלוח</h4>
                  <p className="text-sm text-green-700">תקבל הודעה כשההזמנה תצא למשלוח</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* מידע נוסף */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>מידע חשוב</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">מעקב אחר ההזמנה</h4>
                <p className="text-sm text-gray-600 mb-3">
                  תוכל לעקוב אחר ההזמנה שלך באמצעות מספר ההזמנה או דרך האיזור האישי שלך.
                </p>
                <Button variant="outline" size="sm">
                  מעקב הזמנה
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-gray-900">שירות לקוחות</h4>
                <p className="text-sm text-gray-600 mb-3">
                  יש לך שאלות? צרו קשר איתנו בטלפון 03-1234567 או באימייל support@store.com
                </p>
                <Button variant="outline" size="sm">
                  צור קשר
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* כפתורי פעולה */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={() => router.push("/products")}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            המשך קנייה
          </Button>
          
          <Button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            חזור לדף הבית
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>

        {/* תודה אישית */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold mb-2">תודה על האמון בנו! 🎉</h3>
            <p className="text-blue-100 mb-4">
              אנו מתחייבים לספק לך את הטוב ביותר ולהביא את ההזמנה שלך במהירות ובבטחה.
            </p>
            <p className="text-sm text-blue-200">
              חווית קנייה נעימה היא בראש סדר העדיפויות שלנו!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}