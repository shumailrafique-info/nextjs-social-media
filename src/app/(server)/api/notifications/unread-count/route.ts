import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        isRead: false,
      },
    });

    const data: NotificationCountInfo = {
      unreadCount,
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
