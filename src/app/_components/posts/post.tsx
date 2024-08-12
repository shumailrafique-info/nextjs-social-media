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
import ImagesModel from "../images-model";
import { useState } from "react";
import LikeButton from "@/app/(main)/_components/like-button";
import BookMarkButton from "@/app/(main)/_components/bookmark-button";
import Comments from "../comments/comments";
import { MessageSquare } from "lucide-react";
import CreateComment from "@/app/_components/comments/create-comment";
interface Props {
  post: postData;
}

const Post = ({ post }: Props) => {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);
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

      <hr className="text-muted-foreground" />

      {/* Like and Comments and bookmarks imformation  */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <LikeButton
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
            postId={post.id}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookMarkButton
          initialState={{
            bookmarks: post._count.bookmarks,
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id
            ),
          }}
          postId={post.id}
        />
      </div>
      {/* Comments section  */}
      {showComments && (
        <div className="mt-2 w-full space-y-5">
          <CreateComment post={post} />
          <Comments post={post} />
        </div>
      )}
    </article>
  );
};

export default Post;

interface AttachemntsBoxProps {
  attachments: Media[];
}

const AttachemntsBox = ({ attachments }: AttachemntsBoxProps) => {
  const [url, setUrl] = useState(
    (attachments?.length > 0 &&
      attachments.filter((attachment) => attachment.type === "IMAGE").length >
        0 &&
      attachments.filter((attachment) => attachment.type === "IMAGE")[0].url) ||
      ""
  );
  const [open, setOpen] = useState(false);
  return (
    <>
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
            onClick={(url) => {
              setOpen(true);
              setUrl(url);
            }}
          />
        ))}
      </div>
      {open && (
        <ImagesModel
          initialImage={url}
          model={open}
          setModel={setOpen}
          modelImages={attachments
            .filter((attachment) => attachment.type === "IMAGE")
            .map((attachment) => attachment.url)}
        />
      )}
    </>
  );
};

interface AttachemntsPrevProps {
  attachment: Media;
  onClick: (url: string) => void;
}

const AttachmentPreview = ({ attachment, onClick }: AttachemntsPrevProps) => {
  return (
    <>
      {attachment.type === "IMAGE" ? (
        <>
          <Image
            src={attachment.url}
            alt={"Attachment preview"}
            onClick={() => onClick(attachment.url)}
            width={500}
            height={500}
            className="aspect-square w-full cursor-pointer rounded-2xl border-[3px] object-cover hover:ring-4"
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

interface CommentButtonProps {
  post: postData;
  onClick: () => void;
}

const CommentButton = ({ onClick, post }: CommentButtonProps) => {
  return (
    <button onClick={onClick} className={`flex items-center gap-2`}>
      <MessageSquare className={cn("size-5")} />
      <span className="text-sm font-medium tabular-nums">
        {post?._count?.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
};
