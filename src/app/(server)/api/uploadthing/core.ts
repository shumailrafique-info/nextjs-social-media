import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: "1MB" } })
    .middleware(async ({ req }) => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newAvatarURL = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );
      await prisma.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl: newAvatarURL,
        },
      });
      return { avatarUrl: newAvatarURL };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
