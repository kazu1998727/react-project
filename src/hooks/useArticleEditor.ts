import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod/v4";
import { contentSchema, type ContentFormErrors } from "../schemas/content";

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
  const [errors, setErrors] = useState<ContentFormErrors>({});
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
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const save = () => {
    const result = contentSchema.safeParse(draft);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        body: fieldErrors.body?.[0],
      });
      return;
    }
    setErrors({});
    setDraft((currentDraft) => {
      onSave(currentDraft);
      return currentDraft;
    });
    setEditingField(null);
    onEditEndRef.current?.();
  };

  const cancel = useCallback(() => {
    setDraft({ title, body });
    setErrors({});
    setEditingField(null);
    onEditEndRef.current?.();
  }, [title, body]);

  const isDirty = draft.title !== title || draft.body !== body;

  return {
    editingField,
    draft,
    isDirty,
    errors,
    startEdit,
    updateDraft,
    save,
    cancel,
    isEditingTitle: editingField === "title",
    isEditingBody: editingField === "body",
  };
}
