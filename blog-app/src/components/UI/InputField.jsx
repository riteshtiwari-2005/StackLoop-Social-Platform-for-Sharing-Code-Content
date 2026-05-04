import React from "react";

export default function InputField({ label, id, type = "text", ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      {type === "textarea" ? (
        <textarea
          id={id}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y min-h-[120px]"
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          {...props}
        />
      )}
    </div>
  );
}
