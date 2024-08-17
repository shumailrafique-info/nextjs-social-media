import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { likeInformation } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
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

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedinUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post)
      return Response.json(
        {
          success: false,
          message: "Post not found. Invalid postId",
        },
        { status: 404 }
      );

    const data: likeInformation = {
      likes: post?._count.likes,
      isLikedByUser: !!post.likes.length,
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
  { params: { postId } }: { params: { postId: string } }
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

    const like = await prisma.like.upsert({
      where: {
        userId_postId: {
          userId: loggedinUser.id,
          postId: postId,
        },
      },
      create: {
        postId: postId,
        userId: loggedinUser.id,
      },
      update: {},
      include: {
        post: true,
      },
    });

    if (!like.post) {
      return Response.json(
        {
          success: false,
          message: "Post not found. Invalid postId",
        },
        { status: 404 }
      );
    }

    if (loggedinUser.id !== like.post.userId) {
      await prisma.notification.create({
        data: {
          issuerId: loggedinUser.id,
          type: "LIKE",
          postId: like.postId,
          recipientId: like.post.userId,
          content: `${
            loggedinUser.displayName
          } liked your post "${like.post.content.slice(0, 20)}..."`,
        },
      });
    }

    return Response.json(
      {
        success: true,
        message: `liked successfully`,
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
  { params: { postId } }: { params: { postId: string } }
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
      prisma.like.deleteMany({
        where: {
          userId: loggedinUser.id,
          postId: postId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedinUser.id,
          type: "LIKE",
          postId: postId,
          recipientId: postId,
        },
      }),
    ]);

    return Response.json(
      {
        success: true,
        message: `Unliked successfully`,
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
