type Props = {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  message,
  confirmLabel = "削除",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-body leading-body">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded border border-[#4CB3F8] text-[#4CB3F8] text-sm hover:opacity-80 cursor-pointer"
        >
          キャンセル
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-500 text-white text-sm hover:opacity-80 cursor-pointer"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
