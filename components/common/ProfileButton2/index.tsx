import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link as BaseLink } from "@/lib/routing";
import { logout } from "@/lib/server-actions";
import { getOwnUsername } from "@/lib/server-only";
import { cn, tryCatch } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { User2 } from "lucide-react";
import { ComponentProps, Suspense } from "react";

export const ProfileButton2 = async () => {
  const { data } = await tryCatch(getOwnUsername());

  return (
    <Suspense
      fallback={
        <Button variant={"ghost"}>
          <User2 />
        </Button>
      }
    >
      <Async username={data ?? undefined} />
    </Suspense>
  );
};

export const Async = ({ username }: { username: string | undefined }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"}>
          <User2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1">
        {username !== undefined && (
          <>
            <h4 className="truncate pb-3 font-semibold">{username}</h4>
            <Link href="/user">account</Link>
            <LogoutButton />
          </>
        )}
        {username === undefined && (
          <>
            <Link href="/login" variant={"ghost"}>
              login
            </Link>
            <Link href="/signup">sign up</Link>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

const LogoutButton = () => (
  <form action={logout} className="w-full">
    <PopoverClose asChild>
      <Button
        type="submit"
        className="text-destructive w-full"
        variant={"ghost"}
      >
        log out
      </Button>
    </PopoverClose>
  </form>
);

const Link = ({
  className,
  children,
  variant = "default",
  ...props
}: ComponentProps<typeof BaseLink> & {
  variant?: ComponentProps<typeof Button>["variant"];
}) => (
  <PopoverClose asChild>
    <BaseLink className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </BaseLink>
  </PopoverClose>
);
