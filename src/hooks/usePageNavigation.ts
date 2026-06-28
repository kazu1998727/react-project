import { useRef, useState } from "react";

export type Page = {
  title: string;
  body: string;
};

export function usePageNavigation(initialPages: Record<string, Page>) {
  const [activeId, setActiveId] = useState<string>("1");
  const [pages, setPages] = useState(initialPages);
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [hideSidebarSelection, setHideSidebarSelection] = useState(false);
  const cancelContentEditRef = useRef<(() => void) | null>(null);

  const page = pages[activeId];
  if (!page) {
    throw new Error(`Page not found: ${activeId}`);
  }

  const handleSave = (draft: Page) => {
    setPages((prev) => ({ ...prev, [activeId]: draft }));
  };

  const handleSelect = (id: string) => {
    if (isContentEditing) {
      cancelContentEditRef.current?.();
    }
    setHideSidebarSelection(false);
    setActiveId(id);
  };

  const handleSidebarEditModeChange = (value: boolean) => {
    if (value && isContentEditing) {
      cancelContentEditRef.current?.();
      setHideSidebarSelection(true);
    }
    if (!value) {
      setHideSidebarSelection(false);
    }
    setIsSidebarEditMode(value);
  };

  const handleContentEditStart = () => {
    setIsSidebarEditMode(false);
    setIsContentEditing(true);
  };

  const handleContentEditEnd = () => {
    setIsContentEditing(false);
    setHideSidebarSelection(false);
  };

  return {
    activeId,
    page,
    pages,
    cancelContentEditRef,
    handleSave,
    handleSelect,
    handleContentEditStart,
    handleContentEditEnd,
    sidebarProps: {
      isEditMode: isSidebarEditMode,
      onEditModeChange: handleSidebarEditModeChange,
      showSelection: !isContentEditing && !hideSidebarSelection,
    },
  };
}
