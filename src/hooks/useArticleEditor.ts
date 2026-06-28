import { useCallback, useEffect, useRef, useState } from "react";

export type EditingField = "title" | "body" | null;

type Draft = {
  title: string;
  body: string;
};

type Options = {
  onEditStart?: () => void;
  onEditEnd?: () => void;
};

export function useArticleEditor(
  title: string,
  body: string,
  onSave: (draft: Draft) => void,
  options?: Options,
) {
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [draft, setDraft] = useState<Draft>({ title, body });
  const onEditStartRef = useRef(options?.onEditStart);
  const onEditEndRef = useRef(options?.onEditEnd);

  useEffect(() => {
    onEditStartRef.current = options?.onEditStart;
    onEditEndRef.current = options?.onEditEnd;
  });

  const startEdit = useCallback(
    (field: Exclude<EditingField, null>) => {
      setDraft({ title, body });
      setEditingField(field);
      onEditStartRef.current?.();
    },
    [title, body],
  );

  const updateDraft = (field: Exclude<EditingField, null>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const save = () => {
    setDraft((currentDraft) => {
      onSave(currentDraft);
      return currentDraft;
    });
    setEditingField(null);
    onEditEndRef.current?.();
  };

  const cancel = useCallback(() => {
    setDraft({ title, body });
    setEditingField(null);
    onEditEndRef.current?.();
  }, [title, body]);

  return {
    editingField,
    draft,
    startEdit,
    updateDraft,
    save,
    cancel,
    isEditingTitle: editingField === "title",
    isEditingBody: editingField === "body",
  };
}
