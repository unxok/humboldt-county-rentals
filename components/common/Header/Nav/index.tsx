// "use client";

import { linkPaths, Link, LinkPath } from "@/lib/routing";
import { ThemeSwitcher } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetClose,
} from "@/components/ui/sheet";
import { Loader2, Menu } from "lucide-react";
import { ReactNode } from "react";
import { ProfileButton } from "../../ProfileButton";
import { NavLink } from "@/lib/routing/client";
import { ProfileButton2 } from "../../ProfileButton2";

const navLinkPaths: LinkPath[] = ["/rentals", "/about", "/resources"];

export const Nav = () => {
  return (
    <div className="w-full overflow-x-auto">
      <Desktop />
      <Mobile />
    </div>
  );
};

const renderNavLinks = (
  cb: (props: { href: LinkPath; title: string }) => ReactNode,
) =>
  Object.entries(linkPaths)
    .filter(([href]) => navLinkPaths.includes(href as LinkPath))
    .map(([href, title]) => cb({ href: href as LinkPath, title }));

const Desktop = () => (
  <div className={"hidden w-full justify-between sm:flex"}>
    <nav className="flex w-fit items-center justify-start gap-2 px-8">
      {renderNavLinks(({ href, title }) => (
        <NavLink key={href + "header-nav-link"} href={href}>
          {title}
        </NavLink>
      ))}
    </nav>
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <ProfileButton2 />
      {/* <div
        className={"mt-auto flex w-full items-center justify-center gap-2 p-3"}
      >
        <ProfileButton
          renderAnonymous={
            <>
              <Link href="/signup">
                <Button>sign up</Button>
              </Link>
              <Link href="/login">
                <Button variant={"secondary"}>login</Button>
              </Link>
            </>
          }
        />
      </div> */}
    </div>
  </div>
);
const Mobile = () => (
  <div className={"flex w-full items-center justify-end gap-2 p-1 sm:hidden"}>
    <ThemeSwitcher />
    <ProfileButton2 />
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"default"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Humboldt County Rentals</SheetTitle>
          <SheetDescription>hcr.unxok.com</SheetDescription>
        </SheetHeader>
        <nav className="flex h-full flex-col px-1">
          <SheetClose asChild>
            <NavLink href={"/"} className="rounded-sm">
              Home
            </NavLink>
          </SheetClose>
          {renderNavLinks(({ href, title }) => (
            <SheetClose asChild key={href + "header-nav-link"}>
              <NavLink href={href as LinkPath} className="rounded-sm">
                {title}
              </NavLink>
            </SheetClose>
          ))}
          {/* <div
            className={
              "mt-auto flex w-full flex-col items-center justify-center gap-2 p-3"
            }
          >
            <ProfileButton
              renderAnonymous={
                <>
                  <Link href="/signup" className="w-full">
                    <SheetClose asChild>
                      <Button className="w-full">sign up</Button>
                    </SheetClose>
                  </Link>
                  <Link href="/login" className="w-full">
                    <SheetClose asChild>
                      <Button className="w-full" variant={"secondary"}>
                        login
                      </Button>
                    </SheetClose>
                  </Link>
                </>
              }
            />
          </div> */}
        </nav>
      </SheetContent>
    </Sheet>
  </div>
);
