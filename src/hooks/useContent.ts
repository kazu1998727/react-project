import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentApi, type ContentInput } from "../apis/content";

const QUERY_KEY = ["content"] as const;

export const useContentList = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: contentApi.list,
  });

export const useContent = (id: string) =>
  useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => contentApi.get(id),
  });

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ContentInput) => contentApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ContentInput }) =>
      contentApi.update(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] });
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
};
