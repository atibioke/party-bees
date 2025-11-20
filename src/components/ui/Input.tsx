"use client";

import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 
            text-white placeholder-slate-500 outline-none transition-all duration-200
            focus:bg-slate-900 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10
            ${className || ''}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
