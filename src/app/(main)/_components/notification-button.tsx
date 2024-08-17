"use client";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";

interface Props {
  initialData: { success: boolean; data: { unreadCount: number } };
}

const NotificationButton = ({ initialData }: Props) => {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<{ success: boolean; data: NotificationCountInfo }>(),
    initialData,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant={"ghost"}
      className={`flex items-center justify-start gap-3`}
      title="Notifications"
      asChild
    >
      <Link href={"/notifications"}>
        <div className="relative">
          <Bell />
          {!!data?.data?.unreadCount && data?.data?.unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 !aspect-square rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data?.data?.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};

export default NotificationButton;
