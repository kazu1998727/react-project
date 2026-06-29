import { Suspense, type RefObject } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useContent } from "../../hooks/useContent";
import { useToast } from "../../hooks/useToast";
import { MESSAGES } from "../../lib/messages";
import ArticlePanel from "./ArticlePanel";
import Spinner from "../ui/Spinner";

type Props = {
  pageId: string;
  onSave: (draft: { title: string; body: string }) => void;
  isSaving?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onBeforeSwitchField?: (proceed: () => void) => void;
  cancelRef?: RefObject<(() => void) | null>;
  isDirtyRef?: RefObject<boolean>;
};

function ContentDetailInner({
  pageId,
  onSave,
  isSaving,
  onEditStart,
  onEditEnd,
  onBeforeSwitchField,
  cancelRef,
  isDirtyRef,
}: Props) {
  const { data: page } = useContent(pageId);
  return (
    <ArticlePanel
      key={pageId}
      title={page.title}
      body={page.body}
      onSave={onSave}
      isSaving={isSaving}
      onEditStart={onEditStart}
      onEditEnd={onEditEnd}
      onBeforeSwitchField={onBeforeSwitchField}
      cancelRef={cancelRef}
      isDirtyRef={isDirtyRef}
    />
  );
}

function DetailErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { toast } = useToast();

  const handleRetry = () => {
    toast({ message: MESSAGES.retry, type: "success" });
    resetErrorBoundary();
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4">
      <p className="text-center">
        コンテンツの読み込みに失敗しました:{" "}
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button onClick={handleRetry}>再試行</button>
    </div>
  );
}

export default function ContentDetail(props: Props) {
  return (
    <ErrorBoundary FallbackComponent={DetailErrorFallback}>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <ContentDetailInner {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
