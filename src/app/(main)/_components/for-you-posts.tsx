"use client";
import Post from "@/app/_components/posts/post";
import { postData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./post-skeleton";
import kyInstance from "@/lib/ky";

interface ApiResponse {
  success: boolean;
  data: {
    posts: postData[];
  };
}

const fetchPosts = async (): Promise<postData[]> => {
  const response: ApiResponse = await kyInstance
    .get("/api/posts/for-you")
    .json();
  if (!response.success) {
    throw new Error("Failed to fetch posts");
  }
  return response.data.posts;
};

interface Props {}

const ForYouPosts = ({}: Props) => {
  const query = useQuery<postData[]>({
    queryKey: ["posts", "for-you"],
    queryFn: fetchPosts,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (query.status === "pending") return <PostSkeleton />;

  if (query.status === "error") {
    console.log(query.error);
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {query.data?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default ForYouPosts;
