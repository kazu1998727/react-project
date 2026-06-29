import { renderHook, act } from "@testing-library/react";
import { useArticleEditor } from "./useArticleEditor";

const BASE = {
  title: "テストタイトル",
  body: "10文字以上の有効な本文です。",
};

describe("useArticleEditor", () => {
  describe("save()", () => {
    it("バリデーション通過時に onSave が呼ばれ editingField がクリアされる", () => {
      const onSave = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, onSave),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", "新しいタイトル"));
      act(() => result.current.save());

      expect(onSave).toHaveBeenCalledWith({
        title: "新しいタイトル",
        body: BASE.body,
      });
      expect(result.current.editingField).toBeNull();
      expect(result.current.errors).toEqual({});
    });

    it("タイトルが空のとき onSave が呼ばれずエラーがセットされる", () => {
      const onSave = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, onSave),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", ""));
      act(() => result.current.save());

      expect(onSave).not.toHaveBeenCalled();
      expect(result.current.errors.title).toBe("タイトルを入力してください");
    });

    it("空白のみのタイトルでも onSave が呼ばれずエラーがセットされる", () => {
      const onSave = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, onSave),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", "   "));
      act(() => result.current.save());

      expect(onSave).not.toHaveBeenCalled();
      expect(result.current.errors.title).toBe("タイトルを入力してください");
    });

    it("本文が9文字のとき onSave が呼ばれずエラーがセットされる", () => {
      const onSave = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, onSave),
      );

      act(() => result.current.startEdit("body"));
      act(() => result.current.updateDraft("body", "あ".repeat(9)));
      act(() => result.current.save());

      expect(onSave).not.toHaveBeenCalled();
      expect(result.current.errors.body).toBe(
        "詳細は10文字以上で入力してください",
      );
    });
  });

  describe("cancel()", () => {
    it("draft・エラー・editingField が初期値にリセットされる", () => {
      const onSave = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, onSave),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", ""));
      act(() => result.current.save()); // エラーをセット

      act(() => result.current.cancel());

      expect(result.current.draft).toEqual(BASE);
      expect(result.current.errors).toEqual({});
      expect(result.current.editingField).toBeNull();
    });
  });

  describe("isDirty", () => {
    it("初期値から変更がないとき false", () => {
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, vi.fn()),
      );

      expect(result.current.isDirty).toBe(false);
    });

    it("タイトルを変更したとき true", () => {
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, vi.fn()),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", "変更後のタイトル"));

      expect(result.current.isDirty).toBe(true);
    });

    it("変更後に cancel すると false に戻る", () => {
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, vi.fn()),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", "変更後のタイトル"));
      act(() => result.current.cancel());

      expect(result.current.isDirty).toBe(false);
    });
  });

  describe("startEdit()", () => {
    it("dirty な状態で別フィールドへ切り替えると onBeforeSwitchField が呼ばれる", () => {
      const onBeforeSwitchField = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, vi.fn(), {
          onBeforeSwitchField,
        }),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.updateDraft("title", "変更後のタイトル"));
      act(() => result.current.startEdit("body"));

      expect(onBeforeSwitchField).toHaveBeenCalledOnce();
    });

    it("dirty でない状態で別フィールドへ切り替えても onBeforeSwitchField が呼ばれない", () => {
      const onBeforeSwitchField = vi.fn();
      const { result } = renderHook(() =>
        useArticleEditor(BASE.title, BASE.body, vi.fn(), {
          onBeforeSwitchField,
        }),
      );

      act(() => result.current.startEdit("title"));
      act(() => result.current.startEdit("body")); // 変更なしで切り替え

      expect(onBeforeSwitchField).not.toHaveBeenCalled();
    });
  });
});
