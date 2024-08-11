import LinkifyContent from "@/app/_components/linkify-content";
import Post from "@/app/_components/posts/post";
import UserTooltip from "@/app/_components/user-tooltip";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, postData, userData } from "@/lib/types";
import { Loader2, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import FollowButton from "../../_components/follow-button";

interface Props {
  params: { postId: string };
}

const getPostData = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      ...getPostDataInclude(loggedInUserId),
      content: true,
      id: true,
      createdAt: true,
      userId: true,
    },
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params: { postId },
}: Props): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const post: postData = await getPostData(postId, loggedInUser.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 20)}...`,
  };
}

const PostPage = async ({ params: { postId } }: Props) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return <p>You&apos;r are not authrized to view this page </p>;

  const post: postData = await getPostData(postId, loggedInUser.id);

  return (
    <>
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-4">
          <Post post={post} />
        </div>
        <div className="sticky top-[5rem] hidden h-fit flex-none space-y-5 rounded-2xl md:block xl:w-80">
          <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
            <UserInfoSideBar user={post.user} />
          </Suspense>
        </div>
      </main>
    </>
  );
};

export default PostPage;

interface UserInfoSideBarProps {
  user: userData;
}

const UserInfoSideBar = async ({ user }: UserInfoSideBarProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="w-full space-y-5 rounded-2xl bg-card p-5 shadow-md dark:border">
      <h3 className="text-xl font-bold">About creator</h3>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex w-full items-center gap-3"
        >
          {user?.avatarUrl ? (
            <Image
              src={user?.avatarUrl}
              alt={user?.username}
              width={50}
              className="overflow-hidden rounded-full shadow-md"
              height={50}
            />
          ) : (
            <div className="flex size-[50px] items-center justify-center rounded-full border border-[black]/40 shadow-md dark:border-primary/20">
              <User className="shrink-0" size={30} />
            </div>
          )}
          <div>
            <p className="line-clamp-1 break-all font-semibold leading-[1.3] hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <LinkifyContent>
        <div className="whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </LinkifyContent>
      {user.id !== loggedInUser.id && (
        <FollowButton
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              (follower) => follower.followerId === loggedInUser.id
            ),
          }}
          userId={user.id}
        />
      )}
    </div>
  );
};
