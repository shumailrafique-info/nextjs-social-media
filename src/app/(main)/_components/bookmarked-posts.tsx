"use client";
import InfiniteScrollContainer from "@/app/_components/infinite-scroll-container";
import Post from "@/app/_components/posts/post";
import kyInstance from "@/lib/ky";
import { postData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostSkeleton from "./post-skeleton";

export interface PostPage {
  posts: postData[];
  nextCursor: string | null;
}

export interface PostsApiResponse {
  success: boolean;
  data: PostPage;
}

const fetchBookmarkedPosts = async (
  searchParams: string | null
): Promise<PostPage> => {
  const response: PostsApiResponse = await kyInstance
    .get(
      "/api/posts/bookmarked",
      searchParams ? { searchParams: { cursor: searchParams } } : {}
    )
    .json();
  if (!response.success) {
    throw new Error("Failed to fetch posts");
  }
  return response.data;
};

interface Props {}

const BookmarkedPosts = ({}: Props) => {
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<PostPage>({
    queryKey: ["posts", "bookmarked"],
    queryFn: ({ pageParam }: any) =>
      fetchBookmarkedPosts(pageParam ? pageParam : ""),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending" && !isFetchingNextPage) return <PostSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        you don&apos;t have any bookmarked yet.
      </p>
    );

  if (status === "error") {
    console.log(error);
    return (
      <p className="text-center text-destructive">
        An error occured while loading bookmarked posts.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <InfiniteScrollContainer
        className="space-y-3"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScrollContainer>
      {isFetchingNextPage && <PostSkeleton />}
      {status === "success" && !hasNextPage && (
        <p className="text-center text-muted-foreground">
          No more bookmarked posts.
        </p>
      )}
    </div>
  );
};

export default BookmarkedPosts;
