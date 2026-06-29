import { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "./lib/utils";
import "./App.css";
import ErrorFallback from "./components/layout/ErrorFallback";
import Spinner from "./components/ui/Spinner";
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
import { useToast } from "./hooks/useToast";
import { MESSAGES, errorDetail } from "./lib/messages";

function AppContent() {
  const { data: contentList } = useContentList();
  const { mutate: createContent } = useCreateContent();
  const { mutate: updateContent, isPending: isSaving } = useUpdateContent();
  const isDirtyRef = useRef(false);
  const handleDeleteRequest = useDeleteConfirm(contentList);
  const onBeforeLeaveEdit = useUnsavedGuard(isDirtyRef);
  const { toast } = useToast();

  const {
    activeId,
    cancelContentEditRef,
    handleSelect,
    handleContentEditStart,
    handleContentEditEnd,
    sidebarProps,
  } = usePageNavigation(contentList ?? [], onBeforeLeaveEdit);

  const { sidebarOpen, openSidebar, closeSidebar, selectAndClose } =
    useSidebarState(handleSelect);

  const handleSave = ({ title, body }: { title: string; body: string }) => {
    updateContent(
      { id: activeId, input: { title, body } },
      {
        onError: (error) => {
          toast({
            message: MESSAGES.updateError(errorDetail(error)),
            type: "error",
          });
        },
      },
    );
  };

  const handleAdd = () => {
    createContent(
      { title: "新しいページ", body: "ここに本文を入力してください" },
      {
        onSuccess: (data) => {
          handleSelect(data.id);
          closeSidebar();
        },
        onError: (error) => {
          toast({
            message: MESSAGES.createError(errorDetail(error)),
            type: "error",
          });
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
          isSaving={isSaving}
          {...sidebarProps}
        />
      </div>
      <MainContent
        pageId={activeId}
        onSave={handleSave}
        onAdd={handleAdd}
        isSaving={isSaving}
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

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-screen">
            <Spinner size={40} />
          </div>
        }
      >
        <AppContent />
      </Suspense>
    </ErrorBoundary>
  );
}
