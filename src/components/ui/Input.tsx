"use client";

import * as React from "react";
// import { cn } from "@/lib/utils"; // optional if you have a className merge util

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={
            "w-full px-3 py-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-900"
        
          }
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
