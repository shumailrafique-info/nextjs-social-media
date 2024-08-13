"use client";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { commentPage, postData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentSkeleton from "../comment-skeleton";
import Comment from "./comment";

interface Props {
  post: postData;
}

export interface CommentsApiResponse {
  success: boolean;
  data: commentPage;
}

const fetchComments = async (
  searchParams: string | null,
  postId: string
): Promise<commentPage> => {
  const response: CommentsApiResponse = await kyInstance
    .get(
      `/api/posts/${postId}/comments`,
      searchParams ? { searchParams: { cursor: searchParams } } : {}
    )
    .json();
  if (!response.success) {
    throw new Error("Failed to fetch posts");
  }

  return response.data;
};

const Comments = ({ post }: Props) => {
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<commentPage>({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }: any) =>
      fetchComments(pageParam ? pageParam : "", post.id),
    getNextPageParam: (lastPage) => lastPage.previousCursor,
    initialPageParam: null as string | null,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending" && !isFetchingNextPage) return <CommentSkeleton />;

  if (status === "success" && !comments.length && !hasNextPage)
    return (
      <p className="text-center text-sm text-muted-foreground">
        No comments yet.
      </p>
    );

  if (status === "error") {
    console.log(error);
    return (
      <p className="text-center text-sm text-destructive">
        An error occured while loading comments.
      </p>
    );
  }
  return (
    <div className="w-full space-y-2">
      {isFetchingNextPage && <CommentSkeleton />}
      {hasNextPage && (
        <div className="flex items-center justify-center">
          <Button
            className=""
            onClick={() => hasNextPage && !isFetching && fetchNextPage()}
            variant={"link"}
            disabled={isFetching}
          >
            Load previous comments
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
