import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return Response.json({
      success: true,
      data: {},
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
