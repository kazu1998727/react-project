import { useRef, useState } from "react";

export type Page = {
  id: string;
  title: string;
  body: string;
};

export function usePageNavigation(pages: Record<string, Page>) {
  const [activeId, setActiveId] = useState<string>("");
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [hideSidebarSelection, setHideSidebarSelection] = useState(false);
  const cancelContentEditRef = useRef<(() => void) | null>(null);

  // ユーザーが選択した activeId が存在しない（ロード前など）はフォールバック
  const effectiveActiveId = pages[activeId]
    ? activeId
    : (Object.keys(pages)[0] ?? "");
  const page = pages[effectiveActiveId];

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
    activeId: effectiveActiveId,
    page,
    cancelContentEditRef,
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
