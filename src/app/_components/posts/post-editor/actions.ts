"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { postSchema } from "@/lib/validation";
import * as z from "zod";

export async function createPost(values: z.infer<typeof postSchema>) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = postSchema.parse(values);

  if (!content) {
    throw new Error("Invalid content");
  }

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: postDataInclude,
  });
  return { success: true, newPost: newPost };
}
