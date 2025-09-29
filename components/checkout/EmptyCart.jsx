import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function EmptyCart({ onReturnToProducts }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle>העגלה ריקה</CardTitle>
          <CardDescription>
            לא נמצאו מוצרים בעגלה. אנא הוסף מוצרים לפני שתמשיך לתשלום.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            onClick={onReturnToProducts} 
            className="w-full"
          >
            חזור למוצרים
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}