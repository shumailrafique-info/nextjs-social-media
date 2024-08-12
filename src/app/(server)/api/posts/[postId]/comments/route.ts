import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { commentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || "";

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5", 10);

    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -limit - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = comments.length > limit ? comments[0].id : null;

    const data: commentPage = {
      comments: comments.length > limit ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json({
      success: true,
      data: { ...data },
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
