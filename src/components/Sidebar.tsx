import logo from "../assets/img/icon/logo.svg";
import { cn } from "../lib/utils";

type NavItem = {
  id: string;
  label: string;
};

type NavGroup = {
  items: NavItem[];
};

type Props = {
  navGroups: NavGroup[];
  activeId: string;
  onSelect: (id: string) => void;
};

export default function Sidebar({ navGroups, activeId, onSelect }: Props) {
  return (
    <aside
      className="sticky top-0 h-screen flex flex-col shrink-0"
      style={{
        borderRight: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-10 pb-5 pt-[30px]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <span className="text-heading leading-none">ServiceName</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pl-10 flex flex-col gap-6">
        {navGroups.map((group) => (
          <div key={group.items[0]?.id} className="flex flex-col gap-0.5">
            <ul className="list-none p-0 m-0 flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "nav-active-bar w-full flex items-center gap-2.5 pl-2 pr-[10px] text-base text-left leading-[44px] transition-all duration-150 relative cursor-pointer border-0",
                        isActive &&
                          "text-[var(--text-active-color)] bg-[var(--text-active-bg)] font-bold rounded-[4px]",
                      )}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all duration-150"
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "var(--code-bg)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{ background: "var(--accent)" }}
          >
            K
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className="text-sm font-medium leading-none"
              style={{ color: "var(--text-h)" }}
            >
              Kazuma
            </span>
            <span
              className="text-xs leading-none"
              style={{ color: "var(--text)", opacity: 0.65 }}
            >
              Developer
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
