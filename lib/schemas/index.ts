import { EmailOtpType } from "@supabase/supabase-js";
import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z
    .string()
    .refine((str) => str.includes("@"), { message: "Invalid email" }),
  password: z.string().min(1, "Must be at least 1 character"),
});
export type SignupForm = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
  email: z
    .string()
    .refine((str) => str.includes("@"), { message: "Invalid email" }),
  password: z.string().min(1, "Must be at least 1 character"),
});
export type LoginForm = z.infer<typeof SignupFormSchema>;

export const VerifyOtpFormSchema = z.object({
  email: z.string(),
  token: z.string(),
  type: z.union([
    z.literal("email" satisfies EmailOtpType),
    z.literal("email_change" satisfies EmailOtpType),
    z.literal("invite" satisfies EmailOtpType),
    z.literal("magiclink" satisfies EmailOtpType),
    z.literal("recovery" satisfies EmailOtpType),
    z.literal("signup" satisfies EmailOtpType),
  ]),
});
export type VerifyOtpForm = z.infer<typeof VerifyOtpFormSchema>;

export const ResendOtpFormSchema = z.object({
  email: z.string(),
  type: z.union([
    z.literal("email_change" satisfies EmailOtpType),
    z.literal("signup" satisfies EmailOtpType),
  ]),
});
export type ResendOtpForm = z.infer<typeof ResendOtpFormSchema>;
