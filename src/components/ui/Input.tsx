import { cn } from "../../lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  error?: string;
};

export default function Input({
  value,
  onChange,
  className,
  autoFocus = false,
  error,
}: Props) {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={cn(
          "w-full font-bold leading-[40px] text-(--text) bg-white border border-transparent rounded-[8px] px-3 outline-none text-heading focus:border-(--color-action)",
          className,
          error && "border-red-500",
        )}
      />
      {error && (
        <p className="text-caption leading-none text-red-500 pl-1">{error}</p>
      )}
    </>
  );
}
