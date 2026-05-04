import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: "bg-teal-50 text-teal-800 border-teal-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200"
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300 ${styles[type]}`}>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}
