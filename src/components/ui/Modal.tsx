import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ title, children, onClose }: Props) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
        {title && (
          <h2 className="text-heading font-heading leading-heading mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
