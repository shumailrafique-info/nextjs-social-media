"use client";
import InfiniteScrollContainer from "@/app/_components/infinite-scroll-container";
import kyInstance from "@/lib/ky";
import { notificationsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PostSkeleton from "../../_components/post-skeleton";
import Notification from "./notification";

export interface NotificationsApiResponse {
  success: boolean;
  data: notificationsPage;
}

const fetchBookmarkedPosts = async (
  searchParams: string | null
): Promise<notificationsPage> => {
  const response: NotificationsApiResponse = await kyInstance
    .get(
      "/api/notifications",
      searchParams ? { searchParams: { cursor: searchParams } } : {}
    )
    .json();
  if (!response.success) {
    throw new Error("Failed to fetch notifications");
  }
  return response.data;
};

interface Props {}

const Notifications = ({}: Props) => {
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<notificationsPage>({
    queryKey: ["notification"],
    queryFn: ({ pageParam }: any) =>
      fetchBookmarkedPosts(pageParam ? pageParam : ""),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const notificaitons = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending" && !isFetchingNextPage) return <PostSkeleton />;

  if (status === "success" && !notificaitons.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        you don&apos;t have any notifications yet.
      </p>
    );

  if (status === "error") {
    console.log(error);
    return (
      <p className="text-center text-destructive">
        An error occured while loading notificaitons.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <InfiniteScrollContainer
        className="space-y-3"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {notificaitons?.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </InfiniteScrollContainer>
      {isFetchingNextPage && <PostSkeleton />}
      {status === "success" && !hasNextPage && (
        <p className="text-center text-sm text-muted-foreground">
          No more notificaitons.
        </p>
      )}
    </div>
  );
};

export default Notifications;
