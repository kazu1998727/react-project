export type Content = {
  id: string;
  title: string;
  body: string;
};

export type ContentInput = Omit<Content, "id">;

export type ContentFormErrors = Partial<Record<"title" | "body", string>>;
