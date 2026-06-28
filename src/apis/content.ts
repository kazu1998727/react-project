import { client } from "./client";

export type Content = {
  id: string;
  title: string;
  body: string;
};

export type ContentInput = Omit<Content, "id">;

export const contentApi = {
  list: () => client.get<Content[]>("/content"),

  get: (id: string) => client.get<Content>(`/content/${id}`),

  create: (input: ContentInput) => client.post<Content>("/content", input),

  update: (id: string, input: ContentInput) =>
    client.put<Content>(`/content/${id}`, input),

  delete: (id: string) => client.delete<void>(`/content/${id}`),
};
