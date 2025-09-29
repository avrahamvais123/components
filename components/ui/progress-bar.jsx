import { CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgressStep({ title, description, status = "pending", index, isLast = false }) {
  const StatusIcon = {
    completed: CheckCircle,
    current: Clock,
    pending: Circle
  }[status];

  const statusColors = {
    completed: "text-green-600 bg-green-100 border-green-300",
    current: "text-blue-600 bg-blue-100 border-blue-300", 
    pending: "text-gray-400 bg-gray-100 border-gray-300"
  };

  const textColors = {
    completed: "text-green-600",
    current: "text-blue-600",
    pending: "text-gray-400"
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
          statusColors[status]
        )}>
          {status === "completed" ? (
            <CheckCircle className="w-4 h-4" />
          ) : status === "current" ? (
            <Clock className="w-4 h-4" />
          ) : (
            <span className="text-sm font-medium">{index}</span>
          )}
        </div>
        
        <div>
          <div className={cn("text-sm font-medium transition-colors", textColors[status])}>
            {title}
          </div>
          {description && (
            <div className="text-xs text-gray-500">{description}</div>
          )}
        </div>
      </div>
      
      {!isLast && (
        <div className={cn(
          "h-0.5 w-12 ml-4 transition-colors",
          status === "completed" ? "bg-green-300" : "bg-gray-300"
        )} />
      )}
    </div>
  );
}

export function ProgressBar({ steps, currentStep = 0 }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step, index) => {
        let status = "pending";
        if (index < currentStep) status = "completed";
        else if (index === currentStep) status = "current";

        return (
          <ProgressStep
            key={index}
            title={step.title}
            description={step.description}
            status={status}
            index={index + 1}
            isLast={index === steps.length - 1}
          />
        );
      })}
    </div>
  );
}