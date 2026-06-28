import { type RefObject } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useModal } from "./useModal";

export function useUnsavedGuard(isDirtyRef: RefObject<boolean>) {
  const { open, close } = useModal();

  return (proceed: () => void) => {
    if (!isDirtyRef.current) {
      proceed();
      return;
    }
    open({
      title: "編集中の変更があります",
      content: (
        <ConfirmDialog
          message="保存されていない変更は失われます。続けますか？"
          confirmLabel="保存しないで続ける"
          onConfirm={() => {
            proceed();
            close();
          }}
          onCancel={close}
        />
      ),
    });
  };
}
