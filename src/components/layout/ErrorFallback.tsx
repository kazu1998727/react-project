import type { FallbackProps } from "react-error-boundary";
import { useToast } from "../../hooks/useToast";
import { MESSAGES } from "../../lib/messages";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { toast } = useToast();

  const handleRetry = () => {
    toast({ message: MESSAGES.retry, type: "success" });
    resetErrorBoundary();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <p className="text-center">
        エラーが発生しました:{" "}
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button onClick={handleRetry}>再試行</button>
    </div>
  );
}
