import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, ...props }, ref) => {
    // We need an ID for the label to associate with the input.
    // If no ID is provided, we'll need to generate one or rely on the user providing it.
    // For this component to work best, an ID is recommended.
    
    return (
      <div className="relative group">
        <Input
          id={id}
          className={cn(
            "peer pt-6 pb-2 px-4 h-14 bg-white/50 backdrop-blur-sm border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 placeholder:text-transparent rounded-xl hover:bg-white/80 hover:border-primary/30 shadow-sm hover:shadow-md",
            className
          )}
          placeholder={label} // Placeholder required for :placeholder-shown pseudo-class
          ref={ref}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary font-medium pointer-events-none"
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
