import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" style={{ position: "fixed", left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            marginBottom: 10,
            minWidth: 220,
            padding: "12px 16px",
            borderRadius: 12,
            color: "#fff",
            background: t.type === "error" ? "#c62828" : "#2e7d32",
            boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
            fontWeight: 700,
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 16 }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
