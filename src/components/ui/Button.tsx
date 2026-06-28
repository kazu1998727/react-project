import { cn } from "../../lib/utils";
import Icon from "./Icon";
import type { IconName } from "./Icon";

type Size = "s" | "m" | "l";
type Variant = "primary" | "secondary" | "muted";

type Props = {
  icon: IconName;
  label?: string;
  size?: Size;
  variant?: Variant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const sizeStyles: Record<Size, { button: string }> = {
  s: { button: "px-0.75 py-0.75 min-w-[40px]" },
  m: { button: "px-0.75 py-0.75 min-w-[90px]" },
  l: { button: "px-0.75 py-0.75 min-w-[90px]" },
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#4CB3F8] text-white hover:bg-[#3C8EC4] active:bg-[#347CAB] disabled:bg-[#4CB3F8]",
  secondary:
    "bg-white text-[#4CB3F8] border border-[#4CB3F8] hover:bg-[#CCCCCC] active:bg-[#B3B3B3] disabled:opacity-40",
  muted:
    "bg-[#B3B3B3] text-white hover:bg-[#999999] active:bg-[#808080] disabled:bg-[#B3B3B3]",
};

export default function Button({
  icon,
  label,
  size = "m",
  variant = "primary",
  onClick,
  disabled = false,
  className,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-sm transition-all duration-150 cursor-pointer border-0 w-fit",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size].button,
        className,
      )}
    >
      <Icon name={icon} size={24} />
      {label && <span className={cn("text-[10px] leading-none")}>{label}</span>}
    </button>
  );
}
