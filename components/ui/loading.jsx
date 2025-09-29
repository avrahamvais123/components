import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <Loader2 
      className={cn("animate-spin", sizeClasses[size], className)} 
      {...props} 
    />
  );
}

export function LoadingButton({ children, loading, disabled, className, ...props }) {
  return (
    <button 
      disabled={loading || disabled}
      className={cn(
        "relative inline-flex items-center justify-center",
        loading && "cursor-not-allowed opacity-70",
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={cn(loading && "opacity-0")}>
        {children}
      </span>
    </button>
  );
}