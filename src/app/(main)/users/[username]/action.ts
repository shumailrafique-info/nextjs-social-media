"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { editUserProfileSchema, editUserProfileType } from "@/lib/validation";
import streamServerClient from "@/lib/stream";

export async function editProfile(values: editUserProfileType) {
  const { displayName, bio } = editUserProfileSchema.parse(values);

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) throw new Error("Unauthorized");

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        displayName,
        bio,
      },
      select: getUserDataSelect(loggedInUser.id),
    });
    await streamServerClient.partialUpdateUser({
      id: loggedInUser?.id,
      set: {
        name: displayName,
      },
    });
    return updatedUser;
  });

  return { success: true, data: { updatedUser } };
}
