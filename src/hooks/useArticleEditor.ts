import { useCallback, useEffect, useRef, useState } from "react";

export type EditingField = "title" | "body" | null;

type Draft = {
  title: string;
  body: string;
};

type Options = {
  onEditStart?: () => void;
  onEditEnd?: () => void;
  onBeforeSwitchField?: (proceed: () => void) => void;
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
  const onBeforeSwitchFieldRef = useRef(options?.onBeforeSwitchField);

  useEffect(() => {
    onEditStartRef.current = options?.onEditStart;
    onEditEndRef.current = options?.onEditEnd;
    onBeforeSwitchFieldRef.current = options?.onBeforeSwitchField;
  });

  const startEdit = useCallback(
    (field: Exclude<EditingField, null>) => {
      const doSwitch = () => {
        setDraft({ title, body });
        setEditingField(field);
        onEditStartRef.current?.();
      };
      if (editingField !== null) {
        const dirty = draft.title !== title || draft.body !== body;
        if (dirty) {
          if (onBeforeSwitchFieldRef.current) {
            onBeforeSwitchFieldRef.current(doSwitch);
          } else {
            doSwitch();
          }
          return;
        }
      }
      doSwitch();
    },
    [title, body, editingField, draft.title, draft.body],
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

  const isDirty = draft.title !== title || draft.body !== body;

  return {
    editingField,
    draft,
    isDirty,
    startEdit,
    updateDraft,
    save,
    cancel,
    isEditingTitle: editingField === "title",
    isEditingBody: editingField === "body",
  };
}
