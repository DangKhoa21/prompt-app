import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password must be 30 characters or less" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be 30 characters or less" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password must be 30 characters or less" }),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(5, { message: "Old password must be at least 5 characters long" })
    .max(30, { message: "Old password must be 30 characters or less" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long" })
    .max(30, { message: "New password must be 30 characters or less" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }).jwt({
    message: "Token is invalid",
  }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long" })
    .max(30, { message: "New password must be 30 characters or less" }),
});
