"use client";

import useLikeInfo from "@/app/hooks/use-like-info";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { likeInformation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";

interface Props {
  postId: string;
  initialState: likeInformation;
}

const LikeButton = ({ postId, initialState }: Props) => {
  //toast
  const { toast } = useToast();

  //query client
  const queryClient = useQueryClient();

  //query
  const { data } = useLikeInfo(postId, initialState);

  //Query key
  const queryKey: QueryKey = ["like-info", postId];

  //mutation
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<likeInformation>(queryKey);

      queryClient.setQueryData<likeInformation>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData<likeInformation>(
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
    <button
      onClick={() => {
        mutate();
      }}
      className={`flex items-center gap-2`}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500"
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data?.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};

export default LikeButton;
