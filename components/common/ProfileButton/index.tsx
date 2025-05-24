"use client";

import { useQuery } from "@/components/hooks/useQuery";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link as BaseLink } from "@/lib/routing";
import { logout } from "@/lib/server-actions";
import { createClient } from "@/lib/supabase/client";
// import { getOwnUsername } from "@/lib/server-only";
import { cn, tryCatch } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { Loader2, User2 } from "lucide-react";
import { ComponentProps, ReactNode, Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

// export const ProfileButton = ({
//   renderAnonymous,
// }: {
//   renderAnonymous: ReactNode;
// }) => {
//   return (
//     <Suspense
//       fallback={
//         <Button variant={"ghost"}>
//           <Loader2 className="animate-spin" />
//         </Button>
//       }
//     >
//       <ProfileButtonPromise renderAnonymous={renderAnonymous} />
//     </Suspense>
//   );
// };

export const ProfileButton = ({
  renderAnonymous,
  fallback = (
    <Button variant={"ghost"}>
      <Loader2 className="animate-spin" />
    </Button>
  ),
}: {
  renderAnonymous: ReactNode;
  fallback?: ReactNode;
}) => {
  const { data: username, isPending } = useQuery({
    queryFn: async () => await getOwnUsername(),
  });

  return (
    <>
      {/* {!username && isPending && fallback} */}
      {!username && renderAnonymous}
      {!!username && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"}>
              <User2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col">
            <h4 className="truncate pb-3 font-semibold">{username}</h4>
            <Link href="/user" className="w-full">
              account
            </Link>
            <LogoutButton />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

const LogoutButton = () => (
  <form action={logout} className="w-full">
    <Button className="w-full">log out</Button>
  </form>
);

const Link = ({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseLink>) => (
  <PopoverClose asChild>
    <BaseLink
      className={cn("hover:bg-secondary rounded-md p-2", className)}
      {...props}
    >
      {children}
    </BaseLink>
  </PopoverClose>
);

const getOwnUsername = async (): Promise<string | null> => {
  const db = createClient();

  const getUserResult = await tryCatch(db.auth.getUser());
  if (!getUserResult.success) {
    console.error("getUser threw: ", getUserResult.error);
    return null;
  }
  const getUser = getUserResult.data;
  if (getUser.error) return null;
  const { id } = getUser.data.user;
  const getUsername = await db.from("profiles").select("username").eq("id", id);
  if (getUsername.error || !getUsername.data[0]) return null;
  return getUsername.data[0].username;
};
