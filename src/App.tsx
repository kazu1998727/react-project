import { useRef } from "react";
import { cn } from "./lib/utils";
import "./App.css";
import MainContent from "./components/layout/MainContent";
import Sidebar from "./components/layout/Sidebar";
import { usePageNavigation } from "./hooks/usePageNavigation";
import {
  useContentList,
  useCreateContent,
  useUpdateContent,
} from "./hooks/useContent";
import { useDeleteConfirm } from "./hooks/useDeleteConfirm";
import { useUnsavedGuard } from "./hooks/useUnsavedGuard";
import { useSidebarState } from "./hooks/useSidebarState";

export default function App() {
  const { data: contentList, isLoading, error } = useContentList();
  const { mutate: createContent } = useCreateContent();
  const { mutate: updateContent } = useUpdateContent();
  const isDirtyRef = useRef(false);
  const handleDeleteRequest = useDeleteConfirm(contentList);
  const onBeforeLeaveEdit = useUnsavedGuard(isDirtyRef);

  const {
    activeId,
    page,
    cancelContentEditRef,
    handleSelect,
    handleContentEditStart,
    handleContentEditEnd,
    sidebarProps,
  } = usePageNavigation(contentList ?? [], onBeforeLeaveEdit);

  const { sidebarOpen, openSidebar, closeSidebar, selectAndClose } =
    useSidebarState(handleSelect);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSave = ({ title, body }: { title: string; body: string }) => {
    updateContent({ id: activeId, input: { title, body } });
  };

  const handleAdd = () => {
    createContent(
      { title: "新しいページ", body: "ここに本文を入力してください" },
      {
        onSuccess: (data) => {
          handleSelect(data.id);
          closeSidebar();
        },
      },
    );
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-10"
          onClick={closeSidebar}
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 transition-transform duration-300 md:relative md:translate-x-0 md:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          activeId={activeId}
          onSelect={selectAndClose}
          onDelete={handleDeleteRequest}
          onAdd={handleAdd}
          {...sidebarProps}
        />
      </div>
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
        onOpenSidebar={openSidebar}
      />
    </div>
  );
}
