import kyInstance from "@/lib/ky";
import { followerInformation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: followerInformation
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance
        .get(`/api/users/${userId}/followers`)
        .json<{ success: boolean; data: followerInformation }>()
        .then((res) => res.data),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
