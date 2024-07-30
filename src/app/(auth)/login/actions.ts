"use server";
import { loginSchema } from "@/lib/validation";
import * as z from "zod";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function login(
  credential: z.infer<typeof loginSchema>
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credential);

    if (!username || !password) {
      return {
        error: "Invalid credentials",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Invalid credentials",
      };
    }

    const isMatchedPassword = await verify(
      existingUser.passwordHash,
      password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!isMatchedPassword) {
      return {
        error: "Invalid credentials",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    return { error: "Something went wrong. Please try again." };
  }
}
