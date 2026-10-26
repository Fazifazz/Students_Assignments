import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" role="status" aria-live="polite">
          <div className={`shop-toast toast show border-0 text-bg-${toast.type === "error" ? "danger" : "dark"}`}>
            <div className="d-flex align-items-center">
              <div className="toast-body"><i className={`bi ${toast.type === "error" ? "bi-exclamation-circle" : "bi-check-circle"} me-2`}></i>{toast.message}</div>
              <button type="button" className="btn-close btn-close-white me-2" aria-label="Close" onClick={() => setToast(null)}></button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}