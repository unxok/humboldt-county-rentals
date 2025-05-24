import BaseLink from "next/link";
import { ComponentProps } from "react";
import {
  redirect as baseRedirect,
  RedirectType,
  usePathname,
} from "next/navigation";
import { cn } from "../utils";
import { link } from "fs";

export const linkPaths = {
  "/": "Home",
  "/rentals": "Rentals",
  "/about": "About",
  "/resources": "Resources",
  "/signup": "Signup",
  "/signup/verify": "Verify signup",
  "/login": "Login",
  "/user": "User",
  "/verify-email": "Verify email",
  "/not-found": "404",
  "/error": "Error",
} satisfies Record<`/${string}`, string>;

export type LinkPath =
  | keyof typeof linkPaths
  | `${keyof typeof linkPaths | ""}?${string}`
  | `${keyof typeof linkPaths}/${string}`;

export type LinkProps = Omit<ComponentProps<typeof BaseLink>, "href"> & {
  href: LinkPath;
};
export const Link = (props: LinkProps) => <BaseLink {...props} />;

export const redirect = (
  url: LinkPath,
  type?: RedirectType,
  searchParams?: Record<string, string>,
) => {
  const query = getQueryString(searchParams);

  return baseRedirect(url + query, type);
};

export const getQueryString = (searchParams?: Record<string, string>) => {
  if (!searchParams) return "";
  return "?" + new URLSearchParams(searchParams).toString();
};
