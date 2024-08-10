import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export const GET = async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { success: false, message: "Invalid Authorization Header" },
        { status: 401 }
      );
    }

    const unUsedMediaFiles = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    new UTApi().deleteFiles(
      unUsedMediaFiles.map(
        (file) =>
          file.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
      )
    );

    await prisma.media.deleteMany({
      where: {
        id: { in: unUsedMediaFiles.map((file) => file.id) },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Uploads are cleared",
      },
      { status: 200 }
    );
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
};
