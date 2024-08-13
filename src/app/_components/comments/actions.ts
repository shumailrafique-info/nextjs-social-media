"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, postData } from "@/lib/types";
import { commentSchema } from "@/lib/validation";

export async function createComment({
  post,
  content,
}: {
  post: postData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: contentValue } = commentSchema.parse({ content });

  if (!contentValue) {
    throw new Error("Invalid content");
  }

  const newComment = await prisma.comment.create({
    data: {
      content: contentValue,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return { success: true, data: { comment: { ...newComment } } };
}

export async function deleteComment({ commentId }: { commentId: string }) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!commentId) {
    throw new Error("Comment id is required");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return { success: true, data: { comment } };
}
