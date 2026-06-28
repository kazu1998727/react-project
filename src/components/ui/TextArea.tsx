import { cn } from "../../lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  error?: string;
};

export default function TextArea({
  value,
  onChange,
  className,
  autoFocus = false,
  error,
}: Props) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={cn(
          "w-full h-full min-h-0 leading-normal text-(--text) border border-transparent outline-none resize-none text-body focus:border-(--color-action)",
          className,
          error && "border-red-500",
        )}
      />
      {error && (
        <p className="text-caption leading-none text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}
