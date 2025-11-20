"use client";

import * as React from "react";
// import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "simple";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({variant = "primary", className = "", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center py-3 px-6 rounded-lg font-semibold shadow transition-all duration-200";

    const variants = {
      primary:
        "bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm",
      secondary:
        "bg-gray-800 text-white hover:bg-gray-700",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        simple: "bg-transparent border-none text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
