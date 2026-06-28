import { z } from "zod/v4";

export const contentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(50, "タイトルは50文字以内で入力してください"),
  body: z
    .string()
    .min(10, "詳細は10文字以上で入力してください")
    .max(2000, "詳細は2000文字以内で入力してください"),
});

export type ContentFormErrors = Partial<Record<"title" | "body", string>>;
