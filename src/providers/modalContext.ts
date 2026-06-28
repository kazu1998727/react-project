import { createContext, type ReactNode } from "react";

type ModalConfig = {
  title?: string;
  content: ReactNode;
};

export type ModalContextValue = {
  open: (config: ModalConfig) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);
