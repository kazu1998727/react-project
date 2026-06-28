import { useRef, useState } from "react";

export type Page = {
  id: string;
  title: string;
  body: string;
};

export function usePageNavigation(
  pages: Page[],
  onBeforeLeaveEdit?: (proceed: () => void) => void,
) {
  const [activeId, setActiveId] = useState<string>("");
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [hideSidebarSelection, setHideSidebarSelection] = useState(false);
  const cancelContentEditRef = useRef<(() => void) | null>(null);

  // ユーザーが選択した activeId が存在しない（ロード前など）はフォールバック
  const effectiveActiveId = pages.some((p) => p.id === activeId)
    ? activeId
    : (pages[0]?.id ?? "");
  const page = pages.find((p) => p.id === effectiveActiveId);

  const handleSelect = (id: string) => {
    if (isContentEditing) {
      const proceed = () => {
        cancelContentEditRef.current?.();
        setHideSidebarSelection(false);
        setActiveId(id);
      };
      if (onBeforeLeaveEdit) {
        onBeforeLeaveEdit(proceed);
      } else {
        proceed();
      }
      return;
    }
    setHideSidebarSelection(false);
    setActiveId(id);
  };

  const handleSidebarEditModeChange = (value: boolean) => {
    if (value && isContentEditing) {
      const proceed = () => {
        cancelContentEditRef.current?.();
        setHideSidebarSelection(true);
        setIsSidebarEditMode(true);
      };
      if (onBeforeLeaveEdit) {
        onBeforeLeaveEdit(proceed);
      } else {
        proceed();
      }
      return;
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
