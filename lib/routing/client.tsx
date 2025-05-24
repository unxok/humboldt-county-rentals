"use client";

import { usePathname } from "next/navigation";
import { Link, LinkProps } from ".";
import { cn } from "../utils";

export const NavLink = ({ href, className, ...props }: LinkProps) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "rounded-lg px-2 py-1 align-middle transition-all",
        isActive && "bg-primary text-primary-foreground",
        !isActive && "hover:bg-muted",
        className,
      )}
      data-active={isActive}
    />
  );
};
