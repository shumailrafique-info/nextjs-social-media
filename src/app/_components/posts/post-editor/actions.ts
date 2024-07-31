"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postSchema } from "@/lib/validation";
import * as z from "zod";

export async function createPost(values: z.infer<typeof postSchema>) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = postSchema.parse(values);

  if (!content) {
    return {
      error: "Invalid values",
    };
  }

  const post = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
  return { success: true };
}
