import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
export async function GET() {
  try {
    const { user } = await validateRequest();

    console.log(`Calling get-token for user`, user?.id);

    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      user?.id,
      expirationTime,
      issuedAt
    );

    return Response.json({
      success: true,
      data: { token },
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
