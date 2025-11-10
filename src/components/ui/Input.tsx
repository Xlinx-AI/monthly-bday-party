import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="flex flex-col gap-2 text-sm font-semibold text-gray-200">
        {label && (
          <span className="text-gray-300">
            {label}
            {props.required ? " *" : ""}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "glass-effect w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all",
            error ? "border-red-400/60 focus:border-red-500 focus:ring-red-500/50" : "",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-normal text-red-400">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
