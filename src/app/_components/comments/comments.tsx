"use client";
import kyInstance from "@/lib/ky";
import { commentPage, postData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  if (status === "pending" && !isFetchingNextPage)
    return <Loader2 className="mx-auto animate-spin" />;

  if (status === "success" && !comments.length && !hasNextPage)
    return (
      <p className="text-center text-sm text-muted-foreground">
        No one has commented anything yet
      </p>
    );

  if (status === "error") {
    console.log(error);
    return (
      <p className="text-center text-sm text-destructive">
        An error occured while loading comments of that posts.
      </p>
    );
  }
  // fetch prev Comments
  // () => hasNextPage && !isFetching && fetchNextPage()
  return (
    <div className="space-y-2">
      {/* Comments  */}
      <div className="space-y-3">
        {comments?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !hasNextPage && (
        <p className="text-center text-sm text-muted-foreground">
          No more comments.
        </p>
      )}
    </div>
  );
};

export default Comments;
