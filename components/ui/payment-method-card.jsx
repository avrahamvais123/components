import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PaymentMethodCard({ 
  value, 
  title, 
  description, 
  icon: Icon, 
  isSelected, 
  onClick,
  className,
  ...props 
}) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-2",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border hover:border-primary/50 hover:shadow-sm",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{title}</h4>
            {isSelected && (
              <Badge className="bg-primary text-primary-foreground">נבחר</Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className={cn(
          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
          isSelected 
            ? "border-primary bg-primary" 
            : "border-muted-foreground"
        )}>
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}