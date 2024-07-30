import * as z from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const registerSchema = z.object({
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed"
  ),
  email: requiredString.email("Invalid email address"),
  password: requiredString.min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});
