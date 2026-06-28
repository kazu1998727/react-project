import { useState } from "react";

export type EditingField = "title" | "body" | null;

type Draft = {
  title: string;
  body: string;
};

export function useArticleEditor(
  title: string,
  body: string,
  onSave: (draft: Draft) => void,
) {
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [draft, setDraft] = useState<Draft>({ title, body });

  const startEdit = (field: Exclude<EditingField, null>) => {
    setDraft({ title, body });
    setEditingField(field);
  };

  const updateDraft = (field: Exclude<EditingField, null>, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const save = () => {
    onSave(draft);
    setEditingField(null);
  };

  const cancel = () => {
    setDraft({ title, body });
    setEditingField(null);
  };

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
