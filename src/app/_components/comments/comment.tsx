"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { commentData } from "@/lib/types";
import { formateRelativeDate } from "@/lib/utils";
import Link from "next/link";
import LinkifyContent from "../linkify-content";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(main)/_providers/session-provider";

interface Props {
  comment: commentData;
}

const Comment = ({ comment }: Props) => {
  const { user } = useSession();
  return (
    <div className="group flex items-start gap-2 border-b-[1.5px] border-gray-200 pb-2">
      {/* Pic  */}
      <Avatar className="max-h-[38px] min-h-[38px] min-w-[38px] max-w-[38px]">
        <AvatarImage
          src={comment.user.avatarUrl || ""}
          alt={comment.user.displayName}
        />
        <AvatarFallback>SR</AvatarFallback>
      </Avatar>
      {/* Content */}
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Link
            href={`/users/${comment.user.username}`}
            className="block text-[14px] font-medium leading-[1.3] hover:underline"
          >
            {comment.user.displayName}
          </Link>
          <p
            className="text-[12px] text-muted-foreground"
            suppressHydrationWarning
          >
            {formateRelativeDate(comment.createdAt)}
          </p>
        </div>
        {/*Comment Content  */}
        <LinkifyContent>
          <div className="whitespace-pre-wrap break-words text-[14px]">
            {comment.content}
          </div>
        </LinkifyContent>
      </div>
      {/* Actions  */}
      {user.id === comment.user.id && (
        <div className="opacity-0 transition group-hover:opacity-100">
          <Button className="" size={"icon"} variant={"outline"}>
            <EllipsisIcon size={17} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comment;
