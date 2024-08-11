"use client";

import useBookmarkInfo from "@/app/hooks/use-bookmark-info";
import { useToast } from "@/components/ui/use-toast";
import kyInstance from "@/lib/ky";
import { bookmarkInformation, likeInformation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart } from "lucide-react";

interface Props {
  postId: string;
  initialState: bookmarkInformation;
}

const BookMarkButton = ({ postId, initialState }: Props) => {
  //toast
  const { toast } = useToast();

  //query client
  const queryClient = useQueryClient();

  //query
  const { data } = useBookmarkInfo(postId, initialState);

  //Query key
  const queryKey: QueryKey = ["bookmark-info", postId];

  //mutation
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        variant: "success",
        description: data.isBookmarkedByUser
          ? "Post removed from bookmarks"
          : "Post added to bookmarks",
      });
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<bookmarkInformation>(queryKey);

      queryClient.setQueryData<bookmarkInformation>(queryKey, () => ({
        bookmarks:
          (previousState?.bookmarks || 0) +
          (previousState?.isBookmarkedByUser ? -1 : 1),
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData<bookmarkInformation>(
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
      className={`flex items-center gap-1`}
      disabled={isPending}
    >
      <span className="text-sm font-medium tabular-nums">
        {data?.bookmarks}
      </span>
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary"
        )}
      />
    </button>
  );
};

export default BookMarkButton;
