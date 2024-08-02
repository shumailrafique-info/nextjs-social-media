"use client";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost } from "./actions";
import { PostPage } from "@/app/(main)/_components/for-you-posts";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";

const useDeletePostMutation = () => {
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
    mutationFn: deletePost,
    onSuccess: async ({ deletedPost }) => {
      const queryFilter: QueryFilters = {
        queryKey: ["posts"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
              nextCursor: page.nextCursor,
            })),
          };
        }
      );

      toast({
        description: "Post deleted successfully!",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        return router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
};

export default useDeletePostMutation;
