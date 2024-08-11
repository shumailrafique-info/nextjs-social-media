import kyInstance from "@/lib/ky";
import { bookmarkInformation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useBookmarkInfo(
  postId: string,
  initialState: bookmarkInformation
) {
  const query = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: () =>
      kyInstance
        .get(`/api/posts/${postId}/bookmarks`)
        .json<{ success: boolean; data: bookmarkInformation }>()
        .then((res) => res.data),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
