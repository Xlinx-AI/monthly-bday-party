import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "liquid";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-bold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-2xl transform hover:scale-105";

    const variantClasses = {
      primary:
        "btn-liquid text-white shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-600/60",
      secondary:
        "glass-effect text-white hover:bg-white/10 border border-white/20",
      outline:
        "border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white focus:ring-purple-400",
      danger:
        "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/50",
      liquid:
        "liquid-gradient text-white shadow-2xl hover:shadow-purple-500/50",
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const glowClass = glow ? "glow" : "";

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          glowClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
