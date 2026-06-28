import { useState, type ReactNode } from "react";
import Modal from "../components/ui/Modal";
import { ModalContext } from "./modalContext";

export function ModalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<{
    title?: string;
    content: ReactNode;
  } | null>(null);

  const open = (cfg: { title?: string; content: ReactNode }) => setConfig(cfg);
  const close = () => setConfig(null);

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
