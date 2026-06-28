import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import Modal from "../components/ui/Modal";

type ModalConfig = {
  title?: string;
  content: ReactNode;
};

type ModalContextValue = {
  open: (config: ModalConfig) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const open = useCallback((cfg: ModalConfig) => setConfig(cfg), []);
  const close = useCallback(() => setConfig(null), []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {config && (
        <Modal title={config.title} onClose={close}>
          {config.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
