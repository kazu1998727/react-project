import { useEffect, type RefObject } from "react";
import { useArticleEditor } from "../../hooks/useArticleEditor";
import EditableBody from "./EditableBody";
import EditableTitle from "./EditableTitle";

type Props = {
  title: string;
  body: string;
  onSave: (draft: { title: string; body: string }) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onBeforeSwitchField?: (proceed: () => void) => void;
  cancelRef?: RefObject<(() => void) | null>;
  isDirtyRef?: RefObject<boolean>;
};

export default function ArticlePanel({
  title,
  body,
  onSave,
  onEditStart,
  onEditEnd,
  onBeforeSwitchField,
  cancelRef,
  isDirtyRef,
}: Props) {
  const editor = useArticleEditor(title, body, onSave, {
    onEditStart,
    onEditEnd,
    onBeforeSwitchField,
  });

  useEffect(() => {
    if (!cancelRef) return;
    cancelRef.current = editor.cancel;
    return () => {
      cancelRef.current = null;
    };
  }, [cancelRef, editor.cancel]);

  useEffect(() => {
    if (!isDirtyRef) return;
    isDirtyRef.current = editor.isDirty;
  }, [isDirtyRef, editor.isDirty]);

  return (
    <article className="flex-1 min-h-0 flex flex-col gap-5 w-full p-4 md:p-[30px] box-border bg-(--text-active-bg) rounded-2xl mt-4 md:mt-[30px] overflow-hidden">
      <EditableTitle
        value={editor.draft.title}
        isEditing={editor.isEditingTitle}
        onStartEdit={() => editor.startEdit("title")}
        onChange={(value) => editor.updateDraft("title", value)}
        onSave={editor.save}
        onCancel={editor.cancel}
        error={editor.errors.title}
      />
      <EditableBody
        value={editor.draft.body}
        isEditing={editor.isEditingBody}
        onStartEdit={() => editor.startEdit("body")}
        onChange={(value) => editor.updateDraft("body", value)}
        onSave={editor.save}
        onCancel={editor.cancel}
        error={editor.errors.body}
      />
    </article>
  );
}
