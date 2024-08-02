"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function deletePost(postId: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!postId) {
    throw new Error("PostId is required");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: postDataInclude,
  });

  if (!post) throw new Error("post not found invalid postId");

  if (post.userId !== user.id) throw new Error("Unauthorized user");

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
    include: postDataInclude,
  });

  return { success: true, deletedPost };
}
