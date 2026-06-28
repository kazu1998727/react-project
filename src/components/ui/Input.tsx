import { cn } from "../../lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
};

export default function Input({
  value,
  onChange,
  className,
  autoFocus = false,
}: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      className={cn(
        "w-full font-bold leading-[40px] text-[#333] bg-white border border-transparent rounded-[8px] px-3 outline-none text-heading focus:border-[#4CB3F8]",
        className,
      )}
    />
  );
}
