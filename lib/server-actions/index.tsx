"use server";

/**
 * - Functions should be mutations
 * - POST is always used under the hood
 * - arguments and return values must be serializable
 */

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import {
  LoginForm,
  LoginFormSchema,
  ResendOtpForm,
  ResendOtpFormSchema,
  SignupForm,
  SignupFormSchema,
  VerifyOtpForm,
  VerifyOtpFormSchema,
} from "../schemas";
import { redirect } from "../routing";
import { AuthApiError, isAuthApiError } from "@supabase/supabase-js";

/**
 * Log out of the current session and redirect to /login
 * @throws
 */
export const logout = async () => {
  const db = await createClient();
  const { error } = await db.auth.signOut();
  if (error) throw new Error(error.message);

  redirect("/login");
};

/**
 * Create a new user in the database and redirect to /verify-email
 * @throws
 */
export const signup = async (credentials: SignupForm) => {
  const parsed = SignupFormSchema.safeParse(credentials);
  if (!parsed.success) throw new Error("Invalid form data");

  const db = await createClient();
  const { error } = await db.auth.signUp(parsed.data);
  if (error) throw new Error(error.message);

  redirect(`/signup/verify?email=${encodeURIComponent(credentials.email)}`);
};

/**
 * Verify an OTP token for the provided purpose
 * @throws
 */
export const verifyOtp = async (credentials: VerifyOtpForm) => {
  const parsed = VerifyOtpFormSchema.safeParse(credentials);
  if (!parsed.success) throw new Error("Invalid data");

  const db = await createClient();
  const { error } = await db.auth.verifyOtp({
    ...parsed.data,
  });
  if (error) throw new Error(error.message);

  redirect("/user");
};

/**
 * Resend OTP token for the provided reason
 * @throws
 */
export const resendSignupOtp = async (credentials: ResendOtpForm) => {
  const parsed = ResendOtpFormSchema.safeParse(credentials);
  if (!parsed.success) throw new Error("Invalid data");
  const db = await createClient();
  const { error } = await db.auth.resend(credentials);
  if (error) throw new Error(error.message);
};

/**
 * Sign in to the database and redirect to /user
 * @remark Will redirect to /signup/verify if email is not confirmed
 * @throws
 */
export const login = async (credentials: LoginForm) => {
  const parsed = LoginFormSchema.safeParse(credentials);
  if (!parsed.success) throw Error("Invalid form data");

  const db = await createClient();
  const { error } = await db.auth.signInWithPassword(parsed.data);
  if (isAuthApiError(error) && error.code === "email_not_confirmed") {
    redirect(`/signup/verify?email=${encodeURIComponent(credentials.email)}`);
  }
  if (error) throw new Error(error.message);

  redirect("/user");
};

/**
 * Likes or unlikes a listing depending on if it's already liked by the user
 * @throws
 */
export const triggerLikeListing = async ({
  listing_id,
  profile_id,
}: {
  listing_id: number;
  profile_id: string;
}) => {
  const db = await createClient();

  const { data, error } = await db.schema("hcr").rpc("toggle_listing_like", {
    p_listing_id: listing_id,
    p_profile_id: profile_id,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
};
