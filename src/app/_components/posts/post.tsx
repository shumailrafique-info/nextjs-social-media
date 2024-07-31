import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postData } from "@/lib/types";
import { formateRelativeDate } from "@/lib/utils";
import Link from "next/link";

interface Props {
  post: postData;
}

const Post = ({ post }: Props) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-md dark:border">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${post.user.username}`}>
          <Avatar className="max-h-[40px] max-w-[40px]">
            <AvatarImage
              src={post.user.avatarUrl || ""}
              alt={post.user.displayName}
            />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
        </Link>
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
          >
            {formateRelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>
      {/* Content  */}
      <div className="!whitespace-pre-wrap break-words">{post.content}</div>
    </article>
  );
};

export default Post;
