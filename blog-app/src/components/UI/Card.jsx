import React from "react";

export default function Card({ children, className = "", hoverable = false }) {
  const hoverStyles = hoverable 
    ? "hover:-translate-y-1 hover:shadow-soft hover:border-brand-200 transition-all duration-300 cursor-pointer" 
    : "";

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
