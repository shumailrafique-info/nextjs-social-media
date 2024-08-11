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
    });

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

    await prisma.like.deleteMany({
      where: {
        userId: loggedinUser.id,
        postId: postId,
      },
    });

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
