import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type userData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        bookmarks: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type postData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type commentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface commentPage {
  comments: commentData[];
  previousCursor: string | null;
}

export interface followerInformation {
  followers: number;
  isFollowedByUser: boolean;
}

export interface likeInformation {
  likes: number;
  isLikedByUser: boolean;
}

export interface bookmarkInformation {
  bookmarks: number;
  isBookmarkedByUser: boolean;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      avatarUrl: true,
      displayName: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type notificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface notificationsPage {
  notifications: notificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
