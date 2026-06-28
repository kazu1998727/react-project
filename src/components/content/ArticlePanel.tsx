import { useArticleEditor } from "../../hooks/useArticleEditor";
import EditableBody from "./EditableBody";
import EditableTitle from "./EditableTitle";

type Props = {
  title: string;
  body: string;
  onSave: (draft: { title: string; body: string }) => void;
};

export default function ArticlePanel({ title, body, onSave }: Props) {
  const editor = useArticleEditor(title, body, onSave);

  return (
    <article className="flex-1 min-h-0 flex flex-col gap-5 w-full p-[30px] box-border bg-(--text-active-bg) rounded-2xl mt-[30px] overflow-hidden">
      <EditableTitle
        value={editor.draft.title}
        isEditing={editor.isEditingTitle}
        onStartEdit={() => editor.startEdit("title")}
        onChange={(value) => editor.updateDraft("title", value)}
        onSave={editor.save}
        onCancel={editor.cancel}
      />
      <EditableBody
        value={editor.draft.body}
        isEditing={editor.isEditingBody}
        onStartEdit={() => editor.startEdit("body")}
        onChange={(value) => editor.updateDraft("body", value)}
        onSave={editor.save}
        onCancel={editor.cancel}
      />
    </article>
  );
}
