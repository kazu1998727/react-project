export const MESSAGES = {
  retry: "更新しました",
  createError: (detail: string) => `新規作成に失敗しました: ${detail}`,
  updateError: (detail: string) => `更新に失敗しました: ${detail}`,
} as const;

export function errorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
