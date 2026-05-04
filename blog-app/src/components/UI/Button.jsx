import React from "react";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-sm hover:shadow-brand-500/30 hover:-translate-y-0.5",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500",
    ghost: "text-slate-600 hover:text-brand-600 hover:bg-brand-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
