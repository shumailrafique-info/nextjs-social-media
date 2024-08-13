"use client";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PostPage } from "@/app/(main)/_components/for-you-posts";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { deleteComment } from "./actions";
import { commentPage } from "@/lib/types";

const useDeleteCommentMutation = ({ postId }: { postId: string }) => {
  //toast trigger
  const { toast } = useToast();

  //router for navifation
  const router = useRouter();

  //pathname
  const pathname = usePathname();

  //gettting query client
  const queryClient = useQueryClient();

  //Mutation for post Delete
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async ({ data }) => {
      const queryFilter: QueryFilters = {
        queryKey: ["comments", postId],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<commentPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              comments: page.comments.filter(
                (comment) => comment.id !== data.comment.id
              ),
              previousCursor: page.previousCursor,
            })),
          };
        }
      );

      toast({
        description: "comment deleted successfully!",
      });
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
};

export default useDeleteCommentMutation;
