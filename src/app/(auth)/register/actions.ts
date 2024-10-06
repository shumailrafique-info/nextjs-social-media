"use server";
import { registerSchema } from "@/lib/validation";
import * as z from "zod";
import { hash } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";
import streamServerClient from "@/lib/stream";

export async function register(
  credential: z.infer<typeof registerSchema>
): Promise<{ error: string }> {
  try {
    const { username, email, password } = registerSchema.parse(credential);

    if (!username || !email || !password) {
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

    if (existingUser) {
      return { error: "Username already taken" };
    }
    const existingUserWithEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingUserWithEmail) {
      return { error: "Email already taken" };
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const user = await prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({
        data: {
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
      await streamServerClient.upsertUser({
        id: user?.id,
        name: username,
        username,
      });
      return user;
    });

    const session = await lucia.createSession(user.id, {});
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
