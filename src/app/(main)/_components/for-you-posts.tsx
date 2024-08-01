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

const fetchPosts = async (searchParams: string | null): Promise<PostPage> => {
  const response: PostsApiResponse = await kyInstance
    .get(
      "/api/posts/for-you",
      searchParams ? { searchParams: { cursor: searchParams } } : {}
    )
    .json();
  if (!response.success) {
    throw new Error("Failed to fetch posts");
  }
  return response.data;
};

interface Props {}

const ForYouPosts = ({}: Props) => {
  const { data, fetchNextPage, isFetching, isFetchingNextPage, status, error } =
    useInfiniteQuery<PostPage>({
      queryKey: ["posts", "for-you"],
      queryFn: ({ pageParam }: any) => fetchPosts(pageParam ? pageParam : ""),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
      // staleTime: 1000 * 60 * 5, // 5 minutes
    });

  if (status === "pending" && !isFetchingNextPage) return <PostSkeleton />;

  if (status === "error") {
    console.log(error);
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts.
      </p>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="space-y-3">
      <InfiniteScrollContainer
        className="space-y-3"
        onBottomReached={fetchNextPage}
      >
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScrollContainer>
      {isFetching && <PostSkeleton />}
    </div>
  );
};

export default ForYouPosts;
