import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

export type ToastItem = {
  id: string;
  message: string;
  type: "info" | "success" | "error";
};

type Props = {
  items: ToastItem[];
  onDismiss: (id: string) => void;
};

const typeStyles: Record<ToastItem["type"], string> = {
  info: "bg-gray-700",
  success: "bg-green-500",
  error: "bg-red-500",
};

export default function ToastList({ items, onDismiss }: Props) {
  if (items.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onDismiss(item.id)}
          className={cn(
            "px-4 py-3 rounded-lg shadow-lg text-sm text-white cursor-pointer select-none",
            "animate-in fade-in slide-in-from-bottom-2 duration-200",
            typeStyles[item.type],
          )}
        >
          {item.message}
        </div>
      ))}
    </div>,
    document.body,
  );
}
