import type { RefObject } from "react";
import ArticlePanel from "../content/ArticlePanel";
import Footer from "./Footer";

type Page = {
  title: string;
  body: string;
};

type Props = {
  pageId: string;
  page: Page;
  onSave: (draft: Page) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  cancelRef?: RefObject<(() => void) | null>;
};

export default function MainContent({
  pageId,
  page,
  onSave,
  onEditStart,
  onEditEnd,
  cancelRef,
}: Props) {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden px-10">
      <ArticlePanel
        key={pageId}
        title={page.title}
        body={page.body}
        onSave={onSave}
        onEditStart={onEditStart}
        onEditEnd={onEditEnd}
        cancelRef={cancelRef}
      />
      <Footer />
    </main>
  );
}
