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

export const postSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Can't have more then 5 attachments"),
});

// Define individual validation checks
const validCharacters = /^[A-Za-z0-9 _-]+$/;
const noConsecutiveSpaces = /^(?!.*\s{2,}).*$/;
const correctSpacing = /^[A-Za-z0-9_-]+(?: [A-Za-z0-9_-]+)*$/;

export const editUserProfileSchema = z.object({
  displayName: requiredString
    .regex(validCharacters, "Only letters, numbers, - and _ are allowed")
    .regex(
      noConsecutiveSpaces,
      "Display name cannot contain consecutive spaces."
    )
    .regex(correctSpacing, "Cannot start or end with a space."),
  bio: requiredString.max(255, "Bio must be at most 255 characters"),
});

export type editUserProfileType = z.infer<typeof editUserProfileSchema>;

export const commentSchema = z.object({
  content: requiredString,
});
