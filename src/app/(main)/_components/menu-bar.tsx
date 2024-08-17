"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
}

const MenuBar = ({ className }: Props) => {
  const pathname = usePathname();
  return (
    <div className={cn("", className)}>
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3 ${
          pathname === "/" && "bg-accent"
        }`}
        title="Home"
        asChild
      >
        <Link href={"/"}>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3 ${
          pathname.startsWith("/notifications") && "bg-accent"
        }`}
        title="Notifications"
        asChild
      >
        <Link href={"/notifications"}>
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className={`flex items-center justify-start gap-3 ${
          pathname.startsWith("/messages") && "bg-accent"
        }`}
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
        className={`flex items-center justify-start gap-3 ${
          pathname.startsWith("/bookmarks") && "bg-accent"
        }`}
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
