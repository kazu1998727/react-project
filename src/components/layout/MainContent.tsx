import type { RefObject } from "react";
import ArticlePanel from "../content/ArticlePanel";
import Footer from "./Footer";
import Button from "../ui/Button";

type Page = {
  title: string;
  body: string;
};

type Props = {
  pageId: string;
  page?: Page;
  onSave: (draft: Page) => void;
  onAdd?: () => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onBeforeSwitchField?: (proceed: () => void) => void;
  cancelRef?: RefObject<(() => void) | null>;
  isDirtyRef?: RefObject<boolean>;
};

export default function MainContent({
  pageId,
  page,
  onSave,
  onAdd,
  onEditStart,
  onEditEnd,
  onBeforeSwitchField,
  cancelRef,
  isDirtyRef,
}: Props) {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden px-10">
      {page ? (
        <ArticlePanel
          key={pageId}
          title={page.title}
          body={page.body}
          onSave={onSave}
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
