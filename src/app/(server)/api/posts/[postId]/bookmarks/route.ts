import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { bookmarkInformation, likeInformation } from "@/lib/types";

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
        bookmarks: {
          where: {
            userId: loggedinUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
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

    const data: bookmarkInformation = {
      bookmarks: post?._count.bookmarks,
      isBookmarkedByUser: !!post.bookmarks.length,
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

    await prisma.bookmark.upsert({
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
        message: `Bookmarked successfully`,
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

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedinUser.id,
        postId: postId,
      },
    });

    return Response.json(
      {
        success: true,
        message: `Removed from bookmarks successfully`,
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
