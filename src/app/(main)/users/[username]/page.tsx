import TrendsSidebar from "@/app/_components/trends-sidebar";
import { validateRequest } from "@/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import { followerInformation, getUserDataSelect, userData } from "@/lib/types";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import FollowButton from "../../_components/follow-button";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/utils";
import FollowerCount from "../../_components/follower-count";
import { Button } from "@/components/ui/button";
import ProfilePagePosts from "../../_components/profile-page.posts";
import { User } from "lucide-react";
import Image from "next/image";
import LinkifyContent from "@/app/_components/linkify-content";

interface Props {
  params: { username: string };
}

const getUserData = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: Props): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUserData(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

const UserProfilePage = async ({ params: { username } }: Props) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return <p>You&apos;r are not authrized to view this page </p>;

  const user = await getUserData(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-xl bg-card p-5 text-center shadow-md dark:border">
          <h2 className="text-2xl font-semibold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <ProfilePagePosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default UserProfilePage;

interface userProfileProps {
  user: userData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: userProfileProps) {
  const followerInfo: followerInformation = {
    followers: user?._count?.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-md dark:border">
      {user?.avatarUrl ? (
        <Image
          src={user?.avatarUrl}
          alt={user?.username}
          width={220}
          className="mx-auto overflow-hidden rounded-full shadow-md"
          height={220}
        />
      ) : (
        <div className="mx-auto flex size-[220px] items-center justify-center rounded-full border border-[black]/40 shadow-md dark:border-card">
          <User className="size-[170px] shrink-0" />
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-semibold dark:text-white">
              {user.displayName}
            </h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user?._count?.posts)}
              </span>
            </span>
            <span>
              Followers:{" "}
              <FollowerCount
                className="font-semibold"
                initialState={{
                  followers: followerInfo.followers,

                  isFollowedByUser: followerInfo?.isFollowedByUser,
                }}
                userId={user?.id}
              />
            </span>
          </div>
        </div>
        <div>
          {user?.id !== loggedInUserId ? (
            <FollowButton
              initialState={{
                followers: followerInfo.followers,
                isFollowedByUser: followerInfo.isFollowedByUser,
              }}
              userId={user.id}
            />
          ) : (
            <Button variant={"default"}>Edit Profile</Button>
          )}
        </div>
      </div>
      {user.bio && (
        <>
          <hr />
          <LinkifyContent>
            <div className="line-clamp-4 whitespace-pre-line break-words text-gray-600 dark:text-gray-400">
              {user.bio}
            </div>
          </LinkifyContent>
        </>
      )}
    </div>
  );
}
