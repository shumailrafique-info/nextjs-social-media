"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { editUserProfileSchema, editUserProfileType } from "@/lib/validation";

export async function editProfile(values: editUserProfileType) {
  const { displayName, bio } = editUserProfileSchema.parse(values);

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      displayName,
      bio,
    },
    select: getUserDataSelect(loggedInUser.id),
  });

  return { success: true, data: { updatedUser } };
}
