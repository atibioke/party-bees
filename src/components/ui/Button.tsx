"use client";

import * as React from "react";
// import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({variant = "primary", ...props }, ref) => {
    const base =
      "w-full py-3 px-6 rounded-lg font-semibold shadow transition-all duration-200";

    const variants = {
      primary:
        "bg-gradient-to-r from-yellow-400 to-pink-500 text-white hover:opacity-90",
      secondary:
        "bg-gray-800 text-white hover:bg-gray-700",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    };

    return (
      <button
        ref={ref}
       className={`${base} ${variants[variant]}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
