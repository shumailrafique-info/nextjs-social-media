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

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
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
      queryClient.setQueryData<followerInformation>(
        queryKey,
        context?.previousState
      );
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again.",
      });
    },
  });

  return (
    <Button
      onClick={() => {
        mutate();
      }}
      className={`rounded-2xl`}
      disabled={isPending}
      variant={data.isFollowedByUser ? "outline" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
