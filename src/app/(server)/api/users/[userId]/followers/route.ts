import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { followerInformation } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedinUser } = await validateRequest();

    if (!loggedinUser)
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        followers: {
          where: {
            followerId: loggedinUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user)
      return Response.json(
        {
          success: false,
          message: "User not found. Invalid userId",
        },
        { status: 404 }
      );

    const data: followerInformation = {
      followers: user?._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedinUser } = await validateRequest();

    if (!loggedinUser)
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );

    const follow = await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedinUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedinUser.id,
        followingId: userId,
      },
      update: {},
    });

    await prisma.notification.create({
      data: {
        recipientId: userId,
        issuerId: loggedinUser.id,
        type: "FOLLOW",
        content: `${loggedinUser.displayName} started following you`,
      },
    });

    return Response.json(
      {
        success: true,
        message: `Followed successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    const { user: loggedinUser } = await validateRequest();

    if (!loggedinUser)
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedinUser.id,
          followingId: userId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          recipientId: userId,
          issuerId: loggedinUser.id,
          type: "FOLLOW",
        },
      }),
    ]);

    return Response.json(
      {
        success: true,
        message: `Unfollowed successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
