import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { notificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";

interface Props {
  notification: notificationData;
}

const Notification = ({ notification }: Props) => {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} started following you`,
      icon: <User className="sie-7 fill-primary text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircle className="sie-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post`,
      icon: <Heart className="sie-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.issuer.username}`,
    },
  };

  const { href, icon, message } = notificationTypeMap[notification.type];
  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card dark:border shadow-md transition p-5 hover:bg-card/70 dark:hover:bg-primary/10",
          !notification.isRead && "bg-green-500/20"
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <Avatar className="max-h-[35px] max-w-[35px]">
            <AvatarImage
              src={notification.issuer.avatarUrl || ""}
              alt={notification.issuer.displayName}
            />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/users/${notification.issuer.username}`}
              className="font-semibold hover:underline"
            >
              {notification.issuer.displayName}
            </Link>{" "}
            <span className="">{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Notification;
