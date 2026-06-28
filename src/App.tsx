import { useRef } from "react";
import "./App.css";
import MainContent from "./components/layout/MainContent";
import Sidebar from "./components/layout/Sidebar";
import { usePageNavigation } from "./hooks/usePageNavigation";
import {
  useContentList,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
} from "./hooks/useContent";
import { useModal } from "./hooks/useModal";
import { useToast } from "./hooks/useToast";
import ConfirmDialog from "./components/ui/ConfirmDialog";

export default function App() {
  const { data: contentList, isLoading, error } = useContentList();
  const { mutate: createContent } = useCreateContent();
  const { mutate: updateContent } = useUpdateContent();
  const { mutate: deleteContent } = useDeleteContent();
  const { open, close } = useModal();
  const { toast } = useToast();
  const isDirtyRef = useRef(false);

  const onBeforeLeaveEdit = (proceed: () => void) => {
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

  const {
    activeId,
    page,
    cancelContentEditRef,
    handleSelect,
    handleContentEditStart,
    handleContentEditEnd,
    sidebarProps,
  } = usePageNavigation(contentList ?? [], onBeforeLeaveEdit);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSave = ({ title, body }: { title: string; body: string }) => {
    updateContent({ id: activeId, input: { title, body } });
  };

  const handleAdd = () => {
    createContent(
      { title: "新しいページ", body: "ここに本文を入力してください" },
      { onSuccess: (data) => handleSelect(data.id) },
    );
  };

  const handleDeleteRequest = (id: string) => {
    if (contentList && contentList.length <= 1) {
      toast({ message: "最後のページは削除できません", type: "error" });
      return;
    }
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

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar
        activeId={activeId}
        onSelect={handleSelect}
        onDelete={handleDeleteRequest}
        onAdd={handleAdd}
        {...sidebarProps}
      />
      <MainContent
        pageId={activeId}
        page={page}
        onSave={handleSave}
        onAdd={handleAdd}
        onBeforeSwitchField={onBeforeLeaveEdit}
        cancelRef={cancelContentEditRef}
        isDirtyRef={isDirtyRef}
        onEditStart={handleContentEditStart}
        onEditEnd={handleContentEditEnd}
      />
    </div>
  );
}
