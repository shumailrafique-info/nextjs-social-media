import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notificationsInclude, notificationsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || "";

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notifications.length > limit ? notifications[limit].id : null;

    const data: notificationsPage = {
      notifications: notifications.slice(0, limit),
      nextCursor: nextCursor,
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
