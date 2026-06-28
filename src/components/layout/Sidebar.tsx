import { useContentList } from "../../hooks/useContent";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type Props = {
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
  showSelection: boolean;
  isSaving?: boolean;
};

export default function Sidebar({
  activeId,
  onSelect,
  onDelete,
  onAdd,
  isEditMode,
  onEditModeChange,
  showSelection,
  isSaving,
}: Props) {
  const {
    data: contentList,
    isLoading: isContentListLoading,
    isError: isContentListError,
  } = useContentList();

  if (isContentListLoading) {
    return <div>Loading...</div>;
  }

  if (isContentListError) {
    return <div>Error: {isContentListError.toString()}</div>;
  }

  const navGroups = contentList?.map((content) => ({
    items: [{ id: content.id, label: content.title }],
  }));

  return (
    <aside
      className="sticky top-0 h-screen flex flex-col shrink-0 w-72"
      style={{
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-10 pb-5 pt-[30px]">
        <div className="flex items-center gap-2">
          <Icon name="logo" size={32} />
          <span className="text-heading leading-none">ServiceName</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pl-10 flex flex-col">
        {navGroups?.map((group) => (
          <div key={group.items[0]?.id} className="flex flex-col gap-0.5">
            <ul className="list-none p-0 m-0 flex flex-col">
              {group.items.map((item) => {
                const isActive = showSelection && item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "nav-active-bar w-full flex items-center gap-2.5 pl-2 pr-[10px] text-base text-left leading-[44px] transition-all duration-150 relative cursor-pointer border-0",
                        isActive &&
                          "text-(--text-active-color) bg-(--text-active-bg) font-bold rounded-[4px]",
                      )}
                    >
                      <span className="flex-1 truncate max-w-[calc(100%-40px)]">
                        {item.label}
                      </span>
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="flex items-center hover:bg-[#E6E6E6] active:bg-[#CCCCCC] disabled:opacity-40 transition-opacity cursor-pointer rounded-sm p-1"
                        >
                          <Icon name="delete" size={20} />
                        </button>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div
        className={cn(
          "p-[10px] bg-(--text-active-bg) flex justify-end pl-10",
          isEditMode && "justify-between",
        )}
      >
        {isEditMode && (
          <Button
            icon="add"
            label="New Page"
            size="m"
            variant="secondary"
            onClick={onAdd}
            disabled={isSaving}
          />
        )}
        <Button
          icon={isEditMode ? "done" : "edit"}
          label={isEditMode ? "Done" : "Edit"}
          size="m"
          variant="primary"
          onClick={() => onEditModeChange(!isEditMode)}
          disabled={isSaving}
        />
      </div>
    </aside>
  );
}
