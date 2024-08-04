"use client";

import { followerInformation, userData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { useSession } from "../(main)/_providers/session-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "../(main)/_components/follow-button";
import LinkifyContent from "./linkify-content";
import FollowerCount from "../(main)/_components/follower-count";

interface UserTooltipProps extends PropsWithChildren {
  user: userData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: followerInformation = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="rounded-2xl border bg-card text-black shadow-lg dark:text-white">
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <Avatar className="max-h-[70px] min-h-[69px] min-w-[69px] max-w-[70px]">
                  <AvatarImage
                    src={user.avatarUrl || ""}
                    alt={user.displayName}
                  />
                  <AvatarFallback>SR</AvatarFallback>
                </Avatar>
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <LinkifyContent>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </LinkifyContent>
            )}
            <div className="flex items-center gap-2">
              <p>Posts: {user?._count.posts}</p>
              <p>
                Followers:{" "}
                <FollowerCount userId={user.id} initialState={followerState} />
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
