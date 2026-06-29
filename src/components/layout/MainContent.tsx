import type { RefObject } from "react";
import ContentDetail from "../content/ContentDetail";
import Footer from "./Footer";
import Button from "../ui/Button";

type Props = {
  pageId: string;
  onSave: (draft: { title: string; body: string }) => void;
  onAdd?: () => void;
  isSaving?: boolean;
  onOpenSidebar?: () => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onBeforeSwitchField?: (proceed: () => void) => void;
  cancelRef?: RefObject<(() => void) | null>;
  isDirtyRef?: RefObject<boolean>;
};

export default function MainContent({
  pageId,
  onSave,
  onAdd,
  isSaving,
  onOpenSidebar,
  onEditStart,
  onEditEnd,
  onBeforeSwitchField,
  cancelRef,
  isDirtyRef,
}: Props) {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden px-4 md:px-10">
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          aria-label="メニューを開く"
          className="md:hidden self-start mt-4 p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
      {pageId ? (
        <ContentDetail
          pageId={pageId}
          onSave={onSave}
          isSaving={isSaving}
          onEditStart={onEditStart}
          onEditEnd={onEditEnd}
          onBeforeSwitchField={onBeforeSwitchField}
          cancelRef={cancelRef}
          isDirtyRef={isDirtyRef}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-heading opacity-40">ページがありません</p>
          {onAdd && (
            <Button
              icon="add"
              label="New Page"
              variant="secondary"
              onClick={onAdd}
            />
          )}
        </div>
      )}
      <Footer />
    </main>
  );
}
