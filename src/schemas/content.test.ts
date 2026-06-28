import { contentSchema } from "./content";

const validBase = {
  title: "有効なタイトル",
  body: "10文字以上の有効な本文です。",
};

describe("contentSchema", () => {
  describe("title", () => {
    it("1文字で成功する", () => {
      const result = contentSchema.safeParse({ ...validBase, title: "あ" });
      expect(result.success).toBe(true);
    });

    it("50文字で成功する", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        title: "あ".repeat(50),
      });
      expect(result.success).toBe(true);
    });

    it("空文字でエラーになる", () => {
      const result = contentSchema.safeParse({ ...validBase, title: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title?.[0]).toBe("タイトルを入力してください");
      }
    });

    it("空白のみでエラーになる（trim後に空文字になる）", () => {
      const result = contentSchema.safeParse({ ...validBase, title: "   " });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title?.[0]).toBe("タイトルを入力してください");
      }
    });

    it("51文字でエラーになる", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        title: "あ".repeat(51),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title?.[0]).toBe(
          "タイトルは50文字以内で入力してください",
        );
      }
    });
  });

  describe("body", () => {
    it("10文字で成功する", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        body: "あ".repeat(10),
      });
      expect(result.success).toBe(true);
    });

    it("2000文字で成功する", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        body: "あ".repeat(2000),
      });
      expect(result.success).toBe(true);
    });

    it("9文字でエラーになる", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        body: "あ".repeat(9),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.body?.[0]).toBe("詳細は10文字以上で入力してください");
      }
    });

    it("空文字でエラーになる", () => {
      const result = contentSchema.safeParse({ ...validBase, body: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.body?.[0]).toBe("詳細は10文字以上で入力してください");
      }
    });

    it("2001文字でエラーになる", () => {
      const result = contentSchema.safeParse({
        ...validBase,
        body: "あ".repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.body?.[0]).toBe("詳細は2000文字以内で入力してください");
      }
    });
  });

  describe("複合", () => {
    it("titleとbodyが両方有効なら成功する", () => {
      const result = contentSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it("titleとbodyが両方無効なら両方のエラーが返る", () => {
      const result = contentSchema.safeParse({ title: "", body: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.title).toBeDefined();
        expect(errors.body).toBeDefined();
      }
    });
  });
});
