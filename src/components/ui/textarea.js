import React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-600",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
