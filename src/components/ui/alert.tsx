import React from "react";
import { AlertTriangle, Check } from "lucide-react";

interface BaseAlertProps {
  type?: "success" | "error" | "warning" | "info";
  className?: string;
}

interface AlertProps extends BaseAlertProps {
  message: string;
}

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BaseAlertProps>(
  ({ children, type = "info", className = "", ...props }, ref) => {
    let icon;
    let bgColor;
    let textColor;

    switch (type) {
      case "success":
        icon = <Check className="w-6 h-6 text-green-500" />;
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        break;
      case "error":
        icon = <AlertTriangle className="w-6 h-6 text-red-500" />;
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;
      case "warning":
        icon = <AlertTriangle className="w-6 h-6 text-yellow-500" />;
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        break;
      case "info":
      default:
        icon = <AlertTriangle className="w-6 h-6 text-blue-500" />;
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        break;
    }

    return (
      <div 
        ref={ref}
        className={`flex items-start p-4 ${bgColor} rounded-lg ${className}`} 
        role="alert"
        {...props}
      >
        {icon}
        <div className="ml-3">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", children, ...props }, ref) => (
  <h5
    ref={ref}
    className={`font-medium mb-1 ${className}`}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm ${className}`}
    {...props}
  >
    {children}
  </div>
));
AlertDescription.displayName = "AlertDescription";

// Legacy support for the old API
const LegacyAlert: React.FC<AlertProps> = ({ type = "info", message }) => (
  <Alert type={type}>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export { Alert, AlertTitle, AlertDescription };
export default LegacyAlert; // For backward compatibility