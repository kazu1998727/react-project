import { createContext } from "react";
import type { ToastItem } from "../components/ui/Toast";

type ToastConfig = {
  message: string;
  type?: ToastItem["type"];
  duration?: number;
};

export type ToastContextValue = {
  toast: (config: ToastConfig) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
