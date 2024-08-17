import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import NotificationButton from "./notification-button";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

interface Props {
  className?: string;
}

const MenuBar = async ({ className }: Props) => {
  const { user } = await validateRequest();

  if (!user) return null;

  const count = await prisma.notification.count({
    where: {
      recipientId: user.id,
      isRead: false,
    },
  });

  return (
    <div className={cn("", className)}>
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3`}
        title="Home"
        asChild
      >
        <Link href={"/"}>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationButton
        initialData={{ data: { unreadCount: count }, success: true }}
      />
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3`}
        title="Messages"
        asChild
      >
        <Link href={"/messages"}>
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3`}
        title="Bookmarks"
        asChild
      >
        <Link href={"/bookmarks"}>
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
