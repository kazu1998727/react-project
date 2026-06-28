import { useMemo } from "react";
import "./App.css";
import MainContent from "./components/layout/MainContent";
import Sidebar from "./components/layout/Sidebar";
import { usePageNavigation, type Page } from "./hooks/usePageNavigation";
import { useContentList, useUpdateContent } from "./hooks/useContent";

export default function App() {
  const { data: contentList, isLoading, error } = useContentList();
  const { mutate: updateContent } = useUpdateContent();

  const pages = useMemo<Record<string, Page>>(() => {
    if (!contentList) return {};
    return Object.fromEntries(contentList.map((c) => [c.id, c]));
  }, [contentList]);

  const {
    activeId,
    page,
    cancelContentEditRef,
    handleSelect,
    handleContentEditStart,
    handleContentEditEnd,
    sidebarProps,
  } = usePageNavigation(pages);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!page) return null;

  const handleSave = ({ title, body }: { title: string; body: string }) => {
    updateContent({ id: activeId, input: { title, body } });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar activeId={activeId} onSelect={handleSelect} {...sidebarProps} />
      <MainContent
        pageId={activeId}
        page={page}
        onSave={handleSave}
        cancelRef={cancelContentEditRef}
        onEditStart={handleContentEditStart}
        onEditEnd={handleContentEditEnd}
      />
    </div>
  );
}
