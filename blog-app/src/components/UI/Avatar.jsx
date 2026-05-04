import React from "react";

export default function Avatar({ src, alt = "User", size = "md", fallback }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-28 h-28 text-3xl border-4"
  };

  const baseClass = "rounded-full object-cover border-2 border-white shadow-sm";
  const sizeClass = sizes[size] || sizes.md;

  if (!src) {
    return (
      <div className={`${baseClass} ${sizeClass} bg-brand-50 text-brand-600 flex items-center justify-center font-display font-semibold`}>
        {fallback ? fallback.slice(0, 2).toUpperCase() : "??"}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${baseClass} ${sizeClass} hover:border-brand-200 transition-colors duration-200`} 
      loading="lazy"
    />
  );
}
