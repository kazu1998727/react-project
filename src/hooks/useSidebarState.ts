import { useState } from "react";

export function useSidebarState(onSelect: (id: string) => void) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const selectAndClose = (id: string) => {
    onSelect(id);
    setSidebarOpen(false);
  };

  return { sidebarOpen, openSidebar, closeSidebar, selectAndClose };
}
