import kyInstance from "@/lib/ky";
import { likeInformation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useLikeInfo(
  postId: string,
  initialState: likeInformation
) {
  const query = useQuery({
    queryKey: ["like-info", postId],
    queryFn: () =>
      kyInstance
        .get(`/api/posts/${postId}/likes`)
        .json<{ success: boolean; data: likeInformation }>()
        .then((res) => res.data),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
