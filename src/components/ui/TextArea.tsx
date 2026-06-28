import { cn } from "../../lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
};

export default function TextArea({
  value,
  onChange,
  className,
  autoFocus = false,
}: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      className={cn(
        "w-full h-full min-h-0 leading-normal text-[#333] border border-transparent outline-none resize-none text-body focus:border-[#4CB3F8]",
        className,
      )}
    />
  );
}
