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
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        {label && (
          <span className="text-slate-600">
            {label}
            {props.required ? " *" : ""}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-normal text-red-500">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
