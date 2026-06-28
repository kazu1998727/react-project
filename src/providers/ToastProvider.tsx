import { useCallback, useRef, useState, type ReactNode } from "react";
import ToastList, { type ToastItem } from "../components/ui/Toast";
import { ToastContext } from "./toastContext";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      message,
      type = "info",
      duration = 3000,
    }: {
      message: string;
      type?: ToastItem["type"];
      duration?: number;
    }) => {
      const id = String(counterRef.current++);
      setItems((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastList items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
