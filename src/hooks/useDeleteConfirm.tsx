import ConfirmDialog from "../components/ui/ConfirmDialog";
import type { Content } from "../apis/content";
import { useDeleteContent } from "./useContent";
import { useModal } from "./useModal";

export function useDeleteConfirm(contentList: Content[] | undefined) {
  const { mutate: deleteContent } = useDeleteContent();
  const { open, close } = useModal();

  return (id: string) => {
    const target = contentList?.find((c) => c.id === id);
    open({
      title: "ページを削除しますか？",
      content: (
        <ConfirmDialog
          message={`「${target?.title}」を削除します。この操作は元に戻せません。`}
          onConfirm={() => {
            deleteContent(id);
            close();
          }}
          onCancel={close}
        />
      ),
    });
  };
}
