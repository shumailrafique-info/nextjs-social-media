import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import streamServerClient from "@/lib/stream";

const f = createUploadthing();

export const ourFileRouter = {
  avatar: f({ image: { maxFileSize: "1MB" } })
    .middleware(async ({ req }) => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const prevAvatar = metadata.user.avatarUrl;

      if (prevAvatar) {
        const key = prevAvatar.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarURL = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      await Promise.all([
        prisma.user.update({
          where: {
            id: metadata.user.id,
          },
          data: {
            avatarUrl: newAvatarURL,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarURL,
          },
        }),
      ]);

      return { avatarUrl: newAvatarURL };
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    // video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
          ),
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
