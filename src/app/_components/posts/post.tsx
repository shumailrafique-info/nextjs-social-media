"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postData } from "@/lib/types";
import { cn, formateRelativeDate } from "@/lib/utils";
import Link from "next/link";
import MoreOptionPostButton from "./more-options-post-button";
import { useSession } from "@/app/(main)/_providers/session-provider";
import LinkifyContent from "../linkify-content";
import UserTooltip from "../user-tooltip";
import { Media } from "@prisma/client";
import Image from "next/image";

interface Props {
  post: postData;
}

const Post = ({ post }: Props) => {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-4 shadow-md dark:border sm:p-5">
      <div className="flex items-center justify-between gap-3">
        {/* Post user info  */}
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <Avatar className="max-h-[40px] max-w-[40px]">
                <AvatarImage
                  src={post.user.avatarUrl || ""}
                  alt={post.user.displayName}
                />
                <AvatarFallback>SR</AvatarFallback>
              </Avatar>
            </Link>
          </UserTooltip>
          <div className="flex flex-col items-start">
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium leading-[1.4] hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-[13px] text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formateRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {/* Post actions  */}
        {post.userId === user.id && (
          <div className="flex items-center justify-center opacity-0 transition group-hover/post:opacity-[1]">
            {<MoreOptionPostButton post={post} />}
          </div>
        )}
      </div>

      {/*Post Content  */}
      <LinkifyContent>
        <div className="whitespace-pre-wrap break-words">{post.content}</div>
      </LinkifyContent>
      {/* Attachments Box  */}
      {post?.attachments && post?.attachments?.length > 0 && (
        <AttachemntsBox attachments={post.attachments} />
      )}
    </article>
  );
};

export default Post;

interface AttachemntsBoxProps {
  attachments: Media[];
}

const AttachemntsBox = ({ attachments }: AttachemntsBoxProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((attachment, i) => (
        <AttachmentPreview
          key={`${attachment.id} ${i}`}
          attachment={attachment}
        />
      ))}
    </div>
  );
};

interface AttachemntsPrevProps {
  attachment: Media;
}

const AttachmentPreview = ({ attachment }: AttachemntsPrevProps) => {
  return (
    <>
      {attachment.type === "IMAGE" ? (
        <>
          <Image
            src={attachment.url}
            alt={"Attachment preview"}
            width={500}
            height={500}
            className="aspect-square w-full rounded-2xl border-[3px] object-cover"
          />
        </>
      ) : (
        <>
          {attachment.type === "VIDEO" ? (
            <video
              controls
              preload="auto"
              className={cn(
                "w-full h-full rounded-2xl object-cover border-[3px]"
              )}
            >
              <source src={attachment.url} />
            </video>
          ) : (
            <p>not supported</p>
          )}
        </>
      )}
    </>
  );
};
