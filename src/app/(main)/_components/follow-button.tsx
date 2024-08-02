"use client";

import useFollowerInfo from "@/app/hooks/use-follower-info";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { followerInformation } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  userId: string;
  initialState: followerInformation;
}

const FollowButton = ({ userId, initialState }: Props) => {
  //toast
  const { toast } = useToast();

  //query client
  const queryClient = useQueryClient();

  //query
  const { data } = useFollowerInfo(userId, initialState);

  //mutation

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      const queryKey: QueryKey = ["follower-info", userId];

      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<followerInformation>(queryKey);

      queryClient.setQueryData<followerInformation>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      const queryKey: QueryKey = ["follower-info", userId];
      if (context?.previousState) {
        queryClient.setQueryData<followerInformation>(queryKey, () => ({
          followers: context?.previousState?.followers!,
          isFollowedByUser: context?.previousState?.isFollowedByUser!,
        }));
      }
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again",
      });
    },
  });

  return (
    <Button
      onClick={() => {
        mutate();
      }}
      className="rounded-2xl"
      disabled={isPending}
      variant={data.isFollowedByUser ? "outline" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
